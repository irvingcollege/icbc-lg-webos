"use strict";
const fs = require("node:fs"), path = require("node:path"), { spawnSync } = require("node:child_process");
const { stage } = require("./build");
const root = path.resolve(__dirname, "..");
const cli = path.dirname(require.resolve("@webos-tools/cli/package.json"));
const state = path.join(root, "work", "cli-state");
fs.mkdirSync(state, { recursive: true });
const env = { ...process.env, APPDATA: state };
function run(name, args) {
  const r = spawnSync(process.execPath, [path.join(cli, "bin", name + ".js"), ...args], { cwd: root, env, encoding: "utf8" });
  process.stdout.write(r.stdout || ""); process.stderr.write(r.stderr || "");
  if (r.error || r.status !== 0) throw r.error || Error(name + " failed: " + r.status);
}
const dist = stage();
const out = path.join(root, "artifacts");
fs.mkdirSync(out, { recursive: true });
const info = require("../appinfo.json");
const ipk = path.join(out, info.id + "_" + info.version + "_all.ipk");
fs.rmSync(ipk, { force: true });
run("ares-config", ["--profile", "tv"]);
run("ares-package", ["--no-minify", dist, "--outdir", out]);
if (!fs.existsSync(ipk) || fs.statSync(ipk).size < 1000) throw Error("LG CLI did not produce expected IPK");
run("ares-package", ["--info", ipk]);
console.log("Built with official @webos-tools/cli " + require("@webos-tools/cli/package.json").version + ": " + ipk);
