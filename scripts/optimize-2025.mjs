// Tối ưu ảnh gốc (public/img, gitignore) -> bản web commit được.
//  1) 3 avatar ban tổ chức -> public/team/
//  2) toàn bộ ảnh mùa 2025 -> public/gallery/2025/  + sinh src/lib/gallery2025.ts
import { readdirSync, mkdirSync, rmSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/img";

// ---- 1) Avatar ban tổ chức ----
const TEAM_OUT = "public/team";
mkdirSync(TEAM_OUT, { recursive: true });
const avatars = [
  { from: "BRO02291.JPG", to: "le-minh-vu.jpg" },
  { from: "BRO01565.JPG", to: "nguyen-anh-hao.jpg" },
  { from: "BRO01234.JPG", to: "pham-minh-phat.jpg" },
];
for (const a of avatars) {
  await sharp(path.join(SRC, a.from))
    .rotate()
    .resize({ width: 700, height: 700, fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(TEAM_OUT, a.to));
  console.log("avatar:", a.to, "<-", a.from);
}

// ---- 2) Thư viện mùa 2025 ----
const G_OUT = "public/gallery/2025";
if (existsSync(G_OUT)) rmSync(G_OUT, { recursive: true, force: true });
mkdirSync(G_OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
console.log(`\nTối ưu ${files.length} ảnh mùa 2025...`);

const items = [];
let done = 0;
for (let i = 0; i < files.length; i++) {
  const base = files[i].replace(/\.(jpe?g|png)$/i, "").toLowerCase();
  const outName = `${base}.jpg`;
  const meta = await sharp(path.join(SRC, files[i]))
    .rotate()
    .resize({ width: 1500, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(G_OUT, outName));
  // tall khi ảnh dọc (cao > rộng)
  const tall = meta.height > meta.width;
  items.push({ src: `/gallery/2025/${outName}`, caption: `Trăng sáng Langbiang 2025 · #${String(i + 1).padStart(2, "0")}`, tall });
  done++;
  process.stdout.write(`\r  ${done}/${files.length}  ${outName}        `);
}

const ts = `// Tự sinh bởi scripts/optimize-2025.mjs — bộ ảnh THẬT mùa 2025 (${items.length} ảnh, đã tối ưu web).
// Dùng riêng cho thư viện trang /2025, tách khỏi carousel trang chủ.
export const gallery2025 = ${JSON.stringify(items, null, 2)} as const;
`;
writeFileSync("src/lib/gallery2025.ts", ts);
console.log(`\nXong. Ghi src/lib/gallery2025.ts (${items.length} ảnh).`);
