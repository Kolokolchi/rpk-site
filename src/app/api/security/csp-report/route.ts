import { apiHandler } from "@/server/api";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const POST = (request: Request) => apiHandler("cspReport", request);
