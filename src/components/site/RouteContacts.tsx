"use client";

import { usePathname } from "next/navigation";
import { withoutBasePath } from "../../shared/public-path";
import { whatsappLink } from "./site-utils";
import SiteHeader from "./SiteHeader";
import FloatingContact from "./FloatingContact";

export function RouteHeader({ phone }: { phone: string }) {
  const pathname = withoutBasePath(usePathname() || "/");
  return (
    <SiteHeader
      whatsappHref={whatsappLink(phone)}
      homePrefix={pathname === "/" ? "" : "/"}
    />
  );
}

export function RouteFloatingContact({ phone }: { phone: string }) {
  return <FloatingContact whatsappHref={whatsappLink(phone)} />;
}
