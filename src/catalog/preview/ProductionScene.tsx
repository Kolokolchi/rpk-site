import type { ReactNode } from "react";
import type { PreviewSettings, SceneProps } from "./types";
import ArtworkImage from "./ArtworkImage";
import { iso, ISO_COS, IsoPlane } from "./isometric";

const ink = "#171b1f";
const steel = "#3f484f";
const light = "#7a858c";
const edge = "#66737c";

function p(x: number, y: number, z = 0) {
  return iso(x, y, z).join(",");
}

function Box({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  color = steel,
  top = light,
}: {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  color?: string;
  top?: string;
}) {
  return (
    <g stroke="#7e8b91" strokeWidth="0.8" strokeLinejoin="round">
      <polygon
        points={[
          p(x, y + d, z),
          p(x + w, y + d, z),
          p(x + w, y + d, z + h),
          p(x, y + d, z + h),
        ].join(" ")}
        fill={color}
      />
      <polygon
        points={[
          p(x + w, y, z),
          p(x + w, y + d, z),
          p(x + w, y + d, z + h),
          p(x + w, y, z + h),
        ].join(" ")}
        fill={ink}
      />
      <polygon
        points={[
          p(x, y, z + h),
          p(x + w, y, z + h),
          p(x + w, y + d, z + h),
          p(x, y + d, z + h),
        ].join(" ")}
        fill={top}
      />
    </g>
  );
}

function Part({
  children,
  at,
  layer = at,
  step,
  exploded,
}: {
  children: ReactNode;
  at: number;
  layer?: number;
  step: number;
  exploded: boolean;
}) {
  return (
    <g
      className="preview-part"
      data-visible={step >= at}
      data-exploded={exploded}
      data-layer={layer}
    >
      {children}
    </g>
  );
}

function Plane({
  x,
  y,
  z,
  children,
}: {
  x: number;
  y: number;
  z: number;
  children: ReactNode;
}) {
  return (
    <IsoPlane x={x} y={y} z={z} plane="floor">
      {children}
    </IsoPlane>
  );
}

