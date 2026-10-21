import type { ReactNode } from "react";

export const ISO_COS = Math.sqrt(3) / 2;
export type Point3 = readonly [number, number, number?];

/** Equal-scale orthographic projection: X/Y at 30°, Z remains vertical. */
export function iso(x: number, y: number, z = 0): [number, number] {
  return [400 + (x - y) * ISO_COS, 420 + (x + y) * 0.5 - z];
}

export function isoPoints(...vertices: Point3[]) {
  return vertices.map(([x, y, z = 0]) => iso(x, y, z).join(",")).join(" ");
}

export function IsoBox({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  front = "#3d494e",
  side = "#27343b",
  top = "#69767a",
  stroke = "#76838a",
  strokeWidth = 0.65,
}: {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  front?: string;
  side?: string;
  top?: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <g stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round">
      <polygon
        points={isoPoints(
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        )}
        fill={front}
      />
      <polygon
        points={isoPoints(
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        )}
        fill={side}
      />
      <polygon
        points={isoPoints(
          [x, y, z + h],
          [x + w, y, z + h],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        )}
        fill={top}
      />
    </g>
  );
}

export function IsoPlane({
  x,
  y,
  z = 0,
  plane = "front",
  children,
  ...attributes
}: {
  x: number;
  y: number;
  z?: number;
  plane?: "front" | "side" | "floor";
  children: ReactNode;
} & Omit<
  React.SVGProps<SVGGElement>,
  "x" | "y" | "z" | "children" | "transform"
>) {
  const [px, py] = iso(x, y, z);
  const axes =
    plane === "floor"
      ? `${ISO_COS} .5 ${-ISO_COS} .5`
      : plane === "side"
        ? `${-ISO_COS} .5 0 1`
        : `${ISO_COS} .5 0 1`;
  return (
    <g
      {...attributes}
      data-iso-plane={plane}
      transform={`matrix(${axes} ${px} ${py})`}
    >
      {children}
    </g>
  );
}

export function IsoLine({
  from,
  to,
  stroke = "#89969c",
  width = 1.5,
}: {
  from: Point3;
  to: Point3;
  stroke?: string;
  width?: number;
}) {
  const a = iso(...from);
  const b = iso(...to);
  return (
    <line
      x1={a[0]}
      y1={a[1]}
      x2={b[0]}
      y2={b[1]}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}
