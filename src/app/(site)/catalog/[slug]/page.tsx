import { notFound } from "next/navigation";
import CatalogPage from "../../../../catalog/CatalogPage";
import {
  findCatalogEntry,
  catalogHref,
} from "../../../../shared/catalog-index";
import { whatsappLink } from "../../../../components/site/site-utils";
import { publicSnapshot } from "../../../site-snapshot";
import { pageMetadata, StructuredData } from "../../../metadata-utils";
import { readRequestSecurityConfig } from "../../../../server/config";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = findCatalogEntry(`/catalog/${slug}`);
  if (!entry) notFound();
  return pageMetadata(
    `${entry.title} в Алматы — технология и применение | RPK.KZ`,
    entry.summary,
    catalogHref(slug),
  );
}
export default async function Technology({ params }: Props) {
  const { slug } = await params;
  const entry = findCatalogEntry(`/catalog/${slug}`);
  if (!entry) notFound();
  const { content } = await publicSnapshot();
  const origin = readRequestSecurityConfig().publicOrigin;
  return (
    <>
      <CatalogPage
        entry={entry}
        whatsappHref={whatsappLink(content.contact.phone, entry.title)}
        contact={content.contact}
      />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              name: entry.title,
              description: entry.summary,
              url: new URL(catalogHref(slug), origin).href,
              inLanguage: "ru",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { name: "Главная", item: "/" },
                { name: "Каталог", item: "/catalog" },
                { name: entry.title, item: catalogHref(slug) },
              ].map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: new URL(item.item, origin).href,
              })),
            },
          ],
        }}
      />
    </>
  );
}