function Artwork({
  settings,
  w,
  h,
  id,
  overlayText = false,
}: {
  settings: PreviewSettings;
  w: number;
  h: number;
  id: string;
  overlayText?: boolean;
}) {
  const text = !settings.image || overlayText ? settings.text.trim() : "";
  const size = Math.min(34, h * 0.24);
  return (
    <g>
      <defs>
        <clipPath id={`${id}-art`}>
          <rect width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-art)`}>
        <rect width={w} height={h} fill={settings.color} />
        {settings.image ? (
          <ArtworkImage
            settings={settings}
            width={w}
            height={h}
            id={`${id}-production`}
          />
        ) : (
          <g>
            <path
              d={`M${w * 0.65} 0H${w}V${h}H${w * 0.45}L${w * 0.74} ${h * 0.35}Z`}
              fill="#ffffff"
              opacity=".18"
            />
            <path
              d={`M${w * 0.08} ${h * 0.17}h${w * 0.21}`}
              stroke="#fff"
              strokeWidth="3"
            />
          </g>
        )}
        {text && (
          <rect
            x={w * 0.06}
            y={h * 0.4}
            width={w * 0.88}
            height={h * 0.36}
            rx="1"
            fill={ink}
            opacity={settings.image ? 0.82 : 0.92}
          />
        )}
        {text && (
          <text
            x={w / 2}
            y={h * 0.65}
            textAnchor="middle"
            fill="#fff"
            fontWeight="700"
            fontSize={size}
            textLength={Math.min(w * 0.79, text.length * size * 0.64)}
            lengthAdjust="spacingAndGlyphs"
          >
            {text}
          </text>
        )}
      </g>
    </g>
  );
}

function MaterialRoll({
  x,
  y,
  height = 92,
  color,
}: {
  x: number;
  y: number;
  height?: number;
  color: string;
}) {
  return (
    <g transform={`translate(${p(x, y)})`}>
      <path
        d={`M-10 0V${-height}H10V0C10 5-10 5-10 0Z`}
        fill={color}
        stroke="#87949b"
        strokeWidth=".8"
      />
      <path d={`M-5-2V${-height + 5}`} stroke="#d3d7d3" opacity=".25" />
      <ellipse
        cy={-height}
        rx="10"
        ry={10 / Math.sqrt(3)}
        fill="#b8b8a8"
        stroke="#6d7775"
      />
      <ellipse cy={-height} rx="3.5" ry={3.5 / Math.sqrt(3)} fill="#242e32" />
      <ellipse
        cy="1"
        rx="11"
        ry={11 / Math.sqrt(3)}
        fill="#1e292e"
        opacity=".5"
      />
    </g>
  );
}

function StockRack({ metal = false }: { metal?: boolean }) {
  return (
    <g>
      <Box
        x={-286}
        y={-125}
        w={70}
        d={65}
        h={12}
        color="#29353d"
        top="#4b5b65"
      />
      {metal ? (
        <g>
          {[-280, -256, -232].map((x, index) => (
            <g key={x}>
              <Box
                x={x}
                y={-119}
                z={12}
                w={12}
                d={12}
                h={112 + index * 17}
                color="#465863"
                top="#a5b6be"
              />
              <path
                d={`M${p(x + 4, -120, 15)}L${p(x + 4, -120, 120 + index * 17)}`}
                stroke="#98aeb9"
                strokeWidth="1.3"
              />
            </g>
          ))}
          <path
            d={`M${p(-290, -50, 42)}L${p(-208, -50, 42)}`}
            stroke="#82949d"
            strokeWidth="4"
          />
        </g>
      ) : (
        [0, 1, 2].map((index) => (
          <path
            key={index}
            d={`M${p(-280 + index * 11, -121, 14)}L${p(-236 + index * 11, -121, 14)}L${p(-239 + index * 11, -124, 133 + index * 7)}L${p(-283 + index * 11, -124, 133 + index * 7)}Z`}
            fill={["#766c53", "#4e626c", "#8b8d81"][index]}
            stroke="#9aacae"
            strokeWidth="1.3"
          />
        ))
      )}
    </g>
  );
}

function Workshop({ slug }: { slug: string }) {
  const color = "#ff8a00";
  return (
    <g data-scene-context={slug}>
      <Box
        x={-325}
        y={-155}
        z={-6}
        w={650}
        d={
          slug === "vinyl-graphics" || slug === "stencils-and-marking"
            ? 330
            : 280
        }
        h={6}
        color="#1d252b"
        top="#1d252b"
      />
      <Box
        x={325}
        y={-155}
        z={-6}
        w={55}
        d={165}
        h={6}
        color="#1d252b"
        top="#1d252b"
      />
      <Box
        x={-325}
        y={-155}
        w={8}
        d={255}
        h={190}
        color="#253039"
        top="#63727a"
      />
      <IsoPlane x={-316} y={-142} z={178} plane="side">
        <rect
          width="205"
          height="68"
          fill="#354854"
          stroke="#637a88"
          strokeWidth="2"
        />
        <path d="M68 0V68M137 0V68M0 34H205" stroke="#637a88" strokeWidth="3" />
      </IsoPlane>
      {slug === "banner-printing" && (
        <g>
          <g transform="translate(69.282032 0)">
            <Box
              x={230}
              y={-95}
              w={75}
              d={78}
              h={12}
              color="#29363e"
              top="#5d6b70"
            />
            <MaterialRoll x={245} y={-80} height={115} color="#c3c0ad" />
            <MaterialRoll x={273} y={-80} height={96} color="#747e77" />
            <MaterialRoll x={253} y={-46} height={82} color={color} />
          </g>
          <Box
            x={-288}
            y={-115}
            w={65}
            d={50}
            h={40}
            color="#394b55"
            top="#657780"
          />
          <path
            d={`M${p(-285, -106, 64)}L${p(-227, -106, 64)}`}
            stroke="#b9b6a1"
            strokeWidth="19"
            strokeLinecap="round"
          />
          <path
            d={`M${p(-285, -106, 64)}L${p(-227, -106, 64)}`}
            stroke="#e3dfc7"
            strokeWidth="1.5"
          />
        </g>
      )}
      {slug === "uv-printing" && (
        <g>
          <g transform="translate(69.282032 0)">
            <Box
              x={233}
              y={-86}
              w={66}
              d={89}
              h={28}
              color="#34434b"
              top="#5a6a72"
            />
            {[0, 1, 2, 3, 4].map((index) => (
              <Box
                key={index}
                x={230 + index * 2}
                y={-84}
                z={29 + index * 5}
                w={64}
                d={84}
                h={3}
                color="#47565e"
                top={index === 4 ? "#c0c5b9" : "#85949b"}
              />
            ))}
          </g>
          <StockRack />
          <g transform="translate(69.282032 0)">
            <Plane x={240} y={-77} z={58}>
              {["#c8d0c6", color, "#354955"].map((sample, index) => (
                <rect
                  key={sample + index}
                  x={index * 17}
                  y="8"
                  width="14"
                  height="29"
                  fill={sample}
                  stroke="#91a3a7"
                />
              ))}
            </Plane>
          </g>
        </g>
      )}
      {slug === "vinyl-graphics" && (
        <g>
          <MaterialRoll x={-272} y={-112} height={108} color={color} />
          <MaterialRoll x={-243} y={-115} height={89} color="#b5b6a8" />
          <MaterialRoll x={-261} y={-80} height={73} color="#486674" />
          <g transform="translate(69.282032 0)">
            <Box
              x={230}
              y={-69}
              w={65}
              d={84}
              h={58}
              color="#38464e"
              top="#65757b"
            />
            <Plane x={235} y={-63} z={60}>
              <rect width="52" height="68" fill="#26383f" stroke="#95a7ad" />
              <path
                d="M9 12V43l5 6m15-33v34"
                stroke="#b7c7cc"
                strokeWidth="3"
                fill="none"
              />
              <path d="M8 12h7M25 15h9" stroke={color} strokeWidth="5" />
              <path d="M13 57h31v7H13Z" fill="#c5a365" />
            </Plane>
          </g>
        </g>
      )}
      {slug === "design-and-engineering" && (
        <g>
          <IsoPlane x={-315} y={-126} z={102} plane="side">
            <rect width="175" height="78" fill="#263b45" stroke="#728b98" />
            <path
              d="M12 12H74V42H12ZM89 12H163V42H89Z"
              fill="none"
              stroke="#9eb2bb"
              strokeWidth="1.5"
            />
            <path d="M12 55H161M12 66H104" stroke={color} strokeWidth="2" />
          </IsoPlane>
          <g transform="translate(69.282032 0)">
            <Box
              x={232}
              y={-79}
              w={67}
              d={73}
              h={62}
              color="#35464f"
              top="#647780"
            />
            <Plane x={239} y={-72} z={65}>
              {[0, 1, 2, 3].map((index) => (
                <rect
                  key={index}
                  x={index * 11}
                  y={index * 5}
                  width="10"
                  height="42"
                  fill={["#263944", color, "#849998", "#c6c2aa"][index]}
                  stroke="#a8b5b5"
                  strokeWidth="1"
                />
              ))}
            </Plane>
          </g>
          <Box
            x={-282}
            y={-90}
            w={53}
            d={45}
            h={22}
            color="#4c5e66"
            top="#879591"
          />
          <path
            d={`M${p(-272, -86, 28)}L${p(-234, -86, 28)}`}
            stroke="#b9b7a3"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>
      )}
      {slug === "cnc-and-laser" && (
        <g>
          <StockRack />
          <g transform="translate(69.282032 0)">
            <Box
              x={233}
              y={-78}
              w={68}
              d={90}
              h={48}
              color="#34464d"
              top="#627780"
            />
            <Plane x={237} y={-74} z={51}>
              <path
                d="M3 3H49V30H36V13H15V30H3Z"
                fill={color}
                stroke="#b9c5c5"
              />
              <path
                d="M5 44H49V69H5ZM14 50V63H40V50Z"
                fill="#a2aa9a"
                fillRule="evenodd"
                stroke="#d5d8c7"
              />
            </Plane>
          </g>
        </g>
      )}
      {slug === "metal-fabrication" && (
        <g>
          <StockRack metal />
          <g transform="translate(69.282032 0)">
            <MaterialRoll x={266} y={-88} height={127} color="#37505d" />
            <Box
              x={262}
              y={-92}
              z={127}
              w={8}
              d={8}
              h={17}
              color="#9cadad"
              top={color}
            />
            <path
              d={`M${p(266, -88, 136)}C${p(310, -88, 125)} ${p(318, -18, 42)} ${p(280, 15, 10)}`}
              fill="none"
              stroke="#7b918d"
              strokeWidth="3"
            />
            <Box
              x={226}
              y={-38}
              w={72}
              d={46}
              h={13}
              color="#263b45"
              top="#536d78"
            />
            <path
              d={`M${p(236, -31, 18)}L${p(282, -31, 18)}M${p(236, -15, 18)}L${p(282, -15, 18)}`}
              stroke="#b3c0c0"
              strokeWidth="7"
            />
          </g>
        </g>
      )}
      {slug === "stencils-and-marking" && (
        <g>
          <Box
            x={-283}
            y={-112}
            w={65}
            d={64}
            h={33}
            color="#33454e"
            top="#62757a"
          />
          {[0, 1, 2].map((index) => (
            <Plane key={index} x={-280 + index * 3} y={-108} z={36 + index * 5}>
              <path
                d="M0 0H55V52H0ZM10 11V38H19V29H34V38H44V11Z"
                fill={index === 2 ? "#85928b" : "#50646d"}
                fillRule="evenodd"
                stroke="#b4c1bd"
                strokeWidth="1"
              />
            </Plane>
          ))}
          <g transform="translate(69.282032 0)">
            <Box
              x={239}
              y={-82}
              w={60}
              d={74}
              h={42}
              color="#354851"
              top="#647982"
            />
            <MaterialRoll x={248} y={-68} height={73} color={color} />
            <Plane x={261} y={-55} z={44}>
              <path d="M0 0H31V31H0Z" fill="#b6b7a1" stroke="#c5d0c7" />
              <path d="M6 5h20v19H6Z" fill="#6b8588" />
            </Plane>
          </g>
          <IsoPlane x={-315} y={-117} z={101} plane="side">
            <rect width="145" height="72" fill="#32474c" stroke="#748a90" />
            <path
              d="M22 20H115V50H22ZM35 26V44H45V39H89V44H100V26Z"
              fill={color}
              fillRule="evenodd"
              opacity=".65"
            />
          </IsoPlane>
        </g>
      )}
    </g>
  );
}

function Table({ w = 380, d = 180 }: { w?: number; d?: number }) {
  return (
    <g>
      {[-w / 2 + 12, w / 2 - 24].flatMap((x) =>
        [-d / 2 + 12, d / 2 - 24].map((y) => (
          <Box
            key={`${x}-${y}`}
            x={x}
            y={y}
            w={12}
            d={12}
            h={108}
            color={steel}
            top={edge}
          />
        )),
      )}
      <Box
        x={-w / 2}
        y={-d / 2}
        z={108}
        w={w}
        d={d}
        h={15}
        color={steel}
        top="#4a5961"
      />
    </g>
  );
}

function Printer(props: SceneProps) {
  const { slug, settings, step, exploded, id } = props;
  const uv = slug === "uv-printing";
  const w = 245 + Math.min(130, Math.max(-100, (settings.width - 240) * 0.33));
  const d = 132 + Math.min(45, Math.max(-60, (settings.height - 100) * 0.28));
  const printPass = step < 2 ? 0 : step === 2 ? 0.52 : 1;
  const printHead = step < 2 ? -w / 2 - 8 : step === 2 ? w * 0.02 : w / 2 + 8;
  return (
    <g data-scene={slug}>
      <Workshop slug={props.slug} />
      <Table w={455} d={220} />
      {!uv && (
        <g>
          <Box
            x={-224}
            y={70}
            z={69}
            w={448}
            d={33}
            h={36}
            color="#44535d"
            top="#77817e"
          />
          <path
            d={`M${p(-215, 84, 85)}L${p(215, 84, 85)}`}
            stroke="#a4aaa0"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d={`M${p(-215, 84, 85)}L${p(215, 84, 85)}`}
            stroke="#657b81"
            strokeWidth="1"
          />
        </g>
      )}
      <Part at={1} {...{ step, exploded }}>
        <Plane x={-w / 2} y={-d / 2} z={127}>
          <rect
            width={w}
            height={d}
            fill={uv ? "#7b878a" : "#c8c5b5"}
            stroke="#8b989f"
            strokeWidth="1.5"
          />
          <text
            x={w / 2}
            y={d / 2}
            textAnchor="middle"
            fontSize="15"
            fill="#44565f"
          >
            {uv ? "ЖЁСТКИЙ МАТЕРИАЛ" : "БАННЕРНОЕ ПОЛОТНО"}
          </text>
        </Plane>
      </Part>
      {uv && (
        <Part at={1} layer={2} {...{ step, exploded }}>
          <Plane x={-w / 2} y={-d / 2} z={129}>
            <rect
              x="3"
              y="3"
              width={w - 6}
              height={d - 6}
              fill="#fffdf5"
              stroke="#c2d2d5"
              strokeWidth="1"
            />
            {exploded && (
              <text x="8" y="21" fontSize="12" fill="#3e505a">
                БЕЛЫЙ СЛОЙ · УСЛОВНО
              </text>
            )}
          </Plane>
        </Part>
      )}
      <Part at={1} layer={uv ? 3 : 2} {...{ step, exploded }}>
        <Plane x={-w / 2} y={-d / 2} z={131}>
          <defs>
            <clipPath id={`${id}-print-pass`} clipPathUnits="userSpaceOnUse">
              <rect
                className="preview-print-mask"
                data-pass={step}
                width={w}
                height={d}
                transform={`scale(${printPass} 1)`}
              />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}-print-pass)`}>
            <Artwork settings={settings} w={w} h={d} id={id} overlayText />
          </g>
        </Plane>
      </Part>
      <Part at={3} {...{ step, exploded }}>
        <Plane x={-w / 2} y={-d / 2} z={133}>
          <path
            d={`M6 6H${w - 6}V${d - 6}H6Z`}
            fill="none"
            stroke={uv ? "#e9e4ff" : "#fff"}
            strokeWidth="2"
            opacity=".75"
          />
          {!uv &&
            [12, w / 2, w - 12].flatMap((x) =>
              [9, d - 9].map((y) => (
                <circle
                  key={`${x}-${y}`}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#e0e2de"
                  stroke="#4b585d"
                  strokeWidth="1"
                />
              )),
            )}
        </Plane>
      </Part>
      <Box
        x={-225}
        y={-95}
        z={123}
        w={20}
        d={190}
        h={89}
        color={ink}
        top={steel}
      />
      <Box
        x={205}
        y={-95}
        z={123}
        w={20}
        d={190}
        h={89}
        color={ink}
        top={steel}
      />
      <Box
        x={-225}
        y={-32}
        z={193}
        w={450}
        d={45}
        h={26}
        color="#52636d"
        top="#82949b"
      />
      <path
        d={`M${p(-202, -34, 202)}L${p(202, -34, 202)}`}
        stroke={ink}
        strokeWidth="7"
      />
      <g
        className="preview-printhead"
        transform={`translate(${printHead * ISO_COS} ${printHead * 0.5})`}
      >
        <Box
          x={-19}
          y={-39}
          z={159}
          w={38}
          d={59}
          h={39}
          color={ink}
          top={settings.color}
        />
        {uv && step >= 2 && (
          <path
            d={`M${p(-20, -36, 157)}L${p(21, -36, 157)}L${p(21, 22, 157)}L${p(-20, 22, 157)}Z`}
            fill="#8d79f4"
            opacity=".42"
          />
        )}
        <circle
          cx={iso(-9, 21, 180)[0]}
          cy={iso(-9, 21, 180)[1]}
          r="3"
          fill={step >= 2 ? "#90d1a2" : settings.color}
        />
      </g>
      <Box
        x={154}
        y={-94}
        z={219}
        w={54}
        d={30}
        h={8}
        color={ink}
        top="#263b45"
      />
      <Plane x={159} y={-89} z={228}>
        <rect width="44" height="21" fill="#67979c" />
        <path d="M4 7h28M4 13h20" stroke="#b3d0d0" strokeWidth="2" />
      </Plane>
      <g fontSize="11" fill="#bac4ca" fontWeight="600">
        <text x="70" y="600">
          {uv
            ? "Прямая УФ-печать на панели"
            : "Широкоформатная печать → обработка края"}
        </text>
        {exploded && (
          <g>
            <text x="75" y="624">
              {uv
                ? "Материал / белый слой / цвет / УФ-закрепление"
                : "Полотно / печать / край и люверсы"}
            </text>
          </g>
        )}
      </g>
    </g>
  );
}

