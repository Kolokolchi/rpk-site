import type { ReactNode } from "react";
import ArtworkImage from "./ArtworkImage";
import VehicleGeometry from "./VehicleGeometry";
import { iso, isoPoints, IsoBox, IsoLine, IsoPlane } from "./isometric";
import type { PreviewSettings, SceneProps } from "./types";

const graphite = "#28353e";
const steel = "#52636e";
const glass = "#34515d";
const floorZ = 45;

function Part({
  children,
  step,
  layer,
  exploded,
}: {
  children: ReactNode;
  step: number;
  layer: number;
  exploded: boolean;
}) {
  return (
    <g
      className="preview-part"
      data-visible={step >= layer}
      data-layer={layer}
      data-exploded={exploded}
    >
      {children}
    </g>
  );
}

function Words({
  text,
  width,
  y,
  size = 24,
  color = "#eef2ed",
}: {
  text: string;
  width: number;
  y: number;
  size?: number;
  color?: string;
}) {
  const characters = Array.from(text).length;
  const availableWidth = Math.max(0, width - Math.max(8, width * 0.12));
  const fontSize = Math.min(
    size,
    availableWidth / Math.max(3, characters * 0.72),
  );
  // SVG advances depend on the actual Cyrillic glyphs, not just their count.
  // Bound their final advance in the local coordinates of the physical face.
  const textWidth = Math.min(availableWidth, characters * fontSize * 0.66);
  return (
    <text
      x={width / 2}
      y={y}
      textAnchor="middle"
      data-text-surface-width={width}
      fontFamily="Montserrat, Arial, sans-serif"
      fontWeight="700"
      fontSize={fontSize}
      textLength={characters ? textWidth : undefined}
      lengthAdjust="spacingAndGlyphs"
      fill={color}
    >
      {text}
    </text>
  );
}

function Artwork({
  settings,
  width,
  height,
  id,
}: {
  settings: PreviewSettings;
  width: number;
  height: number;
  id: string;
}) {
  return (
    <g>
      <rect width={width} height={height} fill="#233039" />
      {settings.image ? (
        <ArtworkImage
          settings={settings}
          width={width}
          height={height}
          id={id}
        />
      ) : (
        <g>
          <path
            d={`M${width * 0.64} 0H${width}V${height}H${width * 0.19}Z`}
            fill={settings.color}
          />
          <rect
            y={height * 0.3}
            width={width}
            height={height * 0.38}
            fill="#233039"
            opacity=".94"
          />
          <Words
            text={settings.text}
            width={width}
            y={height * 0.56}
            size={Math.min(29, height * 0.32)}
          />
          <path
            d={`M${width * 0.08} ${height * 0.14}h${width * 0.17}M${width * 0.08} ${height * 0.83}h${width * 0.35}`}
            stroke="#a6b6bd"
            strokeWidth={Math.max(1, height * 0.018)}
          />
        </g>
      )}
    </g>
  );
}

function Floor({ road = false }: { road?: boolean }) {
  return (
    <g>
      <IsoBox
        x={-170}
        y={-140}
        z={37}
        w={330}
        d={250}
        h={8}
        front="#25323b"
        side="#1b2831"
        top="#34434b"
        stroke="#52616b"
      />
      {[-110, -45, 20, 85].map((x) => (
        <IsoLine
          key={x}
          from={[x, -135, 45.5]}
          to={[x, 106, 45.5]}
          stroke="#44545d"
          width={0.75}
        />
      ))}
      {[-80, -20, 40].map((y) => (
        <IsoLine
          key={y}
          from={[-165, y, 45.5]}
          to={[155, y, 45.5]}
          stroke="#44545d"
          width={0.75}
        />
      ))}
      {road && (
        <g>
          <IsoBox
            x={-170}
            y={55}
            z={45.5}
            w={330}
            d={55}
            h={1}
            front="#26343d"
            side="#26343d"
            top="#26343d"
            stroke="#4a5c67"
          />
          {[-135, -55, 25, 105].map((x) => (
            <IsoLine
              key={x}
              from={[x, 83, 47]}
              to={[x + 35, 83, 47]}
              stroke="#b8c5c9"
              width={2}
            />
          ))}
        </g>
      )}
    </g>
  );
}

