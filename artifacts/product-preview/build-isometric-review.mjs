import sharp from "sharp";
import { join } from "node:path";

const root = "artifacts/product-preview/isometric-and-artwork";
const groups = {
  facades: [
    "channel-letters",
    "lightboxes",
    "projecting-signs",
    "neon-signs",
    "non-illuminated-signs",
    "roof-signs",
    "facades-and-entrances",
    "installation-and-service",
  ],
  objects: [
    "pylons",
    "billboards",
    "city-formats",
    "pavement-signs",
    "wayfinding",
    "interior-branding",
    "window-graphics",
    "vehicle-branding",
    "retail-and-pos",
    "exhibition-stands",
    "brand-zones",
    "information-boards",
  ],
  production: [
    "banner-printing",
    "uv-printing",
    "vinyl-graphics",
    "cnc-and-laser",
    "metal-fabrication",
    "design-and-engineering",
    "stencils-and-marking",
  ],
};
for (const [family, slugs] of Object.entries(groups)) {
  const cols = family === "production" ? 3 : 4;
  const width = 440;
  const height = 318;
  const layers = [];
  for (let i = 0; i < slugs.length; i++) {
    const cell = await sharp(join(root, `context-${slugs[i]}.png`))
      .resize(width, 286, { fit: "contain", background: "#111416" })
      .png()
      .toBuffer();
    const left = (i % cols) * width;
    const top = Math.floor(i / cols) * height;
    layers.push({ input: cell, left, top });
    const label = Buffer.from(
      `<svg width="${width}" height="32"><text x="16" y="23" fill="#d5dcdd" font-family="sans-serif" font-size="15">${slugs[i]}</text></svg>`,
    );
    layers.push({ input: label, left, top: top + 286 });
  }
  await sharp({
    create: {
      width: cols * width,
      height: Math.ceil(slugs.length / cols) * height,
      channels: 3,
      background: "#111416",
    },
  })
    .composite(layers)
    .png()
    .toFile(join(root, `${family}-isometric.png`));
}