function CutGlyphs({
  text,
  color,
  width,
  height,
  separate = false,
}: {
  text: string;
  color: string;
  width: number;
  height: number;
  separate?: boolean;
}) {
  const glyphs = Array.from(text.trim());
  if (!glyphs.length) return null;
  const advanceRatio = separate ? 1.06 : 0.78;
  const size = Math.min(
    separate ? 24 : 34,
    (width - 12) / (glyphs.length * advanceRatio),
  );
  const advance = size * advanceRatio;
  const left = (width - advance * glyphs.length) / 2;
  return (
    <g data-vinyl-glyphs={separate ? "separate" : "contour"}>
      {glyphs.map((glyph, index) => (
        <text
          key={`${glyph}-${index}`}
          x={left + (index + 0.5) * advance}
          y={height * 0.68 + (separate ? (index % 2) * 3 : 0)}
          fontSize={size}
          fontWeight="800"
          textAnchor="middle"
          fill={color}
          stroke={separate ? "#25353c" : "#eff0df"}
          strokeWidth={separate ? 0.5 : 0.75}
          paintOrder="stroke fill"
          transform={
            separate
              ? `rotate(${index % 2 ? 4 : -4} ${left + (index + 0.5) * advance} ${height * 0.68 + (index % 2) * 3})`
              : undefined
          }
        >
          {glyph}
        </text>
      ))}
    </g>
  );
}

