import { CheckCircle2 } from "lucide-react";
import type { SiteContent } from "../../shared/content-schema";
import { PublicText, SectionAtmosphere } from "./primitives";
import { revealDelayClass } from "./site-utils";

export default function TestimonialsSection({
  content,
}: {
  content: SiteContent;
}) {
  return (
    <section
      className="testimonials-section section-transition reveal-on-scroll"
      id="testimonials"
      aria-labelledby="testimonials-title"
    >
      <SectionAtmosphere theme="results" />
      <div className="section-heading">
        <PublicText
          as="h2"
          id="testimonials-title"
          value={content.testimonialsTitle}
        />
      </div>

      <div className="testimonial-grid">
        {content.testimonials.map((testimonial, index) => (
          <article
            className={`testimonial-card reveal-on-scroll ${revealDelayClass(index)}`}
            key={`testimonial-${index}`}
          >
            <CheckCircle2 aria-hidden="true" />
            <PublicText
              as="p"
              className="testimonial-statement"
              value={testimonial.quote}
            />
            <div>
              <PublicText as="strong" value={testimonial.author} />
              <PublicText value={testimonial.scope} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
