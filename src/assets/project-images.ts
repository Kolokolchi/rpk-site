import { publicPath } from "../shared/public-path";

const project0w480 = publicPath("/assets/projects/al-store-panel-480.webp");
const project0w960 = publicPath("/assets/projects/al-store-panel-960.webp");
const project0w1007 = publicPath("/assets/projects/al-store-panel-1007.webp");
const project1w480 = publicPath(
  "/assets/projects/energo-university-stop-480.webp",
);
const project1w960 = publicPath(
  "/assets/projects/energo-university-stop-960.webp",
);
const project1w1600 = publicPath(
  "/assets/projects/energo-university-stop-1600.webp",
);
const project2w480 = publicPath("/assets/projects/fablab-campus-480.webp");
const project2w960 = publicPath("/assets/projects/fablab-campus-960.webp");
const project2w1600 = publicPath("/assets/projects/fablab-campus-1600.webp");
const project3w480 = publicPath("/assets/projects/food-point-facade-480.webp");
const project3w960 = publicPath("/assets/projects/food-point-facade-960.webp");
const project3w1255 = publicPath(
  "/assets/projects/food-point-facade-1255.webp",
);
const project4w480 = publicPath("/assets/projects/glass-portal-led-480.webp");
const project4w960 = publicPath("/assets/projects/glass-portal-led-960.webp");
const project4w1403 = publicPath("/assets/projects/glass-portal-led-1403.webp");
const project5w480 = publicPath("/assets/projects/needstop-kiosk-01-480.webp");
const project5w960 = publicPath("/assets/projects/needstop-kiosk-01-960.webp");
const project5w1420 = publicPath(
  "/assets/projects/needstop-kiosk-01-1420.webp",
);
const project6w480 = publicPath(
  "/assets/projects/sa-pharma-engineering-480.webp",
);
const project6w960 = publicPath(
  "/assets/projects/sa-pharma-engineering-960.webp",
);
const project6w1256 = publicPath(
  "/assets/projects/sa-pharma-engineering-1256.webp",
);
const project7w480 = publicPath("/assets/projects/toimart-signage-480.webp");
const project7w960 = publicPath("/assets/projects/toimart-signage-960.webp");
const project7w1600 = publicPath("/assets/projects/toimart-signage-1600.webp");
const project8w480 = publicPath(
  "/assets/projects/you-vs-you-interior-480.webp",
);
const project8w960 = publicPath(
  "/assets/projects/you-vs-you-interior-960.webp",
);
const project8w1304 = publicPath(
  "/assets/projects/you-vs-you-interior-1304.webp",
);

export const bundledProjectImages: Record<
  string,
  { src: string; srcSet: string; width: number; height: number }
> = {
  "/src/assets/projects/al-store-panel.jpg": {
    src: project0w1007,
    srcSet: `${project0w480} 480w, ${project0w960} 960w, ${project0w1007} 1007w`,
    width: 1007,
    height: 1125,
  },
  "/src/assets/projects/energo-university-stop.jpg": {
    src: project1w1600,
    srcSet: `${project1w480} 480w, ${project1w960} 960w, ${project1w1600} 1600w`,
    width: 1600,
    height: 927,
  },
  "/src/assets/projects/fablab-campus.jpg": {
    src: project2w1600,
    srcSet: `${project2w480} 480w, ${project2w960} 960w, ${project2w1600} 1600w`,
    width: 1600,
    height: 1021,
  },
  "/src/assets/projects/food-point-facade.jpg": {
    src: project3w1255,
    srcSet: `${project3w480} 480w, ${project3w960} 960w, ${project3w1255} 1255w`,
    width: 1255,
    height: 1097,
  },
  "/src/assets/projects/glass-portal-led.jpg": {
    src: project4w1403,
    srcSet: `${project4w480} 480w, ${project4w960} 960w, ${project4w1403} 1403w`,
    width: 1403,
    height: 950,
  },
  "/src/assets/projects/needstop-kiosk-01.jpg": {
    src: project5w1420,
    srcSet: `${project5w480} 480w, ${project5w960} 960w, ${project5w1420} 1420w`,
    width: 1420,
    height: 958,
  },
  "/src/assets/projects/sa-pharma-engineering.jpg": {
    src: project6w1256,
    srcSet: `${project6w480} 480w, ${project6w960} 960w, ${project6w1256} 1256w`,
    width: 1256,
    height: 1125,
  },
  "/src/assets/projects/toimart-signage.jpg": {
    src: project7w1600,
    srcSet: `${project7w480} 480w, ${project7w960} 960w, ${project7w1600} 1600w`,
    width: 1600,
    height: 961,
  },
  "/src/assets/projects/you-vs-you-interior.jpg": {
    src: project8w1304,
    srcSet: `${project8w480} 480w, ${project8w960} 960w, ${project8w1304} 1304w`,
    width: 1304,
    height: 958,
  },
};
