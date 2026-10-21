export type PreviewSettings = {
  text: string;
  color: string;
  width: number;
  height: number;
  image: string | null;
  imageFit?: "contain" | "cover";
  imageScale?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
  imageRotation?: number;
  lit: boolean;
};

export type SceneProps = {
  slug: string;
  settings: PreviewSettings;
  step: number;
  exploded: boolean;
  id: string;
};
