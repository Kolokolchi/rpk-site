"use client";

import { usePathname } from "next/navigation";
import { findCatalogEntry } from "../../shared/catalog-index";
import { findSolutionEntry } from "../../shared/solution-index";
import { withoutBasePath } from "../../shared/public-path";
import { whatsappLink } from "./site-utils";
import SiteHeader from "./SiteHeader";
import FloatingContact from "./FloatingContact";

export function RouteHeader({ phone }: { phone: string }) {
  const pathname = withoutBasePath(usePathname() || "/");
  return (
    <SiteHeader
      whatsappHref={whatsappLink(
        phone,
        findCatalogEntry(pathname)?.title ?? findSolutionEntry(pathname)?.title,
      )}
      homePrefix={pathname === "/" ? "" : "/"}
    />
  );
}

export function RouteFloatingContact({ phone }: { phone: string }) {
  const pathname = withoutBasePath(usePathname() || "/");
  return (
    <FloatingContact
      whatsappHref={whatsappLink(
        phone,
        findCatalogEntry(pathname)?.title ?? findSolutionEntry(pathname)?.title,
      )}
    />
  );
}
