import HomePage from "../../components/site/HomePage";
import { publicSnapshot } from "../site-snapshot";
import { pageMetadata, StructuredData } from "../metadata-utils";
import { readRequestSecurityConfig } from "../../server/config";
export async function generateMetadata() {
  return pageMetadata(
    "Наружная реклама в Алматы | RPK — Больше чем реклама",
    "Проектируем, производим и монтируем световые вывески, входные группы и навигацию в Алматы. Собственное производство. Получите предварительный расчёт в WhatsApp.",
    "/",
  );
}
export default async function Home() {
  const { content } = await publicSnapshot();
  return (
    <>
      <HomePage content={content} />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "RPK.KZ",
          url: readRequestSecurityConfig().publicOrigin,
          telephone: content.contact.phone,
          email: content.contact.email,
          areaServed: { "@type": "City", name: "Алматы" },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Алматы",
            addressCountry: "KZ",
          },
        }}
      />
    </>
  );
}