function Vinyl(props: SceneProps) {
  const { settings, step, exploded, id } = props;
  const w = 280 + Math.min(80, Math.max(-90, (settings.width - 240) * 0.25));
  const d = 125 + Math.min(40, Math.max(-45, (settings.height - 100) * 0.25));
  const text = settings.text.trim();
  const negativeId = `${id}-vinyl-negative`;
  return (
    <g data-scene="vinyl-graphics">
      <Workshop slug={props.slug} />
      <Table w={470} d={360} />
      <Box
        x={-215}
        y={-100}
        z={123}
        w={430}
        d={66}
        h={71}
        color={ink}
        top="#667a85"
      />
      <path
        d={`M${p(-190, -32, 153)}L${p(190, -32, 153)}`}
        stroke="#82939b"
        strokeWidth="7"
      />
      <g
        className="preview-printhead"
        transform={`translate(${(step - 1) * 65 * ISO_COS} ${(step - 1) * 65 * 0.5})`}
      >
        <Box
          x={-85}
          y={-43}
          z={130}
          w={27}
          d={27}
          h={30}
          color={steel}
          top="#a98353"
        />
        <path
          d={`M${p(-71, -17, 132)}L${p(-71, -17, 125)}`}
          stroke="#c3d0d3"
          strokeWidth="2"
        />
      </g>
      <Part at={1} {...{ step, exploded }}>
        <Plane x={-w / 2} y={-20} z={124}>
          <rect
            width={w}
            height={d}
            fill="#d7d5c1"
            stroke="#8faaa9"
            strokeWidth="1"
          />
          <path
            d={`M7 7H${w - 7}V${d - 7}H7Z`}
            fill="none"
            stroke="#a7b6a7"
            strokeDasharray="3 5"
          />
        </Plane>
      </Part>
      <Part at={2} {...{ step, exploded }}>
        <Plane x={-w / 2} y={-20} z={125}>
          {settings.image ? (
            <g>
              <g transform={`translate(${w * 0.06} ${d * 0.08})`}>
                <Artwork settings={settings} w={w * 0.86} h={d * 0.8} id={id} />
              </g>
              <path
                d={`M${w * 0.055} ${d * 0.07}H${w * 0.925}V${d * 0.89}H${w * 0.055}Z`}
                fill="none"
                stroke="#354c55"
                strokeWidth="1.1"
                strokeDasharray="3 3"
              />
            </g>
          ) : (
            <g>
              {step === 2 && (
                <rect
                  x="9"
                  y="9"
                  width={w - 18}
                  height={d - 18}
                  fill={settings.color}
                />
              )}
              <CutGlyphs
                text={text}
                color={settings.color}
                width={w}
                height={d}
              />
            </g>
          )}
        </Plane>
      </Part>
      <Part at={3} {...{ step, exploded }}>
        <Plane x={170} y={20} z={124}>
          <defs>
            <mask id={negativeId}>
              <rect width="45" height="76" fill="#fff" />
              <path d="M9 10H35V24H9ZM10 36H34V61H10Z" fill="#000" />
              <path d="M19 36H25V61H19Z" fill="#fff" />
            </mask>
          </defs>
          <g data-vinyl-negative="true">
            <rect
              width="45"
              height="76"
              fill={settings.color}
              mask={`url(#${negativeId})`}
            />
            <path d="M0 0H45V12L33 5H0Z" fill="#9ba599" />
            <path d="M33 5 45 12V0Z" fill="#c1c8b5" />
          </g>
        </Plane>
        <Plane x={-170} y={132} z={124}>
          <g data-vinyl-cut-parts="true">
            <rect
              width="330"
              height="38"
              fill="#d7d6c3"
              stroke="#8d9d96"
              strokeWidth=".7"
            />
            {settings.image ? (
              [0, 1, 2].map((index) => (
                <g key={index} transform={`translate(${10 + index * 108} 4)`}>
                  <ArtworkImage
                    settings={settings}
                    width={92}
                    height={29}
                    id={`${id}-cut-label-${index}`}
                  />
                  <rect
                    width="92"
                    height="29"
                    rx="3"
                    fill="none"
                    stroke="#466069"
                    strokeWidth=".8"
                  />
                </g>
              ))
            ) : (
              <CutGlyphs
                text={text}
                color={settings.color}
                width={330}
                height={38}
                separate
              />
            )}
          </g>
        </Plane>
      </Part>
      <Box
        x={170}
        y={-55}
        z={124}
        w={24}
        d={32}
        h={5}
        color="#c89e59"
        top="#e3c38b"
      />
      <text x="74" y="630" fill="#bac4ca" fontSize="11" fontWeight="600">
        Контурная резка → выборка плёнки → отдельные детали
      </text>
      {exploded && (
        <text x="74" y="650" fill="#bac4ca" fontSize="11">
          Подложка / прорезанная плёнка / снятый негатив и детали
        </text>
      )}
    </g>
  );
}

