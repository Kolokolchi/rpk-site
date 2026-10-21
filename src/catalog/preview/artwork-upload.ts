export type ArtworkMeta = {
  name: string;
  format: "PNG" | "JPG" | "WebP" | "SVG";
  width: number;
  height: number;
  bytes: number;
};

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_SIDE = 12000;
const MAX_PIXELS = 40_000_000;
const SVG_NS = "http://www.w3.org/2000/svg";
const tags = new Set(
  "svg g defs style path rect circle ellipse line polyline polygon text tspan textpath use symbol clippath mask lineargradient radialgradient stop pattern title desc image filter fegaussianblur feoffset fecolormatrix feblend fecomposite feflood femerge femergenode fecomponenttransfer fefunca fefuncb fefuncg fefuncr".split(
    " ",
  ),
);
const cssProperties = new Set(
  "fill fill-opacity fill-rule clip-rule stroke stroke-width stroke-opacity stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset opacity color stop-color stop-opacity font-family font-size font-weight font-style letter-spacing text-anchor dominant-baseline visibility display paint-order transform transform-origin filter clip-path mask".split(
    " ",
  ),
);

function safePaint(value: string) {
  return (
    !/expression\s*\(|javascript:|@import|@font-face/i.test(value) &&
    Array.from(value.matchAll(/url\s*\(([^)]*)\)/gi)).every((match) =>
      /^\s*['"]?#[a-zA-Z_][\w:.-]*['"]?\s*$/.test(match[1]),
    )
  );
}

function cleanStyle(style: CSSStyleDeclaration) {
  for (const property of Array.from(style)) {
    if (
      !cssProperties.has(property) ||
      !safePaint(style.getPropertyValue(property))
    )
      style.removeProperty(property);
  }
}

function sanitizeSvg(source: string): {
  content: string;
  width: number;
  height: number;
} {
  if (/<!DOCTYPE|<!ENTITY/i.test(source))
    throw new Error(
      "SVG содержит неподдерживаемое описание документа. Экспортируйте обычный SVG или PNG.",
    );
  const doc = new DOMParser().parseFromString(source, "image/svg+xml");
  const root = doc.documentElement;
  if (doc.querySelector("parsererror") || root.localName !== "svg")
    throw new Error(
      "Не удалось прочитать SVG. Экспортируйте макет заново или загрузите PNG.",
    );
  // Keep the native CSS cascade inside the isolated SVG image, with safe declarations only.
  for (const style of Array.from(root.querySelectorAll("style"))) {
    const sheet = new CSSStyleSheet();
    const rules: string[] = [];
    try {
      sheet.replaceSync(style.textContent ?? "");
      for (const rule of Array.from(sheet.cssRules)) {
        if (!(rule instanceof CSSStyleRule)) continue;
        cleanStyle(rule.style);
        if (rule.style.length) rules.push(rule.cssText);
      }
    } catch {
      /* Presentation attributes remain available when a stylesheet cannot be parsed. */
    }
    if (rules.length) style.textContent = rules.join("\n");
    else style.remove();
  }
  for (const node of [root, ...Array.from(root.querySelectorAll("*"))]) {
    if (!tags.has(node.localName.toLowerCase())) {
      node.remove();
      continue;
    }
    for (const attribute of Array.from(node.attributes)) {
      const name = attribute.localName.toLowerCase();
      if (
        name.startsWith("on") ||
        name === "src" ||
        !safePaint(attribute.value)
      )
        node.removeAttributeNode(attribute);
      else if (
        name === "href" &&
        !/^#[\w:.-]+$/.test(attribute.value) &&
        !(
          node.localName === "image" &&
          /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=\s]+$/i.test(
            attribute.value,
          )
        )
      )
        node.removeAttributeNode(attribute);
    }
    if ("style" in node) cleanStyle((node as SVGElement).style);
  }
  const box = root
    .getAttribute("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  const validBox =
    box?.length === 4 && box.every(Number.isFinite) && box[2] > 0 && box[3] > 0;
  const numericLength = (attribute: string) => {
    const value = root.getAttribute(attribute) ?? "";
    return /^\d+(?:\.\d+)?(?:px)?$/.test(value) ? parseFloat(value) : NaN;
  };
  const width = numericLength("width") || (validBox ? box![2] : 512);
  const height = numericLength("height") || (validBox ? box![3] : 512);
  checkDimensions(width, height);
  if (!validBox) root.setAttribute("viewBox", `0 0 ${width} ${height}`);
  root.setAttribute("xmlns", SVG_NS);
  root.setAttribute("width", String(width));
  root.setAttribute("height", String(height));
  return {
    content: new XMLSerializer().serializeToString(root),
    width,
    height,
  };
}

function checkDimensions(width: number, height: number) {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0 ||
    width > MAX_SIDE ||
    height > MAX_SIDE ||
    width * height > MAX_PIXELS
  ) {
    throw new Error(
      "Слишком большое изображение. Экспортируйте до 12 000 px по стороне и до 40 Мп.",
    );
  }
}

export async function readArtwork(
  file: File,
): Promise<{ url: string; meta: ArtworkMeta }> {
  if (file.size > MAX_BYTES)
    throw new Error(
      "Файл больше 8 МБ. Уменьшите изображение и попробуйте снова.",
    );
  if (!file.size) throw new Error("Файл пустой. Выберите другой макет.");
  const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  let format: ArtworkMeta["format"] | null = null;
  let mime = "";
  if (
    bytes[0] === 137 &&
    bytes[1] === 80 &&
    bytes[2] === 78 &&
    bytes[3] === 71
  ) {
    format = "PNG";
    mime = "image/png";
  } else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    format = "JPG";
    mime = "image/jpeg";
  } else if (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    format = "WebP";
    mime = "image/webp";
  } else if (
    /\.svg$/i.test(file.name) ||
    file.type === "image/svg+xml" ||
    new TextDecoder().decode(bytes).trimStart().startsWith("<svg")
  ) {
    format = "SVG";
    mime = "image/svg+xml";
  }
  if (!format) {
    if (/\.(?:pdf|ai|cdr|eps)$/i.test(file.name))
      throw new Error(
        "Для онлайн-примерки экспортируйте PDF, AI, CDR или EPS в SVG либо PNG. Исходный файл можно передать менеджеру при заказе.",
      );
    if (["image/png", "image/jpeg", "image/webp"].includes(file.type))
      throw new Error(
        "Не удалось прочитать изображение. Файл повреждён или его содержимое не соответствует формату.",
      );
    throw new Error("Выберите изображение PNG, JPG, WebP или SVG.");
  }
  const blob =
    format === "SVG"
      ? new Blob([sanitizeSvg(await file.text()).content], { type: mime })
      : file.slice(0, file.size, mime);
  const url = URL.createObjectURL(blob);
  try {
    const picture = new Image();
    picture.src = url;
    await picture.decode();
    checkDimensions(picture.naturalWidth, picture.naturalHeight);
    return {
      url,
      meta: {
        name: file.name,
        format,
        width: picture.naturalWidth,
        height: picture.naturalHeight,
        bytes: file.size,
      },
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    if (error instanceof Error && error.message.includes("Слишком большое"))
      throw error;
    throw new Error(
      "Не удалось прочитать изображение. Попробуйте другой PNG, JPG, WebP или SVG.",
      { cause: error },
    );
  }
}
