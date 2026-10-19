"use strict";
const fs = require("node:fs"), path = require("node:path");
const { validate } = require("./validate");
const root = path.resolve(__dirname, "..");
const PRODUCTION = ["index.html", "appinfo.json", "css", "js", "assets"];
function stage() {
  validate();
  const output = path.join(root, "dist");
  if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) throw Error("Refusing symlink output");
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output);
  for (const name of PRODUCTION) fs.cpSync(path.join(root, name), path.join(output, name), { recursive: true });
  validate(output);
  return output;
}
if (require.main === module) console.log("Production app staged in " + stage());
module.exports = { stage, PRODUCTION };