function Design(props: SceneProps) {
  const { settings, step, exploded, id } = props;
  const w = 180 + Math.min(55, Math.max(-55, (settings.width - 240) * 0.2));
  const h = 95 + Math.min(40, Math.max(-35, (settings.height - 100) * 0.18));
  return (
    <g data-scene="design-and-engineering">
      <Workshop slug={props.slug} />
      <Table w={430} d={230} />
      <Box x={20} y={-84} z={123} w={65} d={42} h={8} color={ink} top={steel} />
      <Box
        x={46}
        y={-80}
        z={131}
        w={12}
        d={12}
        h={45}
        color={steel}
        top={light}
      />
      <IsoPlane x={-80} y={-75} z={320} plane="front">
        <rect
          width="265"
          height="155"
          rx="4"
          fill={ink}
          stroke="#78909a"
          strokeWidth="2"
        />
        <rect x="8" y="8" width="249" height="135" fill="#263138" />
        <path d="M8 30h249M38 30v113" stroke="#687e8b" />
        <rect x="16" y="15" width="6" height="6" fill={settings.color} />
        <rect x="28" y="15" width="26" height="6" fill="#7a8a94" />
        <Part at={1} {...{ step, exploded }}>
          <rect
            x={145 - w / 2}
            y={87 - h / 2}
            width={w}
            height={h}
            fill="#fff"
            stroke="#8d9fa8"
          />
        </Part>
        <Part at={2} {...{ step, exploded }}>
          <g transform={`translate(${145 - w / 2} ${87 - h / 2})`}>
            <Artwork settings={settings} w={w} h={h} id={id} />
          </g>
        </Part>
        <Part at={3} {...{ step, exploded }}>
          <g fill="#fff" stroke="#257e9d" strokeWidth="1.5">
            {[
              [145 - w / 2, 87 - h / 2],
              [145 + w / 2, 87 - h / 2],
              [145 - w / 2, 87 + h / 2],
              [145 + w / 2, 87 + h / 2],
            ].map(([x, y]) => (
              <rect
                key={`${x}-${y}`}
                x={x - 3}
                y={y - 3}
                width="6"
                height="6"
              />
            ))}
          </g>
        </Part>
      </IsoPlane>
      <Plane x={-180} y={12} z={124}>
        <rect width="175" height="115" fill="#26363e" stroke="#607680" />
        <rect
          x="22"
          y="23"
          width="122"
          height="63"
          fill="none"
          stroke="#8ca7b6"
          strokeWidth="1.5"
        />
        <path
          d="M22 14h122M14 23v63M18 10v8M148 10v8M10 19h8M10 90h8"
          stroke="#8ca7b6"
        />
        {!settings.image && (
          <text
            x="83"
            y="64"
            textAnchor="middle"
            fontSize="16"
            fill="#c5d2d8"
            textLength={Math.min(111, settings.text.trim().length * 9)}
            lengthAdjust="spacingAndGlyphs"
          >
            {settings.text.trim()}
          </text>
        )}
      </Plane>
      <Plane x={65} y={37} z={124}>
        <rect width="108" height="39" rx="3" fill="#45545b" stroke="#738892" />
        {[0, 1, 2].map((r) => (
          <path
            key={r}
            d={`M7 ${8 + r * 10}h94`}
            stroke="#a3b4b8"
            strokeWidth="5"
            strokeDasharray="5 3"
          />
        ))}
      </Plane>
      {["#f0e9db", settings.color, "#171b1f"].map((color, i) => (
        <Box
          key={color + i}
          x={-75 + i * 32}
          y={101}
          z={124}
          w={25}
          d={28}
          h={4}
          color={color}
          top={color}
        />
      ))}
      <text x="74" y="600" fill="#bac4ca" fontSize="11" fontWeight="600">
        Макет → размеры → материалы → подготовка к производству
      </text>
    </g>
  );
}

