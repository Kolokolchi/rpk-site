import { NextResponse, type NextRequest } from "next/server";
import { readRequestSecurityConfig } from "./server/config";

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const development = process.env.NODE_ENV !== "production";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${development ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'none'",
    "img-src 'self' blob:",
    "font-src 'self'",
    `connect-src 'self'${development ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'self'",
    "report-uri /api/security/csp-report",
    "report-to csp-endpoint",
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("x-rpk-path", request.nextUrl.pathname);
  requestHeaders.set("Content-Security-Policy", csp);
  let response: NextResponse;
  try {
    const config = readRequestSecurityConfig();
    const host = (request.headers.get("host") || "").toLowerCase();
    if (!config.allowedHosts.has(host))
      response = new NextResponse("Misdirected request", { status: 421 });
    else if (request.url.length > 4096)
      response = new NextResponse("URI too long", { status: 414 });
    else if (
      config.vercel &&
      request.headers.get("x-forwarded-proto") !== "https"
    ) {
      response = ["GET", "HEAD"].includes(request.method)
        ? NextResponse.redirect(
            new URL(
              request.nextUrl.pathname + request.nextUrl.search,
              config.publicOrigin,
            ),
            308,
          )
        : new NextResponse("HTTPS required", { status: 400 });
    } else
      response = NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    response = new NextResponse("Service configuration unavailable", {
      status: 503,
    });
  }
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set(
    "Reporting-Endpoints",
    'csp-endpoint="/api/security/csp-report"',
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("X-Request-ID", crypto.randomUUID());
  if (process.env.VERCEL === "1")
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  if (
    !request.nextUrl.pathname.startsWith("/_next/static/") &&
    !request.nextUrl.pathname.startsWith("/assets/") &&
    !request.nextUrl.pathname.startsWith("/api/media/")
  )
    response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
