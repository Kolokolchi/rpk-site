import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  cacheComponents: false,
  skipTrailingSlashRedirect: true,
};
export default config;
