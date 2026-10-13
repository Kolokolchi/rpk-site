import "server-only";
import { RuntimeConfigurationError } from "./errors";

export type Environment = Record<string, string | undefined>;
export interface RequestSecurityConfig {
  production: boolean;
  vercel: boolean;
  local: boolean;
  localPreview: boolean;
  publicOrigin: string;
  allowedHosts: ReadonlySet<string>;
}
export function isLoopbackHostname(hostname: string): boolean {
  return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(
    hostname.toLowerCase(),
  );
}
export function readRequestSecurityConfig(
  environment: Environment = process.env,
): RequestSecurityConfig {
  const production = environment.NODE_ENV === "production";
  const vercel = environment.VERCEL === "1";
  if (
    environment.RPK_LOCAL_PREVIEW &&
    !["true", "false"].includes(environment.RPK_LOCAL_PREVIEW)
  )
    throw new RuntimeConfigurationError(
      "RPK_LOCAL_PREVIEW must be true or false.",
    );
  const preview = environment.RPK_LOCAL_PREVIEW === "true";
  let origin: URL;
  try {
    origin = new URL(
      environment.PUBLIC_ORIGIN ||
        (production ? "https://www.rpk.kz" : "http://localhost:3000"),
    );
  } catch {
    throw new RuntimeConfigurationError(
      "PUBLIC_ORIGIN must be a valid origin.",
    );
  }
  if (
    !["http:", "https:"].includes(origin.protocol) ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  )
    throw new RuntimeConfigurationError(
      "PUBLIC_ORIGIN must be a clean HTTP(S) origin.",
    );
  const loopback = isLoopbackHostname(origin.hostname);
  const local = !vercel && loopback && (!production || preview);
  if (preview && (vercel || !local))
    throw new RuntimeConfigurationError(
      "Local preview requires a loopback origin and no Vercel.",
    );
  if (
    production &&
    !local &&
    (!vercel || origin.protocol !== "https:" || loopback)
  )
    throw new RuntimeConfigurationError(
      "Production requires Vercel and a canonical HTTPS origin.",
    );
  if (!production && !local && !vercel)
    throw new RuntimeConfigurationError(
      "Development must use a loopback origin.",
    );
  const hosts = [origin.host, ...(environment.ALLOWED_HOSTS || "").split(",")];
  if (["rpk.kz", "www.rpk.kz"].includes(origin.hostname))
    hosts.push("rpk.kz", "www.rpk.kz");
  if (vercel && environment.VERCEL_URL) hosts.push(environment.VERCEL_URL);
  if (local) {
    const suffix = origin.port ? `:${origin.port}` : "";
    hosts.push(`localhost${suffix}`, `127.0.0.1${suffix}`, `[::1]${suffix}`);
  }
  const allowedHosts = new Set<string>();
  for (const raw of hosts) {
    const host = raw.trim().toLowerCase();
    if (!host) continue;
    let parsed: URL;
    try {
      parsed = new URL(`https://${host}`);
    } catch {
      throw new RuntimeConfigurationError(
        "ALLOWED_HOSTS must contain exact host names.",
      );
    }
    if (
      host.includes("*") ||
      parsed.host !== host ||
      parsed.username ||
      parsed.password ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash
    )
      throw new RuntimeConfigurationError(
        "ALLOWED_HOSTS must contain exact host names.",
      );
    allowedHosts.add(host);
  }
  return {
    production,
    vercel,
    local,
    localPreview: production && local,
    publicOrigin: origin.origin,
    allowedHosts,
  };
}
