import type { PreviewSettings } from "./types";

/** One artwork viewport, clipped in the local coordinates of its physical face. */
export default function ArtworkImage({
  settings,
  x = 0,
  y = 0,
  width,
  height,
  id,
  shape = "rect",
}: {
  settings: PreviewSettings;
  x?: number;
  y?: number;
  width: number;
  height: number;
  id: string;
  shape?: "rect" | "circle";
}) {
  if (!settings.image) return null;
  const clipId = `${id}-artwork-viewport`;
  const scale = (settings.imageScale ?? 100) / 100;
  const dx = ((settings.imageOffsetX ?? 0) * width) / 100;
  const dy = ((settings.imageOffsetY ?? 0) * height) / 100;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const quarterTurn = (settings.imageRotation ?? 0) % 180 !== 0;
  const imageWidth = quarterTurn ? height : width;
  const imageHeight = quarterTurn ? width : height;
  return (
    <g data-artwork-viewport="true" clipPath={`url(#${clipId})`}>
      <defs>
        <clipPath id={clipId}>
          {shape === "circle" ? (
            <ellipse cx={cx} cy={cy} rx={width / 2} ry={height / 2} />
          ) : (
            <rect x={x} y={y} width={width} height={height} />
          )}
        </clipPath>
      </defs>
      <g
        data-artwork-transform="true"
        transform={`translate(${cx + dx} ${cy + dy}) rotate(${settings.imageRotation ?? 0}) scale(${scale}) translate(${-cx} ${-cy})`}
      >
        <image
          href={settings.image}
          x={cx - imageWidth / 2}
          y={cy - imageHeight / 2}
          width={imageWidth}
          height={imageHeight}
          preserveAspectRatio={
            settings.imageFit === "cover" ? "xMidYMid slice" : "xMidYMid meet"
          }
        />
      </g>
    </g>
  );
}
