import { notFound } from "next/navigation";
import CatalogPage from "../../../../catalog/CatalogPage";
import {
  findCatalogEntry,
  catalogHref,
  catalogIndex,
} from "../../../../shared/catalog-index";
import { whatsappLink } from "../../../../components/site/site-utils";
import { publicSnapshot } from "../../../site-snapshot";
import { pageMetadata, StructuredData, siteUrl } from "../../../metadata-utils";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return catalogIndex.map((entry) => ({ slug: entry.slug }));
}
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
  return (
    <>
      <CatalogPage
        entry={entry}
        whatsappHref={whatsappLink(content.contact.phone)}
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
              url: siteUrl(catalogHref(slug)),
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
                item: siteUrl(item.item),
              })),
            },
          ],
        }}
      />
    </>
  );
}