function Tree({
  x,
  y,
  small = false,
}: {
  x: number;
  y: number;
  small?: boolean;
}) {
  const s = small ? 0.7 : 1;
  const z = floorZ;
  const p = (dx: number, dy: number, dz: number) =>
    [x + dx * s, y + dy * s, z + dz * s] as const;
  return (
    <g data-context-object="deciduous-tree">
      <IsoBox
        x={x - 13 * s}
        y={y - 13 * s}
        z={z}
        w={26 * s}
        d={26 * s}
        h={18 * s}
        front="#42554e"
        side="#2d413b"
        top="#647563"
      />
      <IsoLine
        from={p(0, 0, 18)}
        to={p(0, 0, 82)}
        stroke="#b0b7ad"
        width={4 * s}
      />
      <IsoLine
        from={p(0, 0, 48)}
        to={p(-13, -5, 76)}
        stroke="#9ba598"
        width={2 * s}
      />
      <polygon
        points={isoPoints(
          p(-24, -9, 72),
          p(-16, 13, 70),
          p(1, 17, 101),
          p(-9, 0, 115),
        )}
        fill="#3f6555"
      />
      <polygon
        points={isoPoints(
          p(-9, 0, 115),
          p(1, 17, 101),
          p(24, 4, 76),
          p(14, -13, 80),
        )}
        fill="#547963"
      />
      <polygon
        points={isoPoints(
          p(-24, -9, 72),
          p(-9, 0, 115),
          p(14, -13, 80),
          p(0, -20, 72),
        )}
        fill="#688770"
      />
      <polygon
        points={isoPoints(p(-16, 13, 70), p(24, 4, 76), p(1, 17, 101))}
        fill="#365949"
      />
    </g>
  );
}

function Room({ corridor = false }: { corridor?: boolean }) {
  return (
    <g>
      <Floor />
      <IsoBox
        x={-170}
        y={-140}
        z={45}
        w={330}
        d={8}
        h={185}
        front="#3c4c56"
        side="#2d3b44"
        top="#738087"
      />
      <IsoBox
        x={-170}
        y={-132}
        z={45}
        w={8}
        d={242}
        h={185}
        front="#3c4c56"
        side="#2b3b45"
        top="#738087"
      />
      <IsoLine
        from={[-160, -131, 52]}
        to={[158, -131, 52]}
        stroke="#77858b"
        width={2}
      />
      <IsoLine
        from={[-160, -130, 52]}
        to={[-160, 108, 52]}
        stroke="#77858b"
        width={2}
      />
      {corridor && (
        <g>
          <IsoPlane x={95} y={-130} z={202}>
            <rect
              width="53"
              height="157"
              fill="#233843"
              stroke="#83959c"
              strokeWidth="3"
            />
            <path d="M26 5V152M8 85h7" stroke="#a3b7bd" strokeWidth="2" />
          </IsoPlane>
          <IsoLine
            from={[-159, -60, 105]}
            to={[-159, 95, 105]}
            stroke="#9babb0"
            width={3}
          />
        </g>
      )}
    </g>
  );
}

function Storefront({ cafe = false }: { cafe?: boolean }) {
  return (
    <g>
      <Floor />
      <IsoBox
        x={-155}
        y={-135}
        z={45}
        w={310}
        d={43}
        h={198}
        front="#394c56"
        side="#263b46"
        top="#78858a"
      />
      <IsoPlane x={-140} y={-91} z={205}>
        <rect
          width="210"
          height="135"
          fill={glass}
          stroke="#879ba1"
          strokeWidth="5"
        />
        <path d="M8 18H198M12 28H120" stroke="#6d8991" strokeWidth="2" />
      </IsoPlane>
      <IsoPlane x={88} y={-91} z={225}>
        <rect
          width="52"
          height="180"
          fill="#2f4651"
          stroke="#8c9ca1"
          strokeWidth="5"
        />
        <path d="M39 88v30" stroke="#c0cac9" strokeWidth="3" />
      </IsoPlane>
      <IsoBox
        x={-150}
        y={-92}
        z={40}
        w={303}
        d={19}
        h={7}
        front="#526671"
        side="#354a55"
        top="#87959a"
      />
      {cafe && (
        <g>
          <IsoBox
            x={-146}
            y={-94}
            z={214}
            w={226}
            d={57}
            h={7}
            front="#586b75"
            side="#344a56"
            top="#687b83"
          />
          <IsoPlane x={-146} y={-36} z={214}>
            <rect width="226" height="17" fill="#293c47" />
            <Words text="КАФЕ" width={226} y={13} size={12} />
          </IsoPlane>
          {[-127, -94].flatMap((x) =>
            [15, 48].map((y) => (
              <IsoBox
                key={`${x}-${y}`}
                x={x}
                y={y}
                z={45}
                w={5}
                d={5}
                h={52}
                front="#657b84"
              />
            )),
          )}
          <IsoBox
            x={-134}
            y={8}
            z={97}
            w={51}
            d={51}
            h={5}
            front="#75858a"
            side="#546a73"
            top="#9ca9a9"
          />
          <IsoBox
            x={-157}
            y={14}
            z={45}
            w={19}
            d={23}
            h={32}
            front="#5d716c"
            side="#435e58"
            top="#7a8c80"
          />
        </g>
      )}
    </g>
  );
}

