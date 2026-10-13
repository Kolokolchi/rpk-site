import { afterEach, expect, test, vi } from "vitest";
import { publicPath, withoutBasePath } from "../src/shared/public-path";

afterEach(() => vi.unstubAllEnvs());

test("ordinary server deployment keeps site paths and external URLs unchanged", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
  for (const path of [
    "/",
    "/catalog",
    "/assets/brand/rpk-logo-light.svg",
    "#portfolio",
    "https://wa.me/77476000932",
    "//cdn.example/image.webp",
  ])
    expect(publicPath(path)).toBe(path);
});

test("subpath deployment prefixes local links and assets once", () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/rpk-site");
  expect(publicPath("/")).toBe("/rpk-site/");
  expect(publicPath("/#services")).toBe("/rpk-site/#services");
  expect(publicPath("/assets/brand/brand-hero-1600.webp")).toBe(
    "/rpk-site/assets/brand/brand-hero-1600.webp",
  );
  expect(publicPath("/rpk-site/catalog")).toBe("/rpk-site/catalog");
  expect(publicPath("/rpk-site#top")).toBe("/rpk-site#top");
  expect(publicPath("/rpk-site-old/catalog")).toBe(
    "/rpk-site/rpk-site-old/catalog",
  );
  expect(publicPath("#process")).toBe("#process");
  expect(publicPath("https://www.rpk.kz/")).toBe("https://www.rpk.kz/");
  expect(publicPath("//cdn.example/image.webp")).toBe(
    "//cdn.example/image.webp",
  );
  expect(withoutBasePath("/rpk-site/catalog/channel-letters/")).toBe(
    "/catalog/channel-letters/",
  );
  expect(withoutBasePath("/rpk-site")).toBe("/");
  expect(withoutBasePath("/rpk-site-old/")).toBe("/rpk-site-old/");
});
