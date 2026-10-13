import "server-only";
import { cache } from "react";
import { getPublicSnapshot } from "../server/content-service";
export const publicSnapshot = cache(getPublicSnapshot);
