import type { SiteContent } from "../../shared/content-schema";
import { PublicText, SectionAtmosphere } from "./primitives";
import { introLetterBlueprint } from "./site-utils";

export default function IntroSection({ content }: { content: SiteContent }) {
  return (
    <section
      className="intro-band section-transition reveal-on-scroll"
      aria-labelledby="intro-title"
    >
      <SectionAtmosphere theme="blueprint" />
      <div className="intro-aside">
        <img
          className="intro-blueprint"
          src={introLetterBlueprint}
          width="430"
          height="300"
          loading="lazy"
          decoding="async"
          alt="Разобранная аксонометрия объемной буквы А"
        />
      </div>
      <div className="intro-copy">
        <PublicText as="h2" id="intro-title" value={content.intro.title} />
        <PublicText
          as="p"
          className="section-context"
          value={content.intro.kicker}
        />
        <PublicText as="p" value={content.intro.text} />
      </div>
    </section>
  );
}
