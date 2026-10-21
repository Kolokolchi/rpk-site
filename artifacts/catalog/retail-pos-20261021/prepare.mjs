import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import sharp from "sharp";

const directory = fileURLToPath(new URL(".", import.meta.url));
const root = fileURLToPath(new URL("../../../", import.meta.url));
const input = await fs.readFile(path.join(directory, "original.png"));
const sha256 = (bytes) =>
  crypto.createHash("sha256").update(bytes).digest("hex");
const sourceSha256 = sha256(input);
const outputs = [];
for (const width of [480, 960, 1536]) {
  const filename = `retail-island-${width}.webp`;
  const bytes = await sharp(input)
    .resize({ width })
    .webp({ quality: 85, effort: 6 })
    .toBuffer();
  const output = path.join(root, "public/assets/catalog", filename);
  await fs.writeFile(output, bytes);
  const metadata = {
    source: "artifacts/catalog/retail-pos-20261021/original.png",
    sourceSha256,
    generatedOn: "2026-10-21",
    kind: "illustration",
    generator: "built-in image_gen",
    promptManifest: "artifacts/catalog/retail-pos-20261021/generation.json",
    width,
    height: Math.round((width * 2) / 3),
    sha256: sha256(bytes),
  };
  await fs.writeFile(
    `${output}.json`,
    JSON.stringify(metadata, null, 2) + "\n",
  );
  outputs.push({
    path: `/assets/catalog/${filename}`,
    bytes: bytes.length,
    ...metadata,
  });
}
const manifestPath = path.join(directory, "generation.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
await fs.writeFile(
  manifestPath,
  JSON.stringify({ ...manifest, sourceSha256, outputs }, null, 2) + "\n",
);
