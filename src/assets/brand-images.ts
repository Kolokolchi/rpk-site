import { publicPath } from "../shared/public-path";

const brand0w480 = publicPath("/assets/brand/brand-hero-480.webp");
const brand0w960 = publicPath("/assets/brand/brand-hero-960.webp");
const brand0w1600 = publicPath("/assets/brand/brand-hero-1600.webp");
const brand1w480 = publicPath("/assets/brand/brand-material-480.webp");
const brand1w960 = publicPath("/assets/brand/brand-material-960.webp");
const brand1w1600 = publicPath("/assets/brand/brand-material-1600.webp");

export const bundledBrandImages: Record<
  string,
  { src: string; srcSet: string; width: number; height: number }
> = {
  "/src/assets/brand/brand-hero.webp": {
    src: brand0w1600,
    srcSet: `${brand0w480} 480w, ${brand0w960} 960w, ${brand0w1600} 1600w`,
    width: 1600,
    height: 900,
  },
  "/src/assets/brand/brand-material.webp": {
    src: brand1w1600,
    srcSet: `${brand1w480} 480w, ${brand1w960} 960w, ${brand1w1600} 1536w`,
    width: 1536,
    height: 1024,
  },
};
