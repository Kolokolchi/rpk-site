import { HttpError } from "./errors";

export async function readBoundedBody(
  request: Request,
  maximumBytes: number,
): Promise<Buffer> {
  const encoding = request.headers.get("content-encoding");
  if (encoding && encoding.toLowerCase() !== "identity")
    throw new HttpError(415, "unsupported_content_encoding");
  const length = request.headers.get("content-length");
  if (length !== null) {
    const size = Number(length);
    if (!/^\d+$/.test(length) || !Number.isSafeInteger(size))
      throw new HttpError(400, "invalid_content_length");
    if (size > maximumBytes) throw new HttpError(413, "request_too_large");
  }
  if (!request.body) return Buffer.alloc(0);
  const reader = request.body.getReader();
  const chunks: Buffer[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maximumBytes) {
        await reader.cancel().catch(() => {});
        throw new HttpError(413, "request_too_large");
      }
      chunks.push(Buffer.from(chunk.value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, size);
}

export async function readJsonBody(
  request: Request,
  maximumBytes: number,
  strict = true,
): Promise<unknown> {
  const type = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    ?.trim()
    .toLowerCase();
  if (
    type !== "application/json" &&
    !(
      strict === false &&
      ["application/csp-report", "application/reports+json"].includes(
        type || "",
      )
    )
  )
    throw new HttpError(415, "unsupported_content_type");
  const raw = await readBoundedBody(request, maximumBytes);
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(raw);
    const value: unknown = JSON.parse(text);
    if (strict && (value === null || typeof value !== "object"))
      throw new Error("Invalid object.");
    return value;
  } catch {
    throw new HttpError(400, "invalid_json");
  }
}
