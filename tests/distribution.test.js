"use strict";
const test = require("node:test"), assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const { validate } = require("../scripts/validate"), { stage, PRODUCTION } = require("../scripts/build");
test("LG manifest and production allowlist are valid and exclude Samsung packaging", () => {
  assert.equal(validate().id, "church.irvingcollege.icbc");
  const dist = stage();
  assert.deepEqual(fs.readdirSync(dist).sort(), [...PRODUCTION].sort());
  for (const file of ["config.xml", "node_modules", "tests", ".git", "scripts"]) assert(!fs.existsSync(path.join(dist, file)));
});
test("existing livestream and catalog endpoints are preserved", () => {
  const app = fs.readFileSync("js/app.js", "utf8");
  for (const url of ["https://live.irvingcollege.church/hls/stream.m3u8", "https://live.irvingcollege.church/sermons/catalog.json"]) assert(app.includes(url));
});
