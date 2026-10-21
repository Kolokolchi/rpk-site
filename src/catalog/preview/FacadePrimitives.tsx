import type { ReactNode } from "react";
import { iso } from "./isometric";

export type Point3 = [number, number, number];

export function projected(point: Point3) {
  return iso(...point).join(",");
}

export function Box({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  front = "#414d52",
  side = "#293940",
  top = "#6a7779",
  stroke = "#7a898b",
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
}) {
  return (
    <g stroke={stroke} strokeWidth=".7" strokeLinejoin="round">
      <polygon
        points={[
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ]
          .map((p) => projected(p as Point3))
          .join(" ")}
        fill={front}
      />
      <polygon
        points={[
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        ]
          .map((p) => projected(p as Point3))
          .join(" ")}
        fill={side}
      />
      <polygon
        points={[
          [x, y, z + h],
          [x + w, y, z + h],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ]
          .map((p) => projected(p as Point3))
          .join(" ")}
        fill={top}
      />
    </g>
  );
}

export function WallPlane({
  x,
  y,
  z,
  axis = "x",
  children,
}: {
  x: number;
  y: number;
  z: number;
  axis?: "x" | "y" | "negative-y";
  children: ReactNode;
}) {
  const [px, py] = iso(x, y, z);
  const [qx, qy] =
    axis === "x"
      ? iso(x + 1, y, z)
      : iso(x, y + (axis === "negative-y" ? -1 : 1), z);
  return (
    <g
      transform={`matrix(${qx - px} ${qy - py} 0 1 ${px} ${py})`}
      data-physical-plane={axis}
      data-iso-plane={axis === "x" ? "front" : "side"}
    >
      {children}
    </g>
  );
}

export function Line3({
  a,
  b,
  color = "#809397",
  width = 1.5,
}: {
  a: Point3;
  b: Point3;
  color?: string;
  width?: number;
}) {
  return (
    <path
      d={`M${projected(a)}L${projected(b)}`}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

export function Ground({ room = false }: { room?: boolean }) {
  return (
    <g>
      <Box
        x={-190}
        y={-145}
        z={-8}
        w={380}
        d={290}
        h={8}
        front="#25343a"
        side="#202e34"
        top={room ? "#485453" : "#35444a"}
        stroke="#5a6c70"
      />
      {[-140, -80, -20, 40, 100, 160].map((n) => (
        <g key={n}>
          <Line3
            a={[n, -144, 0.2]}
            b={[n, 144, 0.2]}
            color="#526369"
            width={0.7}
          />
          <Line3
            a={[-189, n * 0.8, 0.2]}
            b={[189, n * 0.8, 0.2]}
            color="#526369"
            width={0.7}
          />
        </g>
      ))}
    </g>
  );
}

export function Grass({
  x,
  y,
  small = false,
}: {
  x: number;
  y: number;
  small?: boolean;
}) {
  const size = small ? 19 : 25;
  return (
    <g>
      <Box
        x={x - size / 2}
        y={y - size / 2}
        w={size}
        d={size}
        h={20}
        front="#526058"
        side="#344b45"
        top="#23392e"
        stroke="#7a8b77"
      />
      {[-8, -4, 0, 4, 8].map((offset, index) => {
        const origin = iso(x + offset, y, 20);
        const tip = iso(x + offset * 1.8, y - 4, 44 + (index % 3) * 5);
        return (
          <path
            key={offset}
            d={`M${origin.join(",")}Q${origin[0] + offset * 0.7},${tip[1] + 14} ${tip.join(",")}`}
            fill="none"
            stroke={index % 2 ? "#a1a478" : "#7e9675"}
            strokeWidth="1.6"
          />
        );
      })}
    </g>
  );
}

export function Window3({
  x,
  y,
  z,
  w,
  h,
  axis = "x",
  door = false,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  axis?: "x" | "y";
  door?: boolean;
}) {
  return (
    <WallPlane x={x} y={y} z={z} axis={axis}>
      <rect
        width={w}
        height={h}
        fill="#253e48"
        stroke="#8ba2a3"
        strokeWidth="1.5"
      />
      <path
        d={`M${w / 2} 0V${h}M1 ${door ? h * 0.22 : h * 0.74}H${w - 1}`}
        stroke="#6b8a91"
        strokeWidth="1.2"
      />
      <path d={`M4 4H${w * 0.35}L8 ${h - 4}H4Z`} fill="#bfd6d0" opacity=".12" />
      {door ? (
        <path
          d={`M${w / 2 - 5} ${h * 0.5}v11M${w / 2 + 5} ${h * 0.5}v11`}
          stroke="#cbd6c4"
          strokeWidth="2"
        />
      ) : null}
    </WallPlane>
  );
}

export function CutawayRoom({ slats = false }: { slats?: boolean }) {
  return (
    <g>
      <Ground room />
      <Box
        x={-145}
        y={-115}
        w={290}
        d={8}
        h={185}
        front="#414b4b"
        side="#2e4045"
        top="#7d8985"
      />
      <Box
        x={-145}
        y={-107}
        w={8}
        d={222}
        h={185}
        front="#33494d"
        side={slats ? "#4b514b" : "#394b4e"}
        top="#7d8985"
      />
      <WallPlane x={-136} y={-106} z={185} axis="y">
        {Array.from({ length: 22 }, (_, i) => (
          <path
            key={i}
            d={`M${i * 10} 0V185`}
            stroke={slats ? "#9b8d70" : "#576c6b"}
            strokeWidth={slats ? 2.5 : 0.7}
          />
        ))}
      </WallPlane>
      <Line3 a={[-136, 114, 2]} b={[-136, -106, 2]} color="#91a29a" width={2} />
      <Line3 a={[-136, -106, 2]} b={[144, -106, 2]} color="#91a29a" width={2} />
    </g>
  );
}
