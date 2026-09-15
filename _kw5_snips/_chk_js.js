const fs = require("fs");
const vm = require("vm");
try {
  new vm.Script(fs.readFileSync(process.argv[1], "utf8"), { filename: "kw.js" });
  console.log("OK");
} catch (e) {
  console.log(String(e.message).slice(0, 300));
}
