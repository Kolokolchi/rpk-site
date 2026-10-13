import NotFoundPage from "../components/site/NotFoundPage";
import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import { getPublishedContent } from "../shared/content-model";
import { whatsappLink } from "../components/site/site-utils";
export default function NotFound() {
  const content = getPublishedContent();
  return (
    <div className="site-shell rpk-editorial rpk-branded">
      <SiteHeader
        whatsappHref={whatsappLink(content.contact.phone)}
        homePrefix="/"
      />
      <main id="top">
        <NotFoundPage />
      </main>
      <SiteFooter footer={content.footer} />
    </div>
  );
}
