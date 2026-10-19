"use strict";
const fs = require("node:fs"), path = require("node:path"), assert = require("node:assert/strict"), acorn = require("acorn");
const root = path.resolve(__dirname, "..");
function validate(base = root) {
  const info = JSON.parse(fs.readFileSync(path.join(base, "appinfo.json")));
  assert.match(info.id, /^[a-z][a-z0-9]*(\.[a-z0-9-]+)+$/);
  assert.equal(info.version, require("../package.json").version);
  assert.equal(info.type, "web");
  assert.deepEqual(info.requiredACG, []);
  assert.equal(info.main, "index.html");
  assert.equal(info.resolution, "1920x1080");
  assert(info.title.length <= 20, "Launcher title exceeds LG App Resources guidance");
  assert(info.appDescription.length <= 60);
  assert.equal(info.splashBackground, "assets/lg-splash.png");
  const splash = fs.readFileSync(path.join(base, info.splashBackground));
  assert.equal(splash.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(splash.readUInt32BE(16), 1920);
  assert.equal(splash.readUInt32BE(20), 1080);
  assert.equal(info.disableBackHistoryAPI, true);
  for (const [field, size] of [["icon", 80], ["largeIcon", 130]]) {
    assert(!info[field].includes("..") && !path.isAbsolute(info[field]));
    const png = fs.readFileSync(path.join(base, info[field]));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
  }
  for (const file of fs.readdirSync(path.join(base, "js"))) {
    const source = fs.readFileSync(path.join(base, "js", file), "utf8");
    acorn.parse(source, { ecmaVersion: 5 });
    assert(!/webapis|tizen\./i.test(source), "Samsung runtime reference: " + file);
  }
  const html = fs.readFileSync(path.join(base, "index.html"), "utf8");
  assert(!/WEBAPIS|avplayer|<object/i.test(html));
  assert(html.includes("Content-Security-Policy") && html.includes("object-src 'none'"));
  assert(!html.includes("unsafe-eval") && !html.includes("unsafe-inline"));
  assert(html.includes('<video id="video"'));
  for (const file of ["app.js", "platform.js", "catalog.js"])
    assert(html.includes("js/" + file));
  const vendor = fs.readFileSync(path.join(base, "assets/vendor/hls.min.js"));
  assert(vendor.equals(fs.readFileSync(require.resolve("hls.js/dist/hls.min.js"))), "Vendored HLS differs from pinned dependency");
  return info;
}
if (require.main === module) console.log("Validated webOS metadata, icons, ES5 application scripts and bundled HLS: " + validate().id);
module.exports = { validate };
