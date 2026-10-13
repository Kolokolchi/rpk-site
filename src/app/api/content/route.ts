import { apiHandler } from "@/server/api";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const GET = (request: Request) => apiHandler("contentGet", request);
export const HEAD = GET;
export const POST = (request: Request) => apiHandler("contentPost", request);
