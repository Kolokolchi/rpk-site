/** Prefix site-local URLs for a build hosted below a domain root. */
export function publicPath(value: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!basePath || !value.startsWith("/") || value.startsWith("//"))
    return value;
  if (
    value === basePath ||
    ["/", "?", "#"].some((separator) => value.startsWith(basePath + separator))
  )
    return value;
  return `${basePath}${value}`;
}

export function withoutBasePath(value: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!basePath) return value;
  if (value === basePath) return "/";
  return value.startsWith(`${basePath}/`)
    ? value.slice(basePath.length)
    : value;
}
