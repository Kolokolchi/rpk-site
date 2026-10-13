import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const workspace = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const staging = path.resolve(workspace, "artifacts/migration/pages-build");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/rpk-site";
const publicOrigin =
  process.env.PUBLIC_ORIGIN || "https://kolokolchi.github.io";
if (!/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(basePath))
  throw new Error("A clean NEXT_PUBLIC_BASE_PATH is required.");
const origin = new URL(publicOrigin);
if (
  origin.protocol !== "https:" ||
  origin.username ||
  origin.password ||
  origin.pathname !== "/" ||
  origin.search ||
  origin.hash
)
  throw new Error("PUBLIC_ORIGIN must be a clean HTTPS origin.");
if (
  path.relative(workspace, staging) !==
  path.join("artifacts", "migration", "pages-build")
)
  throw new Error("Unexpected staging path.");
await fs.rm(staging, { recursive: true, force: true });
await fs.mkdir(staging, { recursive: true });

// Work only in an isolated deployment copy; the ordinary server source remains intact.
for (const name of [
  "src",
  "public",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "next-env.d.ts",
]) {
  await fs.cp(path.join(workspace, name), path.join(staging, name), {
    recursive: true,
    filter(source) {
      const relative = path
        .relative(workspace, source)
        .replaceAll(path.sep, "/");
      return (
        relative !== "src/proxy.ts" &&
        relative !== "src/app/api" &&
        !relative.startsWith("src/app/api/")
      );
    },
  });
}
await fs.symlink(
  path.join(workspace, "node_modules"),
  path.join(staging, "node_modules"),
  process.platform === "win32" ? "junction" : "dir",
);
const tsconfigPath = path.join(staging, "tsconfig.json");
const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, "utf8"));
tsconfig.include = [
  "next-env.d.ts",
  "src/**/*.ts",
  "src/**/*.tsx",
  ".next/types/**/*.ts",
];
await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");

console.log(`Building isolated Pages export for ${origin.origin}${basePath}/`);
const exitCode = await new Promise((resolve, reject) => {
  const child = spawn(
    process.execPath,
    [
      path.join(workspace, "node_modules/next/dist/bin/next"),
      "build",
      "--webpack",
    ],
    {
      cwd: staging,
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "production",
        RPK_STATIC_EXPORT: "true",
        NEXT_PUBLIC_BASE_PATH: basePath,
        PUBLIC_ORIGIN: origin.origin,
        VERCEL: "",
        RPK_LOCAL_PREVIEW: "false",
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  );
  child.once("error", reject);
  child.once("exit", (code) => resolve(code ?? 1));
});
if (exitCode !== 0)
  throw new Error(`Static build failed with exit code ${exitCode}.`);

const output = path.join(staging, "out");
async function filesBelow(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...(await filesBelow(target)));
    else if (entry.isFile()) results.push(target);
  }
  return results;
}
const files = await filesBelow(output);
const hash = (text) =>
  `'sha256-${crypto.createHash("sha256").update(text).digest("base64")}'`;
let pages = 0;
for (const file of files) {
  if (file.endsWith(".css")) {
    const css = await fs.readFile(file, "utf8");
    await fs.writeFile(
      file,
      css.replace(/url\((["']?)\/assets\//g, `url($1${basePath}/assets/`),
    );
  } else if (file.endsWith(".html")) {
    let html = await fs.readFile(file, "utf8");
    const scriptHashes = new Set();
    const styleHashes = new Set();
    for (const match of html.matchAll(
      /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    ))
      if (!/\bsrc\s*=/.test(match[1])) scriptHashes.add(hash(match[2]));
    for (const match of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))
      styleHashes.add(hash(match[1]));
    const policy = [
      "default-src 'self'",
      `script-src 'self' ${[...scriptHashes].join(" ")}`.trim(),
      "script-src-attr 'none'",
      `style-src 'self' ${[...styleHashes].join(" ")}`.trim(),
      "style-src-attr 'none'",
      "img-src 'self' blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-src 'self'",
    ].join("; ");
    const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}"/>`;
    const charset = html.match(/<meta\b[^>]*charset[^>]*>/i)?.[0];
    html = charset
      ? html.replace(charset, charset + meta)
      : html.replace(
          /<head\b[^>]*>/i,
          (opening) => opening + '<meta charset="utf-8"/>' + meta,
        );
    await fs.writeFile(file, html);
    pages += 1;
  }
}
await fs.writeFile(path.join(output, ".nojekyll"), "");
const report = {
  siteUrl: `${origin.origin}${basePath}/`,
  output: path.relative(workspace, output).replaceAll(path.sep, "/"),
  htmlFiles: pages,
  generatedAt: new Date().toISOString(),
  security:
    "Hash-based HTML meta CSP, without unsafe-inline or unsafe-eval. GitHub Pages cannot set frame-ancestors or X-Frame-Options response headers; default SSR protections remain unchanged.",
};
await fs.writeFile(
  path.join(staging, "export-report.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