function Cnc(props: SceneProps) {
  const { settings, step, exploded } = props;
  const w = 310 + Math.min(65, Math.max(-90, (settings.width - 240) * 0.25));
  const d = 155 + Math.min(35, Math.max(-60, (settings.height - 100) * 0.25));
  const text = settings.text.trim();
  const shift = (step - 1) * 55;
  return (
    <g data-scene="cnc-and-laser">
      <Workshop slug={props.slug} />
      <Table w={445} d={245} />
      <Plane x={-205} y={-100} z={125}>
        <rect width="410" height="205" fill="#253a45" />
        {Array.from({ length: 11 }, (_, index) => (
          <path
            key={index}
            d={`M0 ${index * 20}h410`}
            stroke="#78919b"
            strokeWidth="2"
          />
        ))}
      </Plane>
      <Part at={1} {...{ step, exploded }}>
        <Plane x={-w / 2} y={-d / 2} z={129}>
          <rect
            width={w}
            height={d}
            fill="#a99a7b"
            stroke="#7c6b51"
            strokeWidth="2"
          />
        </Plane>
      </Part>
      <Part at={2} {...{ step, exploded }}>
        <Plane x={-w / 2} y={-d / 2} z={131}>
          <text
            x={w / 2}
            y={d * 0.67}
            textAnchor="middle"
            fill="#26353b"
            stroke="#d4ba8d"
            strokeWidth="1.2"
            fontSize="61"
            fontWeight="700"
            textLength={Math.min(w * 0.8, text.length * 38)}
            lengthAdjust="spacingAndGlyphs"
          >
            {text}
          </text>
        </Plane>
      </Part>
      <Part at={3} {...{ step, exploded }}>
        <Plane x={-w / 2} y={-d / 2} z={132}>
          <path
            d={`M9 9H${w - 9}V${d - 9}H9Z`}
            fill="none"
            stroke="#68563b"
            strokeWidth="1.5"
          />
          {[
            [17, 17],
            [w - 17, 17],
            [17, d - 17],
            [w - 17, d - 17],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#66543a" />
          ))}
        </Plane>
        <Plane x={-w / 2} y={d / 2 + 10} z={126}>
          <g data-cnc-cut-parts="true">
            <text
              x={w * 0.38}
              y="20"
              textAnchor="middle"
              fill="#c7ae80"
              stroke="#69583d"
              strokeWidth=".8"
              fontSize="22"
              fontWeight="700"
              letterSpacing="2"
              textLength={Math.min(w * 0.7, text.length * 16)}
              lengthAdjust="spacingAndGlyphs"
            >
              {text}
            </text>
          </g>
          {Array.from({ length: 10 }, (_, index) => (
            <path
              key={index}
              d={`M${w * 0.77 + (index % 3) * 9} ${(index % 4) * 6}l5 2-3 3Z`}
              fill={index % 2 ? "#d2b88a" : "#8c7751"}
            />
          ))}
        </Plane>
      </Part>
      <Box
        x={-222}
        y={-100}
        z={123}
        w={18}
        d={230}
        h={18}
        color={steel}
        top={edge}
      />
      <Box
        x={204}
        y={-100}
        z={123}
        w={18}
        d={230}
        h={18}
        color={steel}
        top={edge}
      />
      <Box
        x={-220}
        y={-22}
        z={140}
        w={18}
        d={34}
        h={110}
        color={ink}
        top={light}
      />
      <Box
        x={202}
        y={-22}
        z={140}
        w={18}
        d={34}
        h={110}
        color={ink}
        top={light}
      />
      <Box
        x={-220}
        y={-20}
        z={223}
        w={440}
        d={30}
        h={27}
        color="#4a606b"
        top="#758b95"
      />
      <path
        d={`M${p(-207, 12, 242)}L${p(207, 12, 242)}M${p(-207, 12, 230)}L${p(207, 12, 230)}`}
        stroke="#b5c4c8"
        strokeWidth="6"
      />
      <path
        d={`M${p(-205, 14, 235)}L${p(205, 14, 235)}`}
        stroke="#273d48"
        strokeWidth="3"
        strokeDasharray="3 3"
      />
      <g
        className="preview-printhead"
        transform={`translate(${shift * ISO_COS} ${shift * 0.5})`}
      >
        <path
          d={`M${p(-23, -3, 223)}C${p(-85, -3, 328)} ${p(-140, -35, 322)} ${p(-110, -15, 250)}`}
          fill="none"
          stroke="#788e97"
          strokeWidth="10"
          strokeDasharray="3 2"
        />
        <Box
          x={-48}
          y={-24}
          z={208}
          w={51}
          d={42}
          h={27}
          color="#3a515e"
          top="#81959f"
        />
        <g transform={`translate(${p(-23, -3, 155)})`} data-cnc-spindle="true">
          <path
            d="M-15 0V-67H15V0C15 9-15 9-15 0Z"
            fill="#8d9fa6"
            stroke="#d0d9d9"
            strokeWidth="1"
          />
          <path d="M-10-63V0M8-63V0" stroke="#3c525f" strokeWidth="4" />
          <ellipse
            cy="-67"
            rx="15"
            ry={15 / Math.sqrt(3)}
            fill="#bac7c9"
            stroke="#596f7a"
          />
          <ellipse
            rx="15"
            ry={15 / Math.sqrt(3)}
            fill="#536d7b"
            stroke="#b2c5cb"
          />
          <path
            d="M-9 3H9L5 13H-5Z"
            fill="#263c47"
            stroke="#93a9b1"
            strokeWidth=".8"
          />
          <path d="M-10 2H10" stroke={settings.color} strokeWidth="2" />
        </g>
        <path
          data-cnc-tool-contact="true"
          d={`M${p(-23, -3, 142)}L${p(-23, -3, 131)}`}
          stroke="#cfdbdd"
          strokeWidth="2.5"
        />
      </g>
      <text x="74" y="600" fill="#bac4ca" fontSize="11" fontWeight="600">
        Шпиндель и фреза → сквозной контур → отдельные детали
      </text>
    </g>
  );
}

