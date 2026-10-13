import { z } from "zod";

const forbiddenTextCharacters =
  // eslint-disable-next-line no-control-regex -- reject untrusted control characters
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/u;
const unpairedSurrogate = /[\uD800-\uDFFF]/u;
const hasSafeUnicode = (value: string) =>
  !forbiddenTextCharacters.test(value) && !unpairedSurrogate.test(value);
const safeString = (maximum: number) =>
  z
    .string()
    .min(1)
    .max(maximum)
    .refine(
      hasSafeUnicode,
      "Control characters and malformed Unicode are not allowed.",
    );
const shortText = safeString(500);
const longText = safeString(20_000);
const iconName = z.enum([
  "badge",
  "check",
  "clock",
  "factory",
  "hammer",
  "ruler",
  "shield",
]);

const trustedAssetPattern =
  /^\/(?:assets|src\/assets)\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.(?:avif|gif|jpe?g|png|svg|webp)$/;

export function isSafeImageSource(value: string) {
  return trustedAssetPattern.test(value);
}

const imageSource = z
  .string()
  .min(1)
  .max(512)
  .refine(isSafeImageSource, "Only trusted site assets are allowed.");

const footerUrl = z
  .url()
  .max(500)
  .refine(
    hasSafeUnicode,
    "Control characters and malformed Unicode are not allowed.",
  )
  .refine((value) => {
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        !url.port &&
        (url.hostname === "rpk.kz" || url.hostname === "www.rpk.kz")
      );
    } catch {
      return false;
    }
  }, "Footer URL must be an HTTPS URL on rpk.kz.");

const titledText = z
  .object({
    title: shortText,
    text: longText,
  })
  .strict();

export const siteContentSchema = z
  .object({
    hero: z
      .object({
        eyebrow: shortText,
        title: shortText,
        lead: longText,
        background: imageSource,
        stats: z
          .array(
            z
              .object({
                value: shortText,
                label: shortText,
              })
              .strict(),
          )
          .max(12),
      })
      .strict(),
    intro: z
      .object({
        kicker: shortText,
        title: shortText,
        text: longText,
      })
      .strict(),
    servicesTitle: shortText,
    services: z
      .array(
        z
          .object({
            title: shortText,
            text: longText,
            image: imageSource,
            meta: shortText,
          })
          .strict(),
      )
      .max(24),
    advantagesTitle: shortText,
    advantages: z
      .array(
        titledText.extend({
          icon: iconName,
        }),
      )
      .max(24),
    production: z
      .object({
        kicker: shortText,
        title: shortText,
        text: longText,
        image: imageSource,
        imageAlt: shortText,
      })
      .strict(),
    process: z
      .array(
        titledText.extend({
          icon: iconName,
        }),
      )
      .max(24),
    portfolioTitle: shortText,
    portfolio: z
      .array(
        z
          .object({
            id: z.uuid().optional(),
            title: shortText,
            category: shortText,
            text: longText,
            image: imageSource,
          })
          .strict(),
      )
      .max(60),
    clientsTitle: shortText,
    clients: z
      .array(
        z
          .object({
            id: z.uuid().optional(),
            name: shortText,
            logo: z.union([z.literal(""), imageSource]).optional(),
          })
          .strict(),
      )
      .max(100),
    testimonialsTitle: shortText,
    testimonials: z
      .array(
        z
          .object({
            quote: longText,
            author: shortText,
            scope: shortText,
          })
          .strict(),
      )
      .max(60),
    ecosystem: z
      .object({
        kicker: shortText,
        title: shortText,
        text: longText,
        zones: z.array(titledText).max(24),
      })
      .strict(),
    contact: z
      .object({
        eyebrow: shortText,
        title: shortText,
        text: longText,
        email: z
          .email()
          .max(254)
          .refine(
            hasSafeUnicode,
            "Control characters and malformed Unicode are not allowed.",
          ),
        phone: safeString(32)
          .min(7)
          .regex(/^\+?[0-9 ()-]+$/, "Phone contains unsupported characters."),
        location: shortText,
      })
      .strict(),
    footer: z
      .object({
        text: longText,
        url: footerUrl,
      })
      .strict(),
  })
  .strict();

export function validationIssueSummary(error: z.ZodError) {
  return error.issues.slice(0, 12).map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export type PublishedContent = z.infer<typeof siteContentSchema>;
export type SiteContent = Omit<PublishedContent, "portfolio" | "clients"> & {
  portfolio: Array<PublishedContent["portfolio"][number] & { id: string }>;
  clients: Array<PublishedContent["clients"][number] & { id: string }>;
};
export type ContentSnapshot = {
  content: SiteContent;
  revision: string | null;
  repairedFallback: boolean;
};
