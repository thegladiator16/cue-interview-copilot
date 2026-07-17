const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const svg = fs.readFileSync(path.join(__dirname, "..", "public", "icon-512.svg"));

async function generate() {
  await sharp(svg).resize(512, 512).png().toFile(path.join(__dirname, "icon.png"));
  await sharp(svg).resize(16, 16).png().toFile(path.join(__dirname, "tray-icon.png"));
  await sharp(svg).resize(256, 256).png().toFile(path.join(__dirname, "icon.ico.png"));
  console.log("Icons generated.");
}

generate().catch(console.error);
