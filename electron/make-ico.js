const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function pngToIco() {
  const sizes = [16, 32, 48, 256];
  const svg = fs.readFileSync(path.join(__dirname, "..", "public", "icon-512.svg"));
  const pngs = [];
  for (const s of sizes) {
    pngs.push(await sharp(svg).resize(s, s).png().toBuffer());
  }

  const count = pngs.length;
  const headerSize = 6;
  let offset = headerSize + 16 * count;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirs = [];
  for (let i = 0; i < count; i++) {
    const dir = Buffer.alloc(16);
    const s = sizes[i];
    dir.writeUInt8(s < 256 ? s : 0, 0);
    dir.writeUInt8(s < 256 ? s : 0, 1);
    dir.writeUInt8(0, 2);
    dir.writeUInt8(0, 3);
    dir.writeUInt16LE(1, 4);
    dir.writeUInt16LE(32, 6);
    dir.writeUInt32LE(pngs[i].length, 8);
    dir.writeUInt32LE(offset, 12);
    offset += pngs[i].length;
    dirs.push(dir);
  }

  const ico = Buffer.concat([header, ...dirs, ...pngs]);
  fs.writeFileSync(path.join(__dirname, "icon.ico"), ico);
  console.log("ICO created:", ico.length, "bytes");
}

pngToIco();
