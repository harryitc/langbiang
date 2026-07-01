// Chọn ngẫu nhiên ảnh từ public/img, resize tối ưu web -> public/gallery
import { readdirSync, mkdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/img";
const OUT = "public/gallery";

const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f));

// shuffle Fisher–Yates
for (let i = files.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [files[i], files[j]] = [files[j], files[i]];
}

// slot: tên đích -> số lượng
const plan = [
  { name: "about", w: 1100 },
  { name: "j1", w: 1300 },
  { name: "j2", w: 1300 },
  { name: "j3", w: 1300 },
  ...Array.from({ length: 12 }, (_, i) => ({ name: `g${i + 1}`, w: 1500 })),
];

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const picked = files.slice(0, plan.length);
console.log(`Có ${files.length} ảnh, chọn ngẫu nhiên ${picked.length}.`);

let done = 0;
for (let i = 0; i < plan.length; i++) {
  const src = path.join(SRC, picked[i]);
  const dest = path.join(OUT, `${plan[i].name}.jpg`);
  await sharp(src)
    .rotate() // tôn trọng EXIF orientation
    .resize({ width: plan[i].w, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(dest);
  done++;
  process.stdout.write(`\r  ${done}/${plan.length}  ${plan[i].name} <- ${picked[i]}     `);
}
console.log("\nXong.");
