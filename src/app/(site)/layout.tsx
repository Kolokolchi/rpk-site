import type { ReactNode } from "react";
import { headers } from "next/headers";
import SiteHeader from "../../components/site/SiteHeader";
import {
  RouteHeader,
  RouteFloatingContact,
} from "../../components/site/RouteContacts";
import SiteFooter from "../../components/site/SiteFooter";
import FloatingContact from "../../components/site/FloatingContact";
import ScrollReveal from "../../components/site/ScrollReveal";
import { whatsappLink } from "../../components/site/site-utils";
import { findCatalogEntry } from "../../shared/catalog-index";
import { findSolutionEntry } from "../../shared/solution-index";
import { publicSnapshot } from "../site-snapshot";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { content } = await publicSnapshot();
  const staticExport = process.env.RPK_STATIC_EXPORT === "true";
  const pathname = staticExport
    ? "/"
    : (await headers()).get("x-rpk-path") || "/";
  const whatsappHref = whatsappLink(
    content.contact.phone,
    findCatalogEntry(pathname)?.title ?? findSolutionEntry(pathname)?.title,
  );
  return (
    <div className="site-shell rpk-editorial rpk-branded">
      <a className="skip-link" href="#top">
        Перейти к содержимому
      </a>
      {staticExport ? (
        <RouteHeader phone={content.contact.phone} />
      ) : (
        <SiteHeader
          whatsappHref={whatsappHref}
          homePrefix={pathname === "/" ? "" : "/"}
        />
      )}
      <main id="top" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter footer={content.footer} />
      {staticExport ? (
        <RouteFloatingContact phone={content.contact.phone} />
      ) : (
        <FloatingContact whatsappHref={whatsappHref} />
      )}
      <ScrollReveal />
    </div>
  );
}
