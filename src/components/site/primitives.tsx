import { createElement } from "react";
import { readableHeading } from "../../shared/typography";
import { resolveImageSource, siteImageSource } from "./site-utils";

type PublicTextProps = {
  as?: keyof HTMLElementTagNameMap;
  value: string;
  className?: string;
  id?: string;
  emphasis?: string;
};

export function PublicText({
  as = "span",
  value,
  className,
  id,
  emphasis,
}: PublicTextProps) {
  const text =
    emphasis &&
    value.toLocaleLowerCase("ru").endsWith(emphasis.toLocaleLowerCase("ru")) ? (
      <>
        <span>
          {value
            .slice(0, -emphasis.length)
            .replace(/(^|\s)(в|и|по|для|от|до)\s+/gi, "$1$2\u00a0")}
        </span>
        <span className="heading-emphasis">
          {value.slice(-emphasis.length)}
        </span>
      </>
    ) : (
      value
    );
  return createElement(
    as,
    { className, id },
    typeof text === "string" && /^h[1-6]$/.test(as)
      ? readableHeading(text)
      : text,
  );
}

type PublicImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function PublicImage({
  src,
  alt,
  className = "",
  imageClassName,
  priority = false,
  sizes = "(max-width: 820px) calc(100vw - 32px), (max-width: 1100px) 50vw, 800px",
}: PublicImageProps) {
  const image = siteImageSource(src);
  return (
    <div className={`image-shell ${className}`}>
      {src ? (
        <img
          className={imageClassName}
          src={resolveImageSource(src)}
          srcSet={image?.srcSet}
          sizes={image ? sizes : undefined}
          width={image?.width}
          height={image?.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          alt={alt}
        />
      ) : null}
    </div>
  );
}

type AtmosphereTheme =
  | "blueprint"
  | "services"
  | "advantages"
  | "production"
  | "portfolio"
  | "clients"
  | "results"
  | "ecosystem"
  | "contact";

export function SectionAtmosphere({ theme }: { theme: AtmosphereTheme }) {
  return (
    <div
      className={`section-atmosphere atmosphere-${theme}`}
      aria-hidden="true"
    >
      <span className="atmosphere-glow" />
    </div>
  );
}
