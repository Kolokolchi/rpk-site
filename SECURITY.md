# Security model

RPK.KZ is a public, read-only Next.js application. There is no administrator interface, account/session codec, login, CSRF token, browser draft, content write endpoint or image upload endpoint. Administrative routes return 404. The authoritative content is versioned JSON/TypeScript and changes only with a deployment.

## Application controls

- Shared strict Zod validation bounds published content, rejects unsafe Unicode and limits media references to allow-listed logical site assets. Contact and footer destinations remain constrained.
- Request-specific CSP nonces allow Next.js hydration without blanket unsafe-inline/unsafe-eval in production. Inline script/style attributes are denied. JSON-LD is safely serialized and carries the nonce.
- Host allow-list, canonical HTTPS enforcement in Vercel, nosniff, frame denial, permissions restrictions, same-origin isolation and referrer policy apply through the request proxy.
- `/api/content` is GET/HEAD only, sends an ETag and no-store; mutation methods return 405. Unknown APIs and private source/configuration paths return 404.
- CSP reports have bounded request bodies and process-local limits. Logs contain sanitized report summaries, without submitted source text, credentials or uploaded bytes.
- Runtime content services perform no storage writes, credential exchanges or cloud requests. The build requires no cloud/admin secrets.

## Platform responsibilities

Vercel manages TLS, HTTP parsing, connection timeouts and its function/edge limits. Configure platform WAF/rate limits if needed; process-local CSP-report limiting is not a distributed protection guarantee. Keep production and Preview host configuration separate.

Do not publish `.env.local`, source maps, logs, tests or development archives. No private credentials are necessary for this version of the application. Old local environment files are left untouched and must not be copied into deployment artifacts.

## Release checks

Run `npm run security:check`: strict types, ESLint, Vitest, Next build, Playwright, production dependency audit and registry signatures. On the hosted deployment verify CSP hydration, HTTPS, Host rejection, 404 for `/admin` and private files, and 405 for content mutations.

For rollback, restore a known Git revision/deployment. The original application/content/media also exist in the verified pre-migration backup. No hosting accounts or working domains were changed by the migration.
