import "server-only";
import { isLoopbackHostname, type RequestSecurityConfig } from "./config";
import { HttpError } from "./errors";

export function safeLogValue(value: unknown, maximum = 200): string {
  return (
    String(value || "")
      // eslint-disable-next-line no-control-regex -- Strip control characters from untrusted structured log fields.
      .replace(/[\u0000-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/gu, "")
      .slice(0, maximum)
  );
}
export function checkRequestSecurity(
  request: Request,
  config: RequestSecurityConfig,
): Response | null {
  const url = new URL(request.url);
  if (url.pathname.length + url.search.length > 4096)
    throw new HttpError(414, "uri_too_long");
  const host = (request.headers.get("host") || url.host).toLowerCase();
  if (!config.allowedHosts.has(host))
    throw new HttpError(421, "misdirected_request");
  if (config.local && !isLoopbackHostname(url.hostname))
    throw new HttpError(421, "misdirected_request");
  const insecure =
    config.production &&
    !config.local &&
    (url.protocol !== "https:" ||
      (config.vercel && request.headers.get("x-forwarded-proto") !== "https"));
  if (insecure) {
    if (["GET", "HEAD"].includes(request.method))
      return new Response(null, {
        status: 308,
        headers: {
          Location: `${config.publicOrigin}${url.pathname}${url.search}`,
          "Cache-Control": "no-store",
        },
      });
    throw new HttpError(400, "https_required");
  }
  return null;
}
export function apiSecurityHeaders(requestId: string): Headers {
  return new Headers({
    "Cache-Control": "no-store",
    "X-Request-ID": requestId,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "X-Frame-Options": "DENY",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Content-Security-Policy":
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; sandbox",
  });
}
