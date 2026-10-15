import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = path.join(
  root,
  "artifacts/solutions/generated-images.json",
);
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const originals = path.join(root, "artifacts/solutions/originals");
const output = path.join(root, "public/assets/solutions");
await fs.mkdir(originals, { recursive: true });
await fs.mkdir(output, { recursive: true });
const definitions = [];
const previews = [];
for (let index = 0; index < manifest.length; index++) {
  const item = manifest[index];
  if (!/^[a-z0-9-]+$/.test(item.slug))
    throw new Error("Invalid illustration slug");
  const original = path.join(originals, `${item.slug}.png`);
  try {
    await fs.access(original);
  } catch {
    await fs.copyFile(item.sourcePath, original);
  }
  const input = await fs.readFile(original);
  const metadata = await sharp(input).metadata();
  const widths = [480, 960, Math.min(1536, metadata.width)];
  item.workspaceOriginal = `artifacts/solutions/originals/${item.slug}.png`;
  item.outputs = widths.map(
    (width) => `/assets/solutions/${item.slug}-${width}.webp`,
  );
  const sourceHash = crypto.createHash("sha256").update(input).digest("hex");
  for (const width of widths) {
    const file = `${item.slug}-${width}.webp`;
    const bytes = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toBuffer();
    await fs.writeFile(path.join(output, file), bytes);
    await fs.writeFile(
      path.join(output, `${file}.json`),
      JSON.stringify(
        {
          source: `artifacts/solutions/originals/${item.slug}.png`,
          sourceSha256: sourceHash,
          generatedOn: item.generatedOn,
          kind: "illustration",
          generator: item.mode,
          promptManifest: "artifacts/solutions/generated-images.json",
          width,
          height: Math.round((metadata.height * width) / metadata.width),
          sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
        },
        null,
        2,
      ) + "\n",
    );
  }
  const width = widths.at(-1),
    height = Math.round((metadata.height * width) / metadata.width);
  definitions.push(
    `  ${JSON.stringify(item.slug)}: { src: publicPath("/assets/solutions/${item.slug}-${width}.webp"), srcSet: [${widths.map((size) => `publicPath("/assets/solutions/${item.slug}-${size}.webp") + " ${size}w"`).join(", ")}].join(", "), width: ${width}, height: ${height} },`,
  );
  const preview = await sharp(input)
    .resize({ width: 300, height: 200, fit: "cover" })
    .png()
    .toBuffer();
  const left = (index % 4) * 300,
    top = Math.floor(index / 4) * 230;
  previews.push({ input: preview, left, top });
  previews.push({
    input: Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="30"><rect width="300" height="30" fill="#141414"/><text x="10" y="20" font-family="Arial" font-size="13" fill="#fff">${item.slug}</text></svg>`,
    ),
    left,
    top: top + 200,
  });
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
await fs.writeFile(
  path.join(root, "src/assets/expansion-images.ts"),
  `import { publicPath } from "../shared/public-path";\n\nexport const bundledExpansionImages: Record<string, { src: string; srcSet: string; width: number; height: number }> = {\n${definitions.join("\n")}\n};\n`,
);
await sharp({
  create: {
    width: 1200,
    height: Math.ceil(manifest.length / 4) * 230,
    channels: 4,
    background: "#080808",
  },
})
  .composite(previews)
  .png()
  .toFile(path.join(root, "artifacts/solutions/illustrations-preview.png"));
console.log(
  `Prepared ${manifest.length} unique illustrations and ${manifest.length * 3} responsive WebP files.`,
);
