const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "src", "generated", "prisma");
const dest = path.join(__dirname, "..", "dist", "generated", "prisma");

fs.cpSync(src, dest, { recursive: true, force: true });

console.log("Copied Prisma generated client assets to dist/");