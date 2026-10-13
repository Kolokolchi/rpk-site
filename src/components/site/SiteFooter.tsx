import type { SiteContent } from "../../shared/content-schema";
import { logoMark, safeExternalUrl } from "./site-utils";

export default function SiteFooter({
  footer,
}: {
  footer: SiteContent["footer"];
}) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src={logoMark} alt="" width="212" height="81" />
        <span>Больше чем реклама</span>
      </div>
      <p>{footer.text}</p>
      <a
        href={safeExternalUrl(footer.url)}
        rel="noopener noreferrer"
        referrerPolicy="no-referrer"
      >
        <span>{footer.url.replace("https://", "")}</span>
      </a>
    </footer>
  );
}