function Vehicle() {
  return (
    <g>
      <Floor road />
      <IsoBox
        x={-166}
        y={-135}
        z={45}
        w={310}
        d={12}
        h={165}
        front="#303f4b"
        side="#1d303b"
        top="#627784"
      />
      <IsoPlane x={-120} y={-122} z={193}>
        <rect
          width="220"
          height="145"
          fill="#21343f"
          stroke="#617c89"
          strokeWidth="6"
        />
        <path
          d="M4 17H216M4 32H216M4 47H216"
          stroke="#3d5664"
          strokeWidth="3"
        />
      </IsoPlane>
      <VehicleGeometry />
    </g>
  );
}

export default function ObjectScene({
  slug,
  settings,
  step,
  exploded,
  id,
}: SceneProps) {
  const sx = 0.75 + (settings.width - 120) / 480;
  const sy = 0.8 + (settings.height - 50) / 250;
  const part = (layer: number, children: ReactNode) => (
    <Part step={step} layer={layer} exploded={exploded}>
      {children}
    </Part>
  );
  const art = (width: number, height: number, suffix = "main") => (
    <Artwork
      settings={settings}
      width={width}
      height={height}
      id={`${id}-${suffix}`}
    />
  );
  const { color, lit, text } = settings;

  if (slug === "vehicle-branding") {
    const w = 126 + (settings.width - 120) * 0.2,
      h = 48 + (settings.height - 50) * 0.16,
      x = -44 - w / 2,
      z = 132 + h / 2;
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Vehicle />
        </g>
        {part(
          1,
          <IsoPlane x={x} y={47} z={z}>
            <rect
              width={w}
              height={h}
              fill="#667f89"
              stroke="#a4b5ba"
              strokeDasharray="4 3"
            />
          </IsoPlane>,
        )}
        {part(
          2,
          <IsoPlane x={x} y={47.5} z={z}>
            {art(w, h)}
          </IsoPlane>,
        )}
        {part(
          3,
          <IsoPlane x={x} y={48} z={z}>
            <path
              d={`M4 4H${w - 4}V${h - 4}H4Z`}
              fill="none"
              stroke="#c7d2d4"
              strokeWidth="1"
            />
            <path d={`M8 4h12L8 ${h - 4}H4Z`} fill="#f3f4ef" opacity=".2" />
          </IsoPlane>,
        )}
      </g>
    );
  }

  if (slug === "window-graphics") {
    const w = 160 * sx,
      h = 95 * sy,
      x = -35 - w / 2,
      z = 143 + h / 2;
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Storefront />
          <Tree x={130} y={55} small />
        </g>
        {part(
          1,
          <IsoPlane x={x} y={-90} z={z}>
            <rect width={w} height={h} fill="#a3bbc2" opacity=".22" />
          </IsoPlane>,
        )}
        {part(
          2,
          <IsoPlane x={x} y={-89} z={z}>
            {art(w, h)}
          </IsoPlane>,
        )}
        {part(
          3,
          <IsoPlane x={x} y={-88} z={z}>
            <path d={`M${w - 18} 0H${w}V20Z`} fill="#dce8e7" opacity=".7" />
            <path d={`M4 ${h - 2}H${w - 4}`} stroke={color} strokeWidth="2" />
          </IsoPlane>,
        )}
      </g>
    );
  }

  if (slug === "pylons") {
    const w = 66 * sx,
      h = 214 * sy,
      x = -86 - w / 2;
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Floor road />
          <IsoBox
            x={40}
            y={-130}
            z={45}
            w={110}
            d={83}
            h={104}
            front="#405966"
            side="#2f4654"
            top="#738891"
          />
          <IsoPlane x={55} y={-46} z={128}>
            <rect
              width="74"
              height="59"
              fill={glass}
              stroke="#8298a2"
              strokeWidth="3"
            />
            <path d="M37 0V59" stroke="#8298a2" strokeWidth="3" />
          </IsoPlane>
          <IsoLine
            from={[40, 13, 45]}
            to={[40, 13, 79]}
            stroke="#81959b"
            width={6}
          />
          <IsoLine
            from={[40, 13, 79]}
            to={[136, 13, 79]}
            stroke="#b6c2bf"
            width={5}
          />
          <IsoPlane x={55} y={33} z={46} plane="floor">
            <path
              d="M0 13H61m-13-9 13 9-13 9"
              stroke="#b1c0c2"
              strokeWidth="3"
              fill="none"
            />
          </IsoPlane>
          <Tree x={138} y={45} small />
        </g>
        {part(
          1,
          <g>
            <IsoBox
              x={x - 9}
              y={-26}
              z={45}
              w={w + 18}
              d={44}
              h={9}
              front="#5e727d"
            />
            <IsoBox
              x={x}
              y={-18}
              z={54}
              w={w}
              d={23}
              h={h}
              front={steel}
              side={graphite}
              top="#8b9ba3"
            />
          </g>,
        )}
        {part(
          2,
          <g>
            <IsoPlane x={x + 6} y={6} z={48 + h}>
              {art(w - 12, h * 0.56)}
            </IsoPlane>
            <IsoPlane x={x + 6} y={6} z={48 + h * 0.37}>
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect
                    y={i * h * 0.1}
                    width={w - 12}
                    height={h * 0.075}
                    fill="#bdc9c9"
                  />
                  <path
                    d={`M5 ${i * h * 0.1 + h * 0.037}h${w - 30}`}
                    stroke="#324954"
                    strokeWidth="2"
                  />
                </g>
              ))}
            </IsoPlane>
          </g>,
        )}
        {part(
          3,
          <IsoPlane x={x + 1} y={7} z={53 + h}>
            <path
              d={`M1 0V${h - 1}M${w - 3} 0V${h - 1}`}
              stroke={lit ? color : "#8399a5"}
              strokeWidth="2.5"
            />
          </IsoPlane>,
        )}
      </g>
    );
  }

  if (slug === "billboards") {
    const w = 260 * sx,
      h = 125 * sy,
      x = -w / 2,
      base = 150;
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Floor road />
          <IsoLine
            from={[-165, 38, 72]}
            to={[155, 38, 72]}
            stroke="#8a9ba4"
            width={5}
          />
          {[-135, -55, 25, 105].map((x) => (
            <IsoLine
              key={x}
              from={[x, 38, 46]}
              to={[x, 38, 72]}
              stroke="#637984"
              width={3}
            />
          ))}
          <Tree x={-143} y={-102} small />
          <IsoLine
            from={[140, -85, 45]}
            to={[140, -85, 155]}
            stroke="#7b8d96"
            width={4}
          />
          <IsoLine
            from={[140, -85, 155]}
            to={[115, -85, 155]}
            stroke="#8b9ca4"
            width={4}
          />
        </g>
        {part(
          1,
          <g>
            <IsoBox
              x={-24}
              y={-77}
              z={45}
              w={48}
              d={47}
              h={8}
              front="#5c7685"
              side="#354f60"
              top="#8ba0aa"
            />
            <IsoBox
              x={-16}
              y={-70}
              z={53}
              w={32}
              d={32}
              h={97}
              front="#677b87"
              side="#344c5b"
              top="#a0afb3"
            />
            <IsoBox
              x={-33}
              y={-71}
              z={145}
              w={66}
              d={47}
              h={13}
              front="#667f8e"
              side="#3b586b"
              top="#a3b4bb"
            />
            <IsoBox
              x={x}
              y={-45}
              z={base}
              w={w}
              d={19}
              h={h}
              front={steel}
              side={graphite}
              top="#869aa4"
            />
          </g>,
        )}
        {part(
          2,
          <IsoPlane x={x + 7} y={-25} z={base + h - 7}>
            {art(w - 14, h - 14)}
          </IsoPlane>,
        )}
        {part(
          3,
          <IsoPlane x={x} y={-24} z={base + h}>
            {Array.from({ length: 7 }, (_, i) => {
              const xx = 11 + (i * (w - 22)) / 6;
              return (
                <g key={i}>
                  <path
                    d={`M${xx} 2v8m0 ${h - 20}v8`}
                    stroke="#c1cdd2"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={xx}
                    cy="10"
                    r="2"
                    fill="#283c49"
                    stroke="#bdcbd1"
                  />
                  <circle
                    cx={xx}
                    cy={h - 10}
                    r="2"
                    fill="#283c49"
                    stroke="#bdcbd1"
                  />
                </g>
              );
            })}
          </IsoPlane>,
        )}
      </g>
    );
  }

  if (slug === "city-formats") {
    const w = 76 * sx,
      h = 181 * sy,
      x = 95 - w / 2;
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Floor road />
          <IsoBox
            x={-160}
            y={-112}
            z={45}
            w={205}
            d={6}
            h={170}
            front="#33515e"
            side="#304b58"
            top="#8298a2"
          />
          <IsoBox
            x={-165}
            y={-118}
            z={215}
            w={220}
            d={110}
            h={7}
            front="#72858f"
            side="#415965"
            top="#8b9da4"
          />
          {[-153, 37].map((x) => (
            <IsoBox
              key={x}
              x={x}
              y={-21}
              z={45}
              w={5}
              d={5}
              h={170}
              front="#7c929d"
              side="#526b79"
            />
          ))}
          <IsoBox
            x={-135}
            y={-79}
            z={81}
            w={145}
            d={32}
            h={7}
            front="#8c8475"
            side="#625e55"
            top="#a7a18e"
          />
          {[-125, -2].map((x) => (
            <IsoBox
              key={x}
              x={x}
              y={-69}
              z={45}
              w={6}
              d={10}
              h={36}
              front="#536f7c"
            />
          ))}
          <IsoBox x={-157} y={34} z={45} w={4} d={4} h={116} front="#839ba6" />
          <IsoPlane x={-169} y={39} z={167}>
            <rect
              width="28"
              height="37"
              fill="#385c73"
              stroke="#b4c5cd"
              strokeWidth="2"
            />
            <path
              d="M6 9H22V27H6Zm-1 23h20"
              stroke="#d3dddf"
              fill="none"
              strokeWidth="1.7"
            />
          </IsoPlane>
        </g>
        {part(
          1,
          <g>
            <IsoBox
              x={x - 7}
              y={-66}
              z={45}
              w={w + 14}
              d={30}
              h={7}
              front="#6c838f"
            />
            <IsoBox
              x={x}
              y={-61}
              z={52}
              w={w}
              d={18}
              h={h}
              front={steel}
              side={graphite}
              top="#9babb0"
            />
          </g>,
        )}
        {part(
          2,
          <IsoPlane x={x + 5} y={-42} z={47 + h}>
            {art(w - 10, h - 10)}
          </IsoPlane>,
        )}
        {part(
          3,
          <IsoPlane x={x + 3} y={-41} z={49 + h}>
            <rect
              width={w - 6}
              height={h - 6}
              fill="#aec7d0"
              fillOpacity=".09"
              stroke={lit ? "#e2d5a8" : "#91a5b0"}
              strokeWidth="2"
            />
          </IsoPlane>,
        )}
      </g>
    );
  }

  if (slug === "pavement-signs") {
    const w = 86 * sx,
      h = 105 * sy,
      x = 25 - w / 2,
      bottomY = 94,
      topY = 52,
      topZ = 45 + h;
    const dy = 42 / h;
    const [px, py] = iso(x + 5, topY + 5 * dy, topZ - 5);
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Storefront cafe />
          <Tree x={131} y={61} small />
        </g>
        {part(
          1,
          <g>
            {[x, x + w - 6].map((xx) => (
              <polygon
                key={xx}
                points={isoPoints(
                  [xx, topY, topZ],
                  [xx, 13, 45],
                  [xx + 6, 13, 45],
                  [xx + 6, topY, topZ],
                )}
                fill="#617984"
                stroke="#8e9fa8"
              />
            ))}
            <IsoLine
              from={[x + 3, 13 + 39 * (4 / h), 49]}
              to={[x + w - 3, 13 + 39 * (4 / h), 49]}
              stroke="#8097a3"
              width={3}
            />
            <polygon
              points={isoPoints(
                [x, bottomY, 45],
                [x + w, bottomY, 45],
                [x + w, topY, topZ],
                [x, topY, topZ],
              )}
              fill={steel}
              stroke="#9babb2"
              strokeWidth="2"
            />
            {[x + 3, x + w - 3].map((xx) => (
              <IsoLine
                key={xx}
                from={[xx, bottomY, 45]}
                to={[xx, topY, topZ]}
                stroke="#92a5ae"
                width={3}
              />
            ))}
            {[x + 3, x + w - 3].map((xx) => (
              <IsoLine
                key={xx}
                from={[xx, 13 + 39 * 0.36, 45 + h * 0.36]}
                to={[xx, bottomY - 42 * 0.36, 45 + h * 0.36]}
                stroke="#607b89"
                width={3}
              />
            ))}
          </g>,
        )}
        {part(
          2,
          <g
            data-iso-plane="inclined"
            transform={`matrix(${Math.sqrt(3) / 2} .5 ${(-Math.sqrt(3) / 2) * dy} ${1 + 0.5 * dy} ${px} ${py})`}
          >
            {art(w - 10, h - 10)}
          </g>,
        )}
        {part(
          3,
          <g>
            <IsoLine
              from={[x, topY, topZ]}
              to={[x + w, topY, topZ]}
              stroke={color}
              width={3}
            />
            <IsoLine
              from={[x, bottomY, 45]}
              to={[x + w, bottomY, 45]}
              stroke={color}
              width={3}
            />
          </g>,
        )}
      </g>
    );
  }

  if (slug === "wayfinding") {
    const w = 170 * sx,
      h = 48 * sy,
      x = -w / 2,
      z = 163;
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Room />
          <IsoPlane x={-136} y={-131} z={205}>
            <rect
              width="65"
              height="158"
              fill="#273d49"
              stroke="#92a5ad"
              strokeWidth="4"
            />
            <path d="M32 0V158" stroke="#798f9b" strokeWidth="2" />
          </IsoPlane>
          <Tree x={135} y={55} />
        </g>
        {part(
          1,
          <g>
            <IsoBox
              x={x}
              y={-48}
              z={z}
              w={w}
              d={13}
              h={h}
              front={steel}
              side={graphite}
              top="#94a8b1"
            />
            {[x + 22, x + w - 22].map((xx) => (
              <g key={xx}>
                <IsoBox
                  x={xx - 2.5}
                  y={-132}
                  z={225}
                  w={5}
                  d={92}
                  h={4}
                  front="#788f9c"
                  side="#4c697b"
                  top="#9bafb8"
                />
                <IsoPlane x={xx - 6} y={-130} z={229}>
                  <rect
                    width="12"
                    height="14"
                    fill="#67828f"
                    stroke="#9eb0b8"
                    strokeWidth="1"
                  />
                </IsoPlane>
                <IsoLine
                  from={[xx, -42, z + h]}
                  to={[xx, -42, 225]}
                  stroke="#a9b8bd"
                  width={2}
                />
              </g>
            ))}
          </g>,
        )}
        {part(
          2,
          <IsoPlane x={x + 4} y={-34} z={z + h - 4}>
            {settings.image ? (
              art(w - 8, h - 8)
            ) : (
              <g>
                <rect width={w - 8} height={h - 8} fill={color} />
                <Words
                  text={text}
                  width={w - 8}
                  y={(h - 8) * 0.52}
                  size={21}
                  color={
                    color === "#ffffff" || color === "#ff8a00"
                      ? "#182d3b"
                      : "#fff"
                  }
                />
                <path
                  d={`M12 ${h - 17}H${w - 21}m-8-5 8 5-8 5`}
                  stroke={
                    color === "#ffffff" || color === "#ff8a00"
                      ? "#182d3b"
                      : "#fff"
                  }
                  fill="none"
                  strokeWidth="2"
                />
              </g>
            )}
          </IsoPlane>,
        )}
        {part(
          3,
          <g>
            <IsoPlane x={89} y={-130} z={151}>
              <rect width="46" height="29" fill={color} />
              <path d="M7 10H39M7 17H29" stroke="#233947" strokeWidth="2" />
            </IsoPlane>
            <IsoPlane x={-12} y={25} z={46} plane="floor">
              <path
                d="M0 20H66m-14-12 14 12-14 12"
                stroke={color}
                strokeWidth="5"
                fill="none"
              />
            </IsoPlane>
          </g>,
        )}
      </g>
    );
  }

  if (slug === "interior-branding") {
    const w = 185 * sx,
      h = 63 * sy,
      x = -w / 2,
      z = 200;
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Room />
          <Tree x={135} y={55} />
          <IsoBox
            x={-108}
            y={8}
            z={45}
            w={209}
            d={62}
            h={64}
            front="#566c75"
            side="#314b59"
            top="#98a5a7"
          />
          <IsoBox
            x={-18}
            y={20}
            z={117}
            w={45}
            d={7}
            h={27}
            front="#203744"
            side="#152b38"
            top="#758c98"
          />
          <IsoBox x={-4} y={20} z={109} w={17} d={13} h={8} front="#59717f" />
        </g>
        {part(
          1,
          <IsoBox
            x={x - 6}
            y={-130}
            z={z - h - 6}
            w={w + 12}
            d={5}
            h={h + 12}
            front="#30454f"
            side="#253d49"
            top="#708b96"
          />,
        )}
        {part(
          2,
          <IsoPlane x={x} y={-124} z={z}>
            {settings.image ? (
              art(w, h)
            ) : (
              <g>
                <Words
                  text={text}
                  width={w}
                  y={h * 0.64 + 2}
                  size={h * 0.64}
                  color="#152a37"
                />
                <Words
                  text={text}
                  width={w}
                  y={h * 0.64}
                  size={h * 0.64}
                  color={color}
                />
              </g>
            )}
          </IsoPlane>,
        )}
        {part(
          3,
          <IsoPlane x={x - 3} y={-123} z={z + 3}>
            <path
              d={`M0 ${h + 6}H${w + 6}`}
              stroke={lit ? color : "#6c8694"}
              strokeWidth="3"
            />
            {[4, w + 2].map((xx) => (
              <g key={xx}>
                <circle cx={xx} cy="4" r="1.7" fill="#aabcc4" />
                <circle cx={xx} cy={h + 2} r="1.7" fill="#aabcc4" />
              </g>
            ))}
          </IsoPlane>,
        )}
      </g>
    );
  }

  if (slug === "information-boards") {
    const w = 197 * sx,
      h = 129 * sy,
      x = -34 - w / 2,
      z = 209;
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Room corridor />
          <Tree x={-130} y={81} small />
        </g>
        {part(
          1,
          <IsoBox
            x={x - 6}
            y={-130}
            z={z - h - 6}
            w={w + 12}
            d={5}
            h={h + 12}
            front={steel}
            side={graphite}
            top="#8ca1aa"
          />,
        )}
        {part(
          2,
          <IsoPlane x={x} y={-124} z={z}>
            <rect width={w} height={h} fill="#b8c6c7" />
            <rect width={w} height={h * 0.23} fill={color} />
            <Words
              text={text}
              width={w}
              y={h * 0.16}
              size={21}
              color={
                color === "#ffffff" || color === "#ff8a00"
                  ? "#203745"
                  : "#ffffff"
              }
            />
            {settings.image ? (
              <ArtworkImage
                settings={settings}
                x={7}
                y={h * 0.3}
                width={w * 0.32}
                height={h * 0.61}
                id={`${id}-board-map`}
              />
            ) : (
              <g>
                <rect
                  x="7"
                  y={h * 0.3}
                  width={w * 0.32}
                  height={h * 0.61}
                  fill="#879fa5"
                />
                <path
                  d={`M15 ${h * 0.42}h${w * 0.22}m-${w * 0.22} 10h${w * 0.22}m-${w * 0.22} 10h${w * 0.14}`}
                  stroke="#365562"
                  strokeWidth="2"
                />
              </g>
            )}
          </IsoPlane>,
        )}
        {part(
          3,
          <IsoPlane x={x} y={-123} z={z}>
            {[0.39, 0.69].map((position) => (
              <g key={position}>
                <rect
                  x={w * position}
                  y={h * 0.3}
                  width={w * 0.26}
                  height={h * 0.62}
                  fill="#e3eeeb"
                  fillOpacity=".22"
                  stroke="#73939f"
                  strokeWidth="1.5"
                />
                <rect
                  x={w * position + 4}
                  y={h * 0.3 + 4}
                  width={w * 0.26 - 8}
                  height={h * 0.53}
                  fill="#e8eee7"
                />
                <path
                  d={`M${w * position + 9} ${h * 0.42}h${w * 0.16}m-${w * 0.16} 8h${w * 0.16}m-${w * 0.16} 8h${w * 0.12}`}
                  stroke="#899b9d"
                  strokeWidth="1.5"
                />
                <path
                  d={`M${w * position} ${h * 0.81}h${w * 0.26}`}
                  stroke="#73939f"
                />
              </g>
            ))}
          </IsoPlane>,
        )}
      </g>
    );
  }

  if (slug === "retail-and-pos") {
    const w = 194 * sx,
      d = 81,
      h = 68 * sy,
      x = -w / 2;
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Room />
          <Tree x={135} y={61} small />
          {[95, 145].map((z) => (
            <g key={z}>
              <IsoBox
                x={-135}
                y={-129}
                z={z}
                w={235}
                d={23}
                h={5}
                front="#68808b"
                side="#334d5b"
                top="#82989f"
              />
              {[-120, -78, -36, 6, 48].map((x, i) => (
                <IsoBox
                  key={x}
                  x={x}
                  y={-125}
                  z={z + 5}
                  w={20}
                  d={15}
                  h={24 + (i % 2) * 7}
                  front={i % 2 ? "#8faaa4" : "#627f88"}
                  side="#3d5a67"
                  top="#a2b3ac"
                />
              ))}
            </g>
          ))}
        </g>
        {part(
          1,
          <g>
            <IsoBox
              x={x}
              y={-26}
              z={45}
              w={w}
              d={d}
              h={h}
              front="#5a707a"
              side="#314c5d"
              top="#a0acae"
            />
            {[x + 7, x + w - 11].map((xx) => (
              <IsoBox
                key={xx}
                x={xx}
                y={-24}
                z={45 + h}
                w={5}
                d={5}
                h={105}
                front="#8196a0"
                side="#526c7b"
              />
            ))}
            <IsoBox
              x={x - 7}
              y={-31}
              z={150 + h}
              w={w + 14}
              d={32}
              h={33}
              front={steel}
              side={graphite}
              top="#91a5ae"
            />
          </g>,
        )}
        {part(
          2,
          <g>
            <IsoPlane x={x + 5} y={56} z={40 + h}>
              <rect width={w - 10} height={h - 10} fill={color} />
              <Words
                text={text}
                width={w - 10}
                y={(h - 10) * 0.62}
                size={25}
                color={
                  color === "#ffffff" || color === "#ff8a00"
                    ? "#1b3444"
                    : "#fff"
                }
              />
            </IsoPlane>
            <IsoPlane x={x - 2} y={2} z={178 + h}>
              {art(w + 4, 23)}
            </IsoPlane>
          </g>,
        )}
        {part(
          3,
          <g>
            <IsoLine
              from={[x + 4, 56, 50]}
              to={[x + w - 4, 56, 50]}
              stroke={lit ? "#e1d5ac" : "#647f8d"}
              width={3}
            />
            <IsoLine
              from={[x, 55, h + 44]}
              to={[x + w, 55, h + 44]}
              stroke="#b9c9ce"
              width={1.5}
            />
          </g>,
        )}
      </g>
    );
  }

  if (slug === "brand-zones") {
    const w = 236 * sx,
      h = 182 * sy,
      x = -w / 2;
    return (
      <g data-projection="isometric" data-scene={slug}>
        <g data-scene-context={slug}>
          <Floor />
          <Tree x={-143} y={64} small />
          <IsoBox
            x={129}
            y={67}
            z={142}
            w={18}
            d={12}
            h={13}
            front="#2c4250"
            side="#1b313e"
            top="#758c97"
          />
          <IsoLine
            from={[138, 73, 142]}
            to={[138, 73, 103]}
            stroke="#8096a2"
            width={3}
          />
          {[
            [122, 60],
            [155, 70],
            [139, 93],
          ].map(([x, y]) => (
            <IsoLine
              key={x}
              from={[138, 73, 103]}
              to={[x, y, 45]}
              stroke="#8096a2"
              width={2}
            />
          ))}
        </g>
        {part(
          1,
          <g>
            <IsoBox
              x={x}
              y={-113}
              z={45}
              w={w}
              d={13}
              h={h}
              front={steel}
              side={graphite}
              top="#899fa9"
            />
            <IsoBox
              x={-88}
              y={-16}
              z={45}
              w={58}
              d={53}
              h={44}
              front="#758b94"
              side="#405d6b"
              top="#a3b3b6"
            />
            <IsoBox
              x={21}
              y={9}
              z={45}
              w={50}
              d={48}
              h={72}
              front="#5d7b88"
              side="#3b586b"
              top="#8aa3ae"
            />
          </g>,
        )}
        {part(
          2,
          <g>
            <IsoPlane x={x + 5} y={-99} z={40 + h}>
              {art(w - 10, h - 10)}
            </IsoPlane>
            <IsoPlane x={25} y={58} z={113}>
              <rect width="42" height="64" fill={color} />
            </IsoPlane>
          </g>,
        )}
        {part(
          3,
          <IsoLine
            from={[x + 2, -98, h + 43]}
            to={[x + w - 2, -98, h + 43]}
            stroke={lit ? color : "#7a94a2"}
            width={4}
          />,
        )}
      </g>
    );
  }

  const w = 218 * sx,
    h = 171 * sy,
    x = -w / 2;
  return (
    <g data-projection="isometric" data-scene={slug}>
      <g data-scene-context={slug}>
        <Floor />
        <Tree x={139} y={74} small />
        <IsoBox
          x={-169}
          y={-135}
          z={45}
          w={48}
          d={64}
          h={113}
          front="#314956"
          side="#213945"
          top="#728a96"
        />
        <IsoLine
          from={[-167, -48, 46]}
          to={[-126, -48, 46]}
          stroke="#617a88"
          width={2}
        />
        <IsoPlane x={-169} y={-70} z={146}>
          <rect width="45" height="34" fill="#526d7c" />
          <path d="M7 13H37M7 22H28" stroke="#90a7b3" strokeWidth="2" />
        </IsoPlane>
      </g>
      {part(
        1,
        <g>
          <IsoBox
            x={x}
            y={-118}
            z={45}
            w={w}
            d={8}
            h={h}
            front={steel}
            side={graphite}
            top="#8ea4ad"
          />
          <IsoBox
            x={x}
            y={-110}
            z={45}
            w={7}
            d={100}
            h={h}
            front="#5a7481"
            side="#344f5f"
            top="#899fa8"
          />
          <IsoBox
            x={-35}
            y={9}
            z={45}
            w={101}
            d={59}
            h={61}
            front="#617d89"
            side="#344f60"
            top="#95a8af"
          />
        </g>,
      )}
      {part(
        2,
        <g>
          <IsoPlane x={x + 6} y={-109} z={39 + h}>
            {art(w - 12, h - 12)}
          </IsoPlane>
          <IsoPlane x={-31} y={69} z={102}>
            <rect width="93" height="53" fill={color} />
            <Words
              text={text}
              width={93}
              y={33}
              size={19}
              color={
                color === "#ffffff" || color === "#ff8a00" ? "#193444" : "#fff"
              }
            />
          </IsoPlane>
          <IsoPlane x={x + 8} y={-102} z={h + 30} plane="side">
            <path d="M4 12H75M4 24H55" stroke={color} strokeWidth="8" />
          </IsoPlane>
        </g>,
      )}
      {part(
        3,
        <g>
          {[x + 35, x + w - 35].map((xx) => (
            <g key={xx}>
              <IsoLine
                from={[xx, -113, 45 + h]}
                to={[xx, -83, 45 + h + 12]}
                stroke="#8fa3ad"
                width={3}
              />
              <IsoBox
                x={xx - 10}
                y={-83}
                z={49 + h}
                w={20}
                d={15}
                h={9}
                front={lit ? "#ded4b2" : "#607d8e"}
                side="#3f5969"
                top="#8aa0ad"
              />
            </g>
          ))}
        </g>,
      )}
    </g>
  );
}
