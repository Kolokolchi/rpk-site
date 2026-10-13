import type { NextConfig } from "next";
const staticExport = process.env.RPK_STATIC_EXPORT === "true";
const basePath = staticExport
  ? process.env.NEXT_PUBLIC_BASE_PATH || "/rpk-site"
  : "";
if (basePath && !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(basePath))
  throw new Error(
    "NEXT_PUBLIC_BASE_PATH must be a clean absolute subpath without a trailing slash.",
  );
const config: NextConfig = {
  ...(staticExport ? { output: "export", trailingSlash: true } : {}),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  cacheComponents: false,
  skipTrailingSlashRedirect: true,
};
export default config;
