"use strict";
const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), vm = require("node:vm");
function adapter({ native = true, legacy = false, hls = false } = {}) {
  const events = [], timers = new Map(), scripts = [], calls = [];
  let timer = 0, rejectPlay;
  const video = {
    style: {}, paused: true, currentTime: 40, duration: 120,
    canPlayType: () => native ? "probably" : "",
    play() { this.paused = false; calls.push("play"); return legacy ? undefined : new Promise((resolve, reject) => { rejectPlay = reject; }); },
    pause() { this.paused = true; calls.push("pause"); },
    removeAttribute() { delete this.src; }, load() { calls.push("load"); }
  };
  let instance;
  class Hls {
    static Events = { MANIFEST_PARSED: "manifest", ERROR: "error" };
    static isSupported() { return true; }
    constructor() { instance = this; this.handlers = {}; }
    on(e, cb) { this.handlers[e] = cb; }
    loadSource(url) { this.url = url; }
    attachMedia(el) { this.video = el; }
    destroy() { this.destroyed = true; }
  }
  const window = { navigator: { userAgent: "browser" }, close: () => calls.push("exit") };
  if (hls) window.Hls = Hls;
  vm.runInNewContext(fs.readFileSync("js/platform.js", "utf8"), {
    window, Number,
    document: { createElement: () => ({}), head: { appendChild: s => scripts.push(s) } },
    setTimeout: cb => { timers.set(++timer, cb); return timer; },
    clearTimeout: id => timers.delete(id)
  });
  const platform = window.ICBCPlatform;
  platform.init(video, Object.fromEntries(["ready", "buffering", "paused", "error", "ended", "time", "exitUnavailable"].map(e => [e, v => events.push([e, v])])));
  return { platform, video, events, timers, scripts, calls, window, instance: () => instance, reject: () => rejectPlay(Error("blocked")), expire: () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(cb => cb()); } };
}
test("native LG HLS uses HTML video and no script fallback", () => {
  const a = adapter(); a.platform.open("https://live.irvingcollege.church/hls/stream.m3u8");
  assert.match(a.video.src, /stream.m3u8$/); assert.equal(a.scripts.length, 0);
  a.video.onplaying(); assert(a.events.some(e => e[0] === "ready"));
  a.platform.pause(); assert(a.video.paused); a.platform.resume(); assert(!a.video.paused);
  a.platform.seek(-30); assert.equal(a.video.currentTime, 10);
  a.platform.seek(300); assert.equal(a.video.currentTime, 120);
  a.platform.seek(-300); assert.equal(a.video.currentTime, 0);
  a.platform.close(); assert.equal(a.video.src, undefined); assert.equal(a.video.onplaying, null); assert.equal(a.timers.size, 0);
});
test("older video engines with a void play return are supported", () => {
  const a = adapter({ legacy: true }); assert.doesNotThrow(() => a.platform.open("a.mp4"));
  a.video.onplaying(); assert(!a.events.some(e => e[0] === "error")); a.platform.close();
});
test("Pause while HLS manifest loads survives asynchronous preparation", () => {
  const a = adapter({ native: false, hls: true }); a.platform.open("a.m3u8");
  a.platform.pause(); a.instance().handlers.manifest();
  assert.equal(a.calls.filter(x => x === "play").length, 0);
  a.platform.resume(); assert.equal(a.calls.filter(x => x === "play").length, 1);
  a.platform.close(); assert(a.instance().destroyed);
});
test("stale play rejection cannot overwrite Retry or an intentional pause", async () => {
  const a = adapter(); a.platform.open("a.mp4");
  a.reject(); a.platform.open("b.mp4"); await Promise.resolve();
  assert(!a.events.some(e => e[0] === "error"));
  a.reject(); a.platform.pause(); await Promise.resolve();
  assert(!a.events.some(e => e[0] === "error")); a.platform.close();
});
test("play rejection and native media errors recover with Retry", async () => {
  const a = adapter(); a.platform.open("a.mp4"); a.reject(); await Promise.resolve();
  assert.match(a.events.find(e => e[0] === "error")[1], /Retry/);
  a.platform.open("b.mp4"); a.video.onplaying();
  assert.equal(a.events.at(-2)[0], "ready");
  a.video.onerror(); assert.match(a.events.at(-1)[1], /Retry/); a.platform.close();
});
test("startup timeout and mid-playback stall have bounded recovery", () => {
  const a = adapter(); a.platform.open("a.mp4"); a.expire();
  assert.match(a.events.at(-1)[1], /did not respond/);
  a.platform.open("b.mp4"); a.video.onplaying(); a.video.onwaiting(); a.expire();
  assert.match(a.events.at(-1)[1], /Retry/);
  a.platform.open("c.mp4"); a.platform.pause(); assert.equal(a.timers.size, 0);
  a.platform.resume(); assert.equal(a.timers.size, 1); a.platform.close();
});
test("closed sessions ignore saved handlers, late HLS loads and timeouts", () => {
  const a = adapter({ native: false }); a.platform.open("a.m3u8");
  const error = a.video.onerror, waiting = a.video.onwaiting, timer = [...a.timers.values()][0];
  a.platform.close(); const count = a.events.length;
  a.scripts[0].onload(); error(); waiting(); timer();
  assert.equal(a.events.length, count); assert.equal(a.timers.size, 0);
});
test("HLS fatal errors and missing fallback produce recoverable errors", () => {
  const a = adapter({ native: false, hls: true }); a.platform.open("a.m3u8");
  a.instance().handlers.error(null, { fatal: true }); assert.match(a.events.at(-1)[1], /offline/);
  const b = adapter({ native: false }); b.platform.open("a.m3u8"); b.scripts[0].onload();
  assert.match(b.events.at(-1)[1], /unavailable/); a.platform.close(); b.platform.close();
});
test("infinite live duration is not seeked and ended/time events are forwarded", () => {
  const a = adapter(); a.platform.open("a.mp4"); a.video.duration = Infinity; a.platform.seek(30);
  assert.equal(a.video.currentTime, 40); a.video.ontimeupdate(); assert.equal(a.events.at(-1)[0], "time");
  a.video.onended(); assert.equal(a.events.at(-1)[0], "ended"); assert.equal(a.timers.size, 0); a.platform.close();
});
test("LG exit closes media and window; browser exposes exitUnavailable", () => {
  const a = adapter(); a.platform.exit(); assert.equal(a.events.at(-1)[0], "exitUnavailable");
  a.window.PalmSystem = {}; a.platform.exit(); assert(a.calls.includes("exit"));
});
test("native playing callback respects Pause requested during startup", () => {
  const a = adapter(); a.platform.open("a.mp4"); a.platform.pause();
  a.video.onplaying(); assert(a.video.paused);
  assert(!a.events.some(e => e[0] === "ready")); a.platform.close();
});
test("queued HTML pause event cannot cancel a newer resume request", () => {
  const a = adapter(); a.platform.open("a.mp4");
  a.platform.pause(); a.platform.resume();
  a.video.onpause(); // The earlier pause event arrives after play().
  a.video.onplaying();
  assert.equal(a.video.paused, false);
  assert.equal(a.events.at(-1)[1], false); a.platform.close();
});
