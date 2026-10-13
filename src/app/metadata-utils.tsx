import type { Metadata } from "next";
import { headers } from "next/headers";
import { readRequestSecurityConfig } from "../server/config";
export function pageMetadata(
  title: string,
  description: string,
  pathname: string,
): Metadata {
  const origin = readRequestSecurityConfig().publicOrigin;
  const url = new URL(pathname, origin).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: "RPK.KZ",
      locale: "ru_KZ",
      type: "website",
      images: [
        {
          url: new URL("/og.png", origin).href,
          width: 1200,
          height: 630,
          alt: "RPK — Больше чем реклама",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/og.png", origin).href],
    },
  };
}
export async function StructuredData({ value }: { value: unknown }) {
  return (
    <script
      type="application/ld+json"
      nonce={(await headers()).get("x-nonce") || undefined}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replaceAll("<", "\\u003c"),
      }}
    />
  );
}
