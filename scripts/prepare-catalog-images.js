import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "artifacts/catalog/generated-assets-v2.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const output = path.join(root, "public/assets/catalog");
const originals = path.join(root, "artifacts/catalog/originals");
await fs.mkdir(output, { recursive: true });
await fs.mkdir(originals, { recursive: true });
const imports = [];
const definitions = [];
for (const [index, item] of manifest.entries()) {
  if (!/^[a-z0-9-]+$/.test(item.slug)) throw new Error("Invalid asset name");
  const original = path.join(originals, `${item.slug}.png`);
  await fs.copyFile(item.sourcePath, original);
  const metadata = await sharp(original).metadata();
  const widths = [480, 960, Math.min(1536, metadata.width)];
  for (const width of widths) {
    const name = `${item.slug}-${width}.webp`;
    await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality: 87 }).toFile(path.join(output, name));
    imports.push(`const image${index}w${width} = "/assets/catalog/${name}";`);
  }
  const width = widths.at(-1);
  const height = Math.round(metadata.height * width / metadata.width);
  definitions.push(`  "${item.slug}": { src: image${index}w${width}, srcSet: \`${widths.map(w => `\${image${index}w${w}} ${w}w`).join(", ")}\`, width: ${width}, height: ${height} },`);
}
await fs.writeFile(path.join(root, "src/assets/catalog-images.ts"), `${imports.join("\n")}\n\nexport const bundledCatalogImages: Record<string, {src: string; srcSet: string; width: number; height: number}> = {\n${definitions.join("\n")}\n};\n`);
console.log(`Prepared ${manifest.length} illustrations, ${manifest.length * 3} WebP files.`);
