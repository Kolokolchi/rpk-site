import { notFound } from "next/navigation";
import {
  findSolutionEntry,
  solutionHref,
  solutionIndex,
} from "../../../../shared/solution-index";
import { getBusinessSolution } from "../../../../solutions/solution-content";
import SolutionPage from "../../../../solutions/SolutionPage";
import { publicSnapshot } from "../../../site-snapshot";
import { pageMetadata, siteUrl, StructuredData } from "../../../metadata-utils";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return solutionIndex.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = findSolutionEntry(`/solutions/${slug}`);
  if (!entry) notFound();
  return pageMetadata(
    `${entry.title}: оформление, проблемы и решения | RPK.KZ`,
    entry.summary,
    solutionHref(slug),
  );
}
export default async function BusinessSolutionPage({ params }: Props) {
  const { slug } = await params;
  const solution = getBusinessSolution(slug);
  if (!solution) notFound();
  const { content } = await publicSnapshot();
  return (
    <>
      <SolutionPage
        solution={solution}
        contact={content.contact}
        portfolio={content.portfolio}
      />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              name: solution.title,
              description: solution.summary,
              url: siteUrl(solutionHref(slug)),
              inLanguage: "ru",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { name: "Главная", item: "/" },
                { name: "Для вашего объекта", item: "/solutions" },
                { name: solution.title, item: solutionHref(slug) },
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
