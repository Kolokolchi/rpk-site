import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { catalogIndex } from "../src/shared/catalog-index.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const partial = process.argv.includes("--partial");
const catalogKeys = [...catalogIndex.filter(item => item.imageKind === "illustration").map(item => item.image), "object-retail", "object-food", "object-interior", "object-campus"];
const missing = [];
for (const key of catalogKeys) {
  const input = path.join(root, "artifacts/rebrand/edited", `${key}.png`);
  try { await fs.access(input); } catch { missing.push(key); continue; }
  for (const width of [480, 960, 1536]) {
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 89 }).toFile(path.join(root, "public/assets/catalog", `${key}-${width}.webp`));
  }
}
await fs.mkdir(path.join(root, "public/assets/brand"), { recursive: true });
const imports = [];
const definitions = [];
for (const [index, key] of ["brand-hero", "brand-material"].entries()) {
  const input = path.join(root, "artifacts/rebrand/edited", `${key}.png`);
  const meta = await sharp(input).metadata();
  const widths = [480, 960, 1600];
  for (const width of widths) {
    const name = `${key}-${width}.webp`;
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 90 }).toFile(path.join(root, "public/assets/brand", name));
    imports.push(`const brand${index}w${width} = "/assets/brand/${name}";`);
  }
  const width = Math.min(1600, meta.width);
  const height = Math.round(meta.height * width / meta.width);
  definitions.push(`  "/src/assets/brand/${key}.webp": {src: brand${index}w1600, srcSet: \`${widths.map(w => `\${brand${index}w${w}} ${Math.min(w, meta.width)}w`).join(", ")}\`, width: ${width}, height: ${height}},`);
}
await fs.writeFile(path.join(root, "src/assets/brand-images.ts"), `${imports.join("\n")}\n\nexport const bundledBrandImages: Record<string,{src:string;srcSet:string;width:number;height:number}> = {\n${definitions.join("\n")}\n};\n`);
const logo = await fs.readFile(path.join(root, "public/assets/brand/rpk-logo-light.svg"));
await sharp(logo).resize({ width: 848 }).png().toFile(path.join(root, "artifacts/rebrand/logo-preview.png"));
console.log(`Updated ${catalogKeys.length - missing.length}/${catalogKeys.length} catalog/object illustrations plus two brand images.`);
if (missing.length) {
  console.log(`Pending: ${missing.join(", ")}`);
  if (!partial) process.exitCode = 1;
}