function Metal(props: SceneProps) {
  const { settings, step, exploded } = props;
  const w = 290 + Math.min(110, Math.max(-95, (settings.width - 240) * 0.35));
  const h = 170 + Math.min(70, Math.max(-65, (settings.height - 100) * 0.3));
  return (
    <g data-scene="metal-fabrication">
      <Workshop slug={props.slug} />
      <g opacity=".6">
        <path
          d={`M${p(-w / 2 - 35, -20)}L${p(w / 2 + 35, -20)}L${p(w / 2 + 35, 95)}L${p(-w / 2 - 35, 95)}Z`}
          fill="#29363e"
        />
      </g>
      <Part at={1} {...{ step, exploded }}>
        {[-w / 2, w / 2].map((x) => (
          <g key={x}>
            <Box
              x={x - 26}
              y={-14}
              w={52}
              d={45}
              h={6}
              color="#405560"
              top="#7b909a"
            />
            <Box
              x={x - 6}
              y={1}
              z={6}
              w={12}
              d={14}
              h={h}
              color={steel}
              top={light}
            />
          </g>
        ))}
      </Part>
      <Part at={2} {...{ step, exploded }}>
        <Box
          x={-w / 2}
          y={1}
          z={h - 7}
          w={w}
          d={14}
          h={14}
          color={steel}
          top={light}
        />
        <Box
          x={-w / 2}
          y={1}
          z={43}
          w={w}
          d={14}
          h={12}
          color={steel}
          top={light}
        />
        <path
          d={`M${p(-w / 2, 5, 48)}L${p(w / 2, 5, h)}M${p(w / 2, 5, 48)}L${p(-w / 2, 5, h)}`}
          stroke="#6c8592"
          strokeWidth="7"
        />
        <path
          d={`M${p(-w / 2, 5, 48)}L${p(w / 2, 5, h)}M${p(w / 2, 5, 48)}L${p(-w / 2, 5, h)}`}
          stroke="#a4b8c2"
          strokeWidth="1"
        />
        {[-w / 2, w / 2].map((x) => (
          <g key={x}>
            <Box
              x={x - 14}
              y={83}
              w={28}
              d={24}
              h={4}
              color="#405560"
              top="#7b909a"
            />
            <path
              d={`M${p(x, 9, 8)}L${p(x, 95, 4)}L${p(x, 9, h * 0.66)}`}
              fill="none"
              stroke={steel}
              strokeWidth="9"
              strokeLinejoin="round"
            />
          </g>
        ))}
      </Part>
      <Part at={3} {...{ step, exploded }}>
        {[-1, 1].flatMap((side) =>
          [48, h].map((z) => {
            const x = (side * w) / 2;
            const inward = -side;
            const down = z === h ? -1 : 1;
            return (
              <g key={`${side}-${z}`}>
                <path
                  d={`M${p(x, 16, z)}L${p(x + inward * 32, 16, z)}L${p(x, 16, z + down * 32)}Z`}
                  fill={settings.color}
                  stroke="#a3b1b6"
                  strokeWidth="1"
                />
                {[8, 20].map((offset) => (
                  <circle
                    key={offset}
                    transform={`translate(${p(x + inward * offset, 17, z + down * 6)})`}
                    r="2.4"
                    fill="#d3dadd"
                    stroke="#313d45"
                  />
                ))}
              </g>
            );
          }),
        )}
        {[-w / 2, w / 2].flatMap((x) =>
          [-16, 16].flatMap((dx) =>
            [-5, 20].map((y) => (
              <g key={`${x}-${dx}-${y}`}>
                <path
                  d={`M${p(x + dx, y, 6)}L${p(x + dx, y, 13)}`}
                  stroke="#d3dadd"
                  strokeWidth="2.5"
                />
                <circle
                  transform={`translate(${p(x + dx, y, 13)})`}
                  r="2.7"
                  fill="#9caeb7"
                  stroke="#354954"
                />
              </g>
            )),
          ),
        )}
        <path
          d={`M${p(-w / 2, 17, 43)}L${p(w / 2, 17, 43)}`}
          stroke={settings.color}
          strokeWidth="2"
        />
      </Part>
      <Box
        x={-255}
        y={65}
        w={50}
        d={62}
        h={65}
        color="#344852"
        top={settings.color}
      />
      <path
        d={`M${p(-220, 98, 49)}C${p(-200, 60, 35)} ${p(-145, 60, 20)} ${p(-110, 15, 20)}`}
        fill="none"
        stroke="#273f4c"
        strokeWidth="4"
      />
      <Box
        x={-116}
        y={10}
        z={12}
        w={25}
        d={8}
        h={8}
        color="#475e69"
        top="#8da4aa"
      />
      <text x="74" y="600" fill="#bac4ca" fontSize="11" fontWeight="600">
        Опоры → рама и раскосы → узлы и анкеры
      </text>
    </g>
  );
}

