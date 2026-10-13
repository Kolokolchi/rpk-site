import type { Metadata } from "next";
import { headers } from "next/headers";
import { readRequestSecurityConfig } from "../server/config";
import { publicPath } from "../shared/public-path";

export function publicSiteOrigin(): string {
  if (process.env.RPK_STATIC_EXPORT !== "true")
    return readRequestSecurityConfig().publicOrigin;
  const origin = new URL(
    process.env.PUBLIC_ORIGIN || "https://kolokolchi.github.io",
  );
  if (
    origin.protocol !== "https:" ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  )
    throw new Error("Static PUBLIC_ORIGIN must be a clean HTTPS origin.");
  return origin.origin;
}

export function siteUrl(pathname: string): string {
  const path =
    process.env.RPK_STATIC_EXPORT === "true" &&
    !/[.#?]/.test(pathname) &&
    !pathname.endsWith("/")
      ? `${pathname}/`
      : pathname;
  return new URL(publicPath(path), publicSiteOrigin()).href;
}
export function pageMetadata(
  title: string,
  description: string,
  pathname: string,
): Metadata {
  const url = siteUrl(pathname);
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
          url: siteUrl("/og.png"),
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
      images: [siteUrl("/og.png")],
    },
  };
}
export async function StructuredData({ value }: { value: unknown }) {
  return (
    <script
      type="application/ld+json"
      nonce={
        process.env.RPK_STATIC_EXPORT === "true"
          ? undefined
          : (await headers()).get("x-nonce") || undefined
      }
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replaceAll("<", "\\u003c"),
      }}
    />
  );
}
