import type { ReactNode } from "react";
import ArtworkImage from "./ArtworkImage";
import { iso, ISO_COS, IsoPlane } from "./isometric";
import type { ArtworkSettings } from "./types";

export const vehicleSideProfile =
  "M4 102V21Q4 9 16 8H199Q215 8 225 16L258 51 287 64Q301 69 302 79L303 96Q303 102 294 102H275A22 22 0 0 0 231 102H71A22 22 0 0 0 27 102Z";
export const vehiclePassengerWindows =
  "M14 20Q14 17 18 17H177Q181 17 181 21V41Q181 45 177 45H18Q14 45 14 41Z";
export const vehicleDriverWindow =
  "M207 23 216 25 246 55Q248 58 244 58H210Q206 58 206 55Z";

const point = (x: number, y: number, z: number) => iso(x, y, z).join(" ");
export const vehicleHoodOutline = `M${point(113, -43, 114)}Q${point(144, -43, 105)} ${point(157, -38, 86)}L${point(157, 38, 86)}Q${point(144, 44, 105)} ${point(113, 44, 114)}Z`;
// One continuous inclined artwork plane avoids seams across text and images.
// The curved outer silhouette remains the exact clipping boundary. A small
// far-edge allowance covers the hood's rounded edge at its widest projection.
const hoodWidth = 94;
const hoodLength = Math.hypot(44, 28);
const hoodOrigin = iso(113, 44, 114);
const hoodFront = iso(157, 38, 86);
const hoodTransform = `matrix(${ISO_COS} -.5 ${(hoodFront[0] - hoodOrigin[0]) / hoodLength} ${(hoodFront[1] - hoodOrigin[1]) / hoodLength} ${hoodOrigin[0]} ${hoodOrigin[1]})`;

function HoodSurface({ children, id }: { children: ReactNode; id: string }) {
  return (
    <g data-iso-plane="inclined-hood" clipPath={`url(#${id}-hood-outline)`}>
      <defs>
        <clipPath id={`${id}-hood-outline`} clipPathUnits="userSpaceOnUse">
          <path d={vehicleHoodOutline} />
        </clipPath>
      </defs>
      <g transform={hoodTransform}>{children}</g>
    </g>
  );
}

function Surface({
  surface,
  settings,
  id,
  children,
}: {
  surface: "side" | "hood";
  settings: ArtworkSettings;
  id: string;
  children: ReactNode;
}) {
  if (surface === "hood") return <HoodSurface id={id}>{children}</HoodSurface>;
  const windows = settings.includeWindows
    ? ""
    : ` ${vehiclePassengerWindows} ${vehicleDriverWindow}`;
  return (
    <IsoPlane x={-145} y={44} z={165}>
      <defs>
        <clipPath id={`${id}-side-metal`} clipPathUnits="userSpaceOnUse">
          <path d={`${vehicleSideProfile}${windows}`} clipRule="evenodd" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-side-metal)`}>{children}</g>
    </IsoPlane>
  );
}

export default function VehicleArtwork({
  surface,
  settings,
  step,
  exploded,
  id,
}: {
  surface: "side" | "hood";
  settings: ArtworkSettings;
  step: number;
  exploded: boolean;
  id: string;
}) {
  const bounds =
    surface === "side"
      ? { x: 4, y: 8, width: 299, height: 94 }
      : { x: 0, y: 0, width: hoodWidth, height: hoodLength };
  const width = (bounds.width * settings.width) / 240;
  const height = (bounds.height * settings.height) / 100;
  const x = bounds.x + (bounds.width - width) / 2;
  const y = bounds.y + (bounds.height - height) / 2;
  const characters = Array.from(settings.text).length;
  const textWidth = Math.min(width, bounds.width) * 0.86;
  const fontSize = Math.min(
    surface === "side" ? 24 : 12,
    height * 0.24,
    textWidth / Math.max(3, characters * 0.72),
  );
  const baseline = Math.min(
    y + height * (surface === "side" ? 0.72 : 0.58),
    bounds.y + bounds.height * (surface === "side" ? 0.72 : 0.65),
  );
  const enabled = settings.enabled !== false;

  return (
    <g
      data-vehicle-surface={surface}
      data-enabled={enabled}
      data-include-windows={
        surface === "side" ? Boolean(settings.includeWindows) : undefined
      }
      data-surface-width={bounds.width}
      data-surface-height={bounds.height}
      data-coverage-width={(settings.width / 240) * 100}
      data-coverage-height={(settings.height / 100) * 100}
    >
      {enabled
        ? [1, 2, 3].map((layer) => (
            <g
              key={layer}
              className="preview-part"
              data-visible={step >= layer}
              data-layer={layer}
              data-exploded={exploded}
            >
              <Surface
                surface={surface}
                settings={settings}
                id={`${id}-${surface}-${layer}`}
              >
                {layer === 1 ? (
                  <rect
                    data-vehicle-preparation="true"
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="#f5f6ec"
                    fillOpacity=".17"
                    stroke="#a9bab1"
                    strokeWidth=".7"
                    strokeDasharray="3 3"
                  />
                ) : layer === 2 ? (
                  <g
                    data-vehicle-artwork="true"
                    data-artwork-x={x}
                    data-artwork-y={y}
                    data-artwork-width={width}
                    data-artwork-height={height}
                  >
                    {settings.image ? (
                      <ArtworkImage
                        settings={settings}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        id={`${id}-${surface}-image`}
                      />
                    ) : (
                      <g>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill="#e8ede7"
                        />
                        <path
                          d={`M${x + width * 0.63} ${y}H${x + width}V${y + height}H${x + width * 0.39}Z`}
                          fill={settings.color}
                        />
                        <path
                          d={`M${x + width * 0.08} ${y + height * 0.87}H${x + width * 0.53}`}
                          stroke={settings.color}
                          strokeWidth={Math.max(1, height * 0.025)}
                        />
                        <text
                          x={bounds.x + bounds.width / 2}
                          y={baseline}
                          textAnchor="middle"
                          fontFamily="Montserrat, Arial, sans-serif"
                          fontWeight="700"
                          fontSize={fontSize}
                          textLength={
                            characters
                              ? Math.min(
                                  textWidth,
                                  characters * fontSize * 0.66,
                                )
                              : undefined
                          }
                          lengthAdjust="spacingAndGlyphs"
                          fill="#263331"
                          data-text-surface-width={Math.min(
                            width,
                            bounds.width,
                          )}
                        >
                          {settings.text}
                        </text>
                      </g>
                    )}
                  </g>
                ) : (
                  <g data-vehicle-finish="true">
                    <path
                      d={`M${bounds.x + 4} ${bounds.y + bounds.height - 2}H${bounds.x + bounds.width - 4}`}
                      fill="none"
                      stroke="#d6e0d4"
                      strokeWidth=".7"
                      opacity=".6"
                    />
                  </g>
                )}
              </Surface>
            </g>
          ))
        : null}
    </g>
  );
}
