import type { PreviewSettings, SceneProps } from "./types";
import FacadeContext from "./FacadeContext";
import ArtworkImage from "./ArtworkImage";
import { Box, Line3, WallPlane } from "./FacadePrimitives";

function Art({
  settings,
  w,
  h,
  id,
  ink,
  tube = false,
  core = false,
  shape = "rect",
}: {
  settings: PreviewSettings;
  w: number;
  h: number;
  id: string;
  ink: string;
  tube?: boolean;
  core?: boolean;
  shape?: "rect" | "circle";
}) {
  const label = settings.text.trim();
  const size = Math.min(
    h * 0.71,
    w / Math.max(Array.from(label).length * 0.66, 2.5),
  );
  if (settings.image)
    return (
      <ArtworkImage
        settings={settings}
        width={w}
        height={h}
        id={id}
        shape={shape}
      />
    );
  return (
    <g
      fontFamily="inherit"
      fontWeight={tube ? 500 : 800}
      fontSize={size}
      textAnchor="middle"
      dominantBaseline="central"
    >
      <text
        x={w / 2}
        y={h / 2}
        fill={tube ? "none" : ink}
        stroke={tube ? ink : "none"}
        strokeWidth={tube ? 1.5 : 0}
        strokeLinejoin="round"
      >
        {label}
      </text>
      {core ? (
        <text
          x={w / 2}
          y={h / 2}
          fill="none"
          stroke="#fff4dd"
          strokeWidth=".45"
          strokeLinejoin="round"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function Extrusion({
  settings,
  x,
  y,
  z,
  w,
  h,
  id,
}: {
  settings: PreviewSettings;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  id: string;
}) {
  return (
    <g>
      <defs>
        <filter id={`${id}-silhouette`}>
          <feFlood floodColor="#64777e" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      {[0, 1, 2, 3, 4].map((depth) => (
        <WallPlane key={depth} x={x} y={y + depth} z={z}>
          <g filter={settings.image ? `url(#${id}-silhouette)` : undefined}>
            <Art
              settings={settings}
              w={w}
              h={h}
              id={`${id}-${depth}`}
              ink={depth === 0 ? "#233943" : "#6b7c80"}
            />
          </g>
        </WallPlane>
      ))}
    </g>
  );
}

function PortalLighting({
  w,
  h,
  ink,
  width,
}: {
  w: number;
  h: number;
  ink: string;
  width: number;
}) {
  const jamb = w / 2 - 10;
  const underside = 12 + h - 29;
  return (
    <g data-light-placement="canopy-underside">
      {[-jamb, jamb].map((side) => (
        <g key={side}>
          <Line3
            a={[side, 92.5, 12]}
            b={[side, 92.5, underside]}
            color={ink}
            width={width}
          />
          <Line3
            a={[side, 92.5, underside]}
            b={[side, 108, underside]}
            color={ink}
            width={width}
          />
        </g>
      ))}
      <Line3
        a={[-jamb, 108, underside]}
        b={[jamb, 108, underside]}
        color={ink}
        width={width}
      />
    </g>
  );
}

export default function FacadeScene({
  slug,
  settings,
  step,
  exploded,
  id,
}: SceneProps) {
  const channel = slug === "channel-letters";
  const lightbox = slug === "lightboxes";
  const projecting = slug === "projecting-signs";
  const neon = slug === "neon-signs";
  const flat = slug === "non-illuminated-signs";
  const roof = slug === "roof-signs";
  const portal = slug === "facades-and-entrances";
  const installation = slug === "installation-and-service";
  const widthRatio = (settings.width - 120) / 240;
  const heightRatio = (settings.height - 50) / 100;
  const w = 110 + widthRatio * 90;
  const h = 22 + heightRatio * 24;
  const centerX = neon || flat ? 20 : installation ? 8 : 0;
  const y =
    neon || flat ? -104 : roof ? 57 : lightbox ? 78 : installation ? 93 : 78;
  const z =
    neon || flat ? 146 : roof ? 284 : lightbox ? 108 : installation ? 116 : 124;
  const x = centerX - w / 2;
  const color = settings.color;
  const lit = settings.lit;
  const pw = 130 + widthRatio * 90;
  const ph = 110 + heightRatio * 40;
  const sw = 36 + widthRatio * 30;
  const sh = 36 + heightRatio * 30;
  const projectedY = 58 + sw;
  const channels = [1, 3, 5].map((start) =>
    parseInt(color.slice(start, start + 2), 16),
  );
  const bright =
    channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 > 165;
  const part = (
    layer: number,
    kind = layer === 1 ? "frame" : layer === 2 ? "face" : "illumination",
  ) => ({
    className: "preview-part",
    "data-visible": step >= layer,
    "data-layer": layer,
    "data-product-stage": layer,
    "data-stage-kind": kind,
    "data-exploded": exploded,
  });
  const caption = roof
    ? "БИЗНЕС-ЦЕНТР"
    : projecting
      ? "ПЕШЕХОДНАЯ УЛИЦА"
      : neon
        ? "ИНТЕРЬЕР КАФЕ"
        : flat
          ? "ОФИСНЫЙ ХОЛЛ"
          : lightbox
            ? "ПАВИЛЬОН КАФЕ"
            : portal
              ? "ВХОД В ТОРГОВЫЙ ОБЪЕКТ"
              : installation
                ? "ЗОНА ОБСЛУЖИВАНИЯ"
                : "УГЛОВОЙ МАГАЗИН";

  return (
    <g data-projection="isometric">
      <defs>
        <filter
          id={`${id}-sign-glow`}
          x="-30%"
          y="-60%"
          width="160%"
          height="220%"
        >
          <feGaussianBlur stdDeviation="2.5" />
          <feComponentTransfer>
            <feFuncA type="linear" slope=".45" />
          </feComponentTransfer>
        </filter>
      </defs>
      <g
        transform={
          roof ? "translate(48 -28) scale(.88)" : "translate(24 -61) scale(.94)"
        }
      >
        <FacadeContext slug={slug} />

        <g {...part(1)}>
          {portal ? (
            <g>
              <Box
                x={-pw / 2}
                y={82}
                z={12}
                w={10}
                d={10}
                h={ph}
                front={color}
                side="#38535c"
                top="#91a39a"
              />
              <Box
                x={pw / 2 - 10}
                y={82}
                z={12}
                w={10}
                d={10}
                h={ph}
                front={color}
                side="#38535c"
                top="#91a39a"
              />
              <Box
                x={-pw / 2}
                y={82}
                z={12 + ph - 23}
                w={pw}
                d={10}
                h={23}
                front={color}
                side="#38535c"
                top="#91a39a"
              />
            </g>
          ) : projecting ? (
            <g>
              {[146 - sh * 0.25, 146 - sh * 0.75].map((height) => (
                <Box
                  key={height}
                  x={-40}
                  y={45}
                  z={height}
                  w={7}
                  d={13 + sw / 2}
                  h={4}
                  front="#6e8387"
                  top="#9aaaa0"
                />
              ))}
              <WallPlane x={-38} y={projectedY} z={146} axis="negative-y">
                <ellipse
                  cx={sw / 2}
                  cy={sh / 2}
                  rx={sw / 2 + 2}
                  ry={sh / 2 + 2}
                  fill="#6f858a"
                  stroke="#a1b2a8"
                />
              </WallPlane>
              <WallPlane x={-34} y={projectedY} z={146} axis="negative-y">
                <ellipse
                  cx={sw / 2}
                  cy={sh / 2}
                  rx={sw / 2}
                  ry={sh / 2}
                  fill="#263f49"
                  stroke={color}
                  strokeWidth="2"
                />
              </WallPlane>
            </g>
          ) : channel ? (
            <Extrusion
              settings={settings}
              x={x}
              y={y}
              z={z}
              w={w}
              h={h}
              id={`${id}-bodies`}
            />
          ) : lightbox || neon || flat ? (
            <g>
              <Box
                x={x - 3}
                y={y - 3}
                z={z - h - 3}
                w={w + 6}
                d={lightbox ? 9 : 3}
                h={h + 6}
                front={neon ? "#243e46" : "#2b444e"}
                side="#1c333d"
                top={lightbox ? color : "#728a8b"}
              />
              {lightbox ? (
                <WallPlane x={x} y={y + 7} z={z}>
                  <g fill="#a3bfae">
                    {[0.12, 0.32, 0.52, 0.72, 0.9].map((ratio) => (
                      <rect
                        key={ratio}
                        x={w * ratio}
                        y={h * 0.42}
                        width="6"
                        height="3"
                      />
                    ))}
                  </g>
                </WallPlane>
              ) : null}
            </g>
          ) : (
            <g>
              {roof ? (
                <g>
                  {[x + 14, x + w - 18].map((px) => (
                    <g key={px}>
                      <Box
                        x={px}
                        y={49}
                        z={237}
                        w={4}
                        d={8}
                        h={45}
                        front="#70878e"
                        top="#a2b0a8"
                      />
                      <Line3
                        a={[px + 2, 22, 237]}
                        b={[px + 2, 53, 270]}
                        color="#7e969a"
                        width={2}
                      />
                    </g>
                  ))}
                  {[0.3, 0.75].map((ratio) => (
                    <Line3
                      key={ratio}
                      a={[x + 12, 57, z - h * ratio]}
                      b={[x + w - 12, 57, z - h * ratio]}
                      color="#a0b0aa"
                      width={2.5}
                    />
                  ))}
                </g>
              ) : (
                <g>
                  <Line3
                    a={[x + 7, y, z - h * 0.3]}
                    b={[x + w - 7, y, z - h * 0.3]}
                    color="#8a9c9b"
                    width={2}
                  />
                  <Line3
                    a={[x + 7, y, z - h * 0.8]}
                    b={[x + w - 7, y, z - h * 0.8]}
                    color="#8a9c9b"
                    width={2}
                  />
                </g>
              )}
            </g>
          )}
        </g>

        <g
          {...part(3)}
          data-visible={step >= 3 && lit && !flat}
          filter={`url(#${id}-sign-glow)`}
        >
          {portal ? (
            <PortalLighting w={pw} h={ph} ink="#ffdc9a" width={6} />
          ) : projecting ? (
            <WallPlane x={-32} y={projectedY} z={146} axis="negative-y">
              <ellipse
                cx={sw / 2}
                cy={sh / 2}
                rx={sw / 2 + 1}
                ry={sh / 2 + 1}
                fill="none"
                stroke={color}
                strokeWidth="6"
              />
            </WallPlane>
          ) : lightbox ? (
            <WallPlane x={x - 2} y={y + 8} z={z + 2}>
              <rect
                width={w + 4}
                height={h + 4}
                fill="none"
                stroke={color}
                strokeWidth="6"
              />
            </WallPlane>
          ) : (
            <WallPlane x={x} y={y + 6} z={z}>
              <Art
                settings={settings}
                w={w}
                h={h}
                id={`${id}-halo`}
                ink={color}
                tube={neon}
              />
            </WallPlane>
          )}
        </g>

        {portal ? (
          <>
            <g {...part(3)} data-visible={step >= 3 && lit}>
              <PortalLighting w={pw} h={ph} ink="#fff0cb" width={1.5} />
            </g>
            <g {...part(1)} data-occluder="canopy">
              <Box
                x={-pw / 2 - 4}
                y={82}
                z={12 + ph - 27}
                w={pw + 8}
                d={27}
                h={4}
                front="#526b72"
                top="#9ba89c"
              />
            </g>
          </>
        ) : null}

        <g {...part(2)}>
          {portal ? (
            <g>
              <Extrusion
                settings={settings}
                x={-pw / 2 + 8}
                y={93}
                z={12 + ph - 3}
                w={pw - 16}
                h={18}
                id={`${id}-portal-depth`}
              />
              <WallPlane x={-pw / 2 + 8} y={98} z={12 + ph - 3}>
                <Art
                  settings={settings}
                  w={pw - 16}
                  h={18}
                  id={`${id}-portal-face`}
                  ink={bright ? "#1e333c" : "#f4eee0"}
                />
              </WallPlane>
            </g>
          ) : projecting ? (
            <WallPlane x={-32} y={projectedY} z={146} axis="negative-y">
              <ellipse
                cx={sw / 2}
                cy={sh / 2}
                rx={sw / 2}
                ry={sh / 2}
                fill="#edf0e7"
                stroke={color}
                strokeWidth="2"
              />
              <g transform="translate(4 4)">
                <Art
                  settings={settings}
                  w={sw - 8}
                  h={sh - 8}
                  id={`${id}-projecting-face`}
                  ink="#1b303b"
                  shape="circle"
                />
              </g>
            </WallPlane>
          ) : (
            <g>
              {!channel && !neon && !lightbox && !flat ? (
                <Extrusion
                  settings={settings}
                  x={x}
                  y={y}
                  z={z}
                  w={w}
                  h={h}
                  id={`${id}-letter-depth`}
                />
              ) : null}
              <WallPlane
                x={x}
                y={y + (lightbox ? 8 : neon || flat ? 1 : 5)}
                z={z}
              >
                {lightbox ? (
                  <rect width={w} height={h} fill="#e9eee3" stroke={color} />
                ) : null}
                <g transform={lightbox ? "translate(3 2)" : undefined}>
                  <Art
                    settings={settings}
                    w={lightbox ? w - 6 : w}
                    h={lightbox ? h - 4 : h}
                    id={`${id}-face`}
                    ink={lightbox ? "#19313d" : neon ? "#6c858a" : color}
                    tube={neon}
                  />
                </g>
              </WallPlane>
            </g>
          )}
        </g>

        {flat || roof || lightbox || installation ? (
          <g {...part(3, "finishing")}>
            {flat ? (
              <WallPlane x={x - 1} y={y + 2} z={z + 1}>
                <g fill="#b4c3b6">
                  {[3, w - 1].flatMap((u) =>
                    [3, h - 1].map((v) => (
                      <circle key={u + ":" + v} cx={u} cy={v} r="1.3" />
                    )),
                  )}
                </g>
              </WallPlane>
            ) : null}
            {roof ? (
              <g>
                {[x + 10, x + w - 25].map((px) => (
                  <Box
                    key={px}
                    x={px}
                    y={47}
                    z={237}
                    w={13}
                    d={15}
                    h={3}
                    front="#95a69f"
                    top="#b7c0b2"
                  />
                ))}
              </g>
            ) : null}
            {lightbox ? (
              <WallPlane x={x + 1} y={y + 9} z={z - 1}>
                <rect
                  width={w - 2}
                  height={h - 2}
                  fill="none"
                  stroke={lit ? "#fff4d3" : "#8ca59f"}
                  strokeWidth=".8"
                />
              </WallPlane>
            ) : null}
            {installation ? (
              <Box
                x={x + w + 4}
                y={y}
                z={z - h - 7}
                w={5}
                d={5}
                h={7}
                front={lit ? "#9eb584" : "#3f5c60"}
                top="#a9b8a2"
              />
            ) : null}
          </g>
        ) : null}

        {neon ? (
          <g {...part(3)} data-visible={step >= 3 && lit}>
            <WallPlane x={x} y={y + 2} z={z}>
              <Art
                settings={settings}
                w={w}
                h={h}
                id={`${id}-neon-core`}
                ink={color}
                tube
                core
              />
            </WallPlane>
          </g>
        ) : null}
      </g>
      <text
        x="758"
        y="506"
        textAnchor="end"
        fontFamily="inherit"
        fontSize="9"
        letterSpacing=".8"
        fill="#a3b3af"
      >
        {caption}
      </text>
    </g>
  );
}
