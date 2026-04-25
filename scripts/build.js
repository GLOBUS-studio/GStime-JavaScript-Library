// Cross-platform build: minify GStime.js with terser and prepend banner.
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const pkg = require("../package.json");
const root = path.resolve(__dirname, "..");
const src = path.join(root, "GStime.js");
const out = path.join(root, "GStime.min.js");
const map = path.join(root, "GStime.min.js.map");

const banner = `/* GStime.js v${pkg.version} | GLOBUS.studio | MIT License */\n`;

console.log("Minifying GStime.js with terser...");
execSync(
  `npx terser "${src}" -c -m --source-map "url='GStime.min.js.map'" -o "${out}"`,
  { stdio: "inherit", cwd: root }
);

const minified = fs.readFileSync(out, "utf8");
fs.writeFileSync(out, banner + minified);

const minSize = fs.statSync(out).size;
const zlib = require("node:zlib");
const gz = zlib.gzipSync(fs.readFileSync(out)).length;
console.log(`Built ${path.basename(out)}: ${minSize} B (gzip ${gz} B)`);
if (fs.existsSync(map)) console.log(`Source map: ${path.basename(map)}`);