function Stencil(props: SceneProps) {
  const { settings, step, exploded, id } = props;
  const w = 280 + Math.min(90, Math.max(-95, (settings.width - 240) * 0.3));
  const d = 150 + Math.min(45, Math.max(-60, (settings.height - 100) * 0.3));
  const text = settings.text.trim();
  const glyphCount = Math.max(1, Array.from(text).length);
  const templateSize = Math.min(39, d * 0.3, (w * 0.82) / (glyphCount * 0.72));
  const markingSize = Math.min(32, d * 0.27, (w * 0.82) / (glyphCount * 0.72));
  const length = Math.min(w * 0.82, text.length * templateSize * 0.68);
  const markingLength = Math.min(w * 0.82, text.length * markingSize * 0.68);
  return (
    <g data-scene="stencils-and-marking">
      <Workshop slug={props.slug} />
      <Box
        x={-210}
        y={-100}
        w={420}
        d={270}
        h={28}
        color="#39494b"
        top="#5e6a5f"
      />
      <Part at={1} {...{ step, exploded }}>
        <Plane x={-w / 2} y={-d / 2} z={30}>
          <defs>
            <clipPath id={`${id}-template-clip`}>
              <rect width={w} height={d} />
            </clipPath>
          </defs>
          <g
            data-marking-surface="template"
            clipPath={`url(#${id}-template-clip)`}
          >
            <rect
              width={w}
              height={d}
              rx="2"
              fill="#354643"
              stroke="#8a9a9b"
              strokeWidth="1.5"
            />
            <text
              x={w / 2}
              y={d * 0.66}
              fill="#8c9c8d"
              fontSize={templateSize}
              fontWeight="700"
              textAnchor="middle"
              textLength={length}
              lengthAdjust="spacingAndGlyphs"
            >
              {text}
            </text>
            <path
              d={`M${w * 0.27} ${d * 0.34}v${d * 0.36}M${w * 0.48} ${d * 0.34}v${d * 0.36}M${w * 0.71} ${d * 0.34}v${d * 0.36}`}
              stroke="#354643"
              strokeWidth="3"
            />
            {[10, w - 10].flatMap((x) =>
              [10, d - 10].map((y) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#aebfbc" />
              )),
            )}
          </g>
        </Plane>
      </Part>
      <Part at={2} {...{ step, exploded }}>
        <Plane x={-w / 2} y={-d / 2} z={32}>
          <g data-marking-surface="cut" clipPath={`url(#${id}-template-clip)`}>
            <text
              x={w / 2}
              y={d * 0.66}
              fill={settings.color}
              fontSize={templateSize}
              fontWeight="700"
              textAnchor="middle"
              textLength={length}
              lengthAdjust="spacingAndGlyphs"
            >
              {text}
            </text>
            <path
              d={`M${w * 0.27} ${d * 0.34}v${d * 0.36}M${w * 0.48} ${d * 0.34}v${d * 0.36}M${w * 0.71} ${d * 0.34}v${d * 0.36}`}
              stroke="#354643"
              strokeWidth="3"
            />
          </g>
        </Plane>
      </Part>
      <Part at={3} {...{ step, exploded }}>
        <Plane x={-w / 2} y={d / 2 + 25} z={29}>
          <defs>
            <clipPath id={`${id}-marking-clip`}>
              <rect width={w} height={50} />
            </clipPath>
          </defs>
          <g
            data-marking-surface="result"
            clipPath={`url(#${id}-marking-clip)`}
          >
            <text
              x={w / 2}
              y="37"
              fill={settings.color}
              fontSize={markingSize}
              fontWeight="700"
              textAnchor="middle"
              textLength={markingLength}
              lengthAdjust="spacingAndGlyphs"
            >
              {text}
            </text>
            <path
              d={`M${w * 0.27} 8v32M${w * 0.48} 8v32M${w * 0.71} 8v32`}
              stroke="#5e6a5f"
              strokeWidth="3"
            />
          </g>
        </Plane>
      </Part>
      <Box
        x={170}
        y={-85}
        z={28}
        w={31}
        d={34}
        h={57}
        color="#5e747e"
        top={settings.color}
      />
      <Box
        x={177}
        y={-77}
        z={85}
        w={16}
        d={16}
        h={13}
        color={ink}
        top="#a7bbb9"
      />
      <path
        d={`M${p(190, 20, 31)}L${p(237, 20, 31)}L${p(237, 32, 31)}`}
        fill="none"
        stroke={ink}
        strokeWidth="5"
      />
      <path
        d={`M${p(175, 20, 39)}L${p(207, 20, 39)}`}
        stroke={settings.color}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <text x="74" y="600" fill="#bac4ca" fontSize="11" fontWeight="600">
        Шаблон с перемычками → нанесение → повторяемая маркировка
      </text>
    </g>
  );
}

export default function ProductionScene(props: SceneProps) {
  let scene: ReactNode;
  switch (props.slug) {
    case "banner-printing":
    case "uv-printing":
      scene = <Printer {...props} />;
      break;
    case "vinyl-graphics":
      scene = <Vinyl {...props} />;
      break;
    case "design-and-engineering":
      scene = <Design {...props} />;
      break;
    case "cnc-and-laser":
      scene = <Cnc {...props} />;
      break;
    case "metal-fabrication":
      scene = <Metal {...props} />;
      break;
    case "stencils-and-marking":
      scene = <Stencil {...props} />;
      break;
    default:
      return null;
  }
  return (
    <g
      data-projection="isometric"
      transform="translate(120.32 31.84) scale(.6992)"
    >
      {scene}
    </g>
  );
}
