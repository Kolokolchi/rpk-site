import { iso, isoPoints, IsoBox, IsoLine, IsoPlane } from "./isometric";

const wheelXs = [-96, 108];
const wheelZ = 63;
const wheelRadius = 18;
const sideProfile =
  "M4 102V21Q4 9 16 8H199Q215 8 225 16L258 51 287 64Q301 69 302 79L303 96Q303 102 294 102H275A22 22 0 0 0 231 102H71A22 22 0 0 0 27 102Z";

const p = (x: number, y: number, z: number) => iso(x, y, z).join(" ");

function Wheel({ x, y }: { x: number; y: number }) {
  const back = y - 4.5;
  const front = y + 4.5;
  return (
    <g data-vehicle-part="wheel" data-ground-contact="45">
      {Array.from({ length: 20 }, (_, index) => {
        const a = (index / 20) * Math.PI * 2;
        const b = ((index + 1) / 20) * Math.PI * 2;
        return (
          <polygon
            key={index}
            points={isoPoints(
              [
                x + Math.cos(a) * wheelRadius,
                back,
                wheelZ + Math.sin(a) * wheelRadius,
              ],
              [
                x + Math.cos(b) * wheelRadius,
                back,
                wheelZ + Math.sin(b) * wheelRadius,
              ],
              [
                x + Math.cos(b) * wheelRadius,
                front,
                wheelZ + Math.sin(b) * wheelRadius,
              ],
              [
                x + Math.cos(a) * wheelRadius,
                front,
                wheelZ + Math.sin(a) * wheelRadius,
              ],
            )}
            fill="#343b3d"
          />
        );
      })}
      <IsoPlane x={x} y={front} z={wheelZ}>
        <circle
          r={wheelRadius}
          fill="#303638"
          stroke="#59605f"
          strokeWidth=".8"
        />
        <circle r="12" fill="#b9bfbc" stroke="#dfe2de" strokeWidth="1" />
        <circle r="8.5" fill="#a7aeab" />
        <circle r="3" fill="#7c8582" />
      </IsoPlane>
    </g>
  );
}

/** Rounded passenger minibus: a neutral white body and one uninterrupted dark side window band. */
export default function VehicleGeometry({
  id = "minibus",
}: { id?: string } = {}) {
  const roofFill = `url(#${id}-minibus-roof)`;
  const bodyFill = `url(#${id}-minibus-body)`;
  return (
    <g data-vehicle-part="minibus">
      <defs>
        <linearGradient id={`${id}-minibus-roof`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f2f2ee" />
          <stop offset="1" stopColor="#dedfdb" />
        </linearGradient>
        <linearGradient id={`${id}-minibus-body`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#e9eae6" />
          <stop offset="1" stopColor="#cfd3cf" />
        </linearGradient>
      </defs>

      {wheelXs.map((x) => (
        <Wheel key={x} x={x} y={-38} />
      ))}
      <IsoPlane x={-145} y={-43} z={165}>
        <path d={sideProfile} fill="#bac1be" />
      </IsoPlane>

      <path
        d={`M${p(-141, -43, 144)}Q${p(-141, -43, 156)} ${p(-129, -43, 157)}L${p(54, -43, 157)}Q${p(70, -43, 157)} ${p(80, -43, 149)}L${p(80, 44, 149)}Q${p(70, 44, 157)} ${p(54, 44, 157)}L${p(-129, 44, 157)}Q${p(-141, 44, 156)} ${p(-141, 44, 144)}Z`}
        fill={roofFill}
      />
      {[-28, -17, -6, 5, 16, 27].map((y) => (
        <IsoLine
          key={y}
          from={[-114, y, 157.4]}
          to={[43, y, 157.4]}
          stroke="#d6d8d3"
          width={0.65}
        />
      ))}

      <path
        d={`M${p(80, -43, 149)}L${p(113, -43, 114)}L${p(113, 44, 114)}L${p(80, 44, 149)}Z`}
        fill="#e3e5e0"
      />
      <path
        d={`M${p(113, -43, 114)}Q${p(144, -43, 105)} ${p(157, -38, 86)}L${p(157, 38, 86)}Q${p(144, 44, 105)} ${p(113, 44, 114)}Z`}
        fill="#e9eae5"
      />
      <path
        d={`M${p(157, -38, 86)}Q${p(163, 0, 87)} ${p(157, 38, 86)}L${p(158, 38, 67)}Q${p(163, 0, 62)} ${p(158, -38, 67)}Z`}
        fill="#d6dbd5"
      />
      <path
        d={`M${p(157, 38, 86)}L${p(142, 44, 101)}Q${p(156, 44, 96)} ${p(157, 44, 86)}L${p(158, 44, 69)}Q${p(158, 44, 63)} ${p(149, 44, 63)}L${p(158, 38, 67)}Z`}
        fill="#d8ddd7"
      />

      <g data-vehicle-part="inclined-windscreen">
        <path
          d={`M${p(85, -34, 145)}L${p(85, 33, 145)}Q${p(86, 37, 144)} ${p(89, 37, 141)}L${p(109, 37, 118)}Q${p(111, 35, 116)} ${p(111, 32, 116)}L${p(111, -33, 116)}Q${p(111, -36, 117)} ${p(109, -36, 120)}L${p(89, -36, 142)}Q${p(86, -36, 145)} ${p(85, -34, 145)}Z`}
          fill="#232726"
        />
        <IsoLine
          from={[106, -26, 120]}
          to={[101, -8, 126]}
          stroke="#3d4541"
          width={1}
        />
        <IsoLine
          from={[106, 10, 120]}
          to={[101, 28, 126]}
          stroke="#3d4541"
          width={1}
        />
      </g>

      <IsoPlane x={-145} y={44} z={165}>
        <path
          data-vehicle-part="body-with-wheel-arches"
          d={sideProfile}
          fill={bodyFill}
          stroke="#bdc5bf"
          strokeWidth=".65"
          strokeLinejoin="round"
        />
        <path
          data-vehicle-part="panoramic-side-windows"
          d="M14 20Q14 17 18 17H177Q181 17 181 21V41Q181 45 177 45H18Q14 45 14 41Z"
          fill="#262a28"
        />
        <path
          d="M207 23 216 25 246 55Q248 58 244 58H210Q206 58 206 55Z"
          fill="#252a27"
        />
        <path
          d="M201 22V91Q201 96 207 96H220M258 59V78"
          stroke="#b0bab2"
          strokeWidth=".8"
          fill="none"
        />
        <path
          d="M200 17V10M193 61V91"
          stroke="#c2cac3"
          strokeWidth=".7"
          fill="none"
        />
        <path
          d="M213 67H222"
          stroke="#818d84"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M8 101H24M76 101H227M280 101H298"
          stroke="#a6b1a8"
          strokeWidth="2"
        />
        <rect x="5" y="78" width="3" height="7" rx="1" fill="#c46d53" />
        <rect x="251" y="75" width="3" height="4" rx=".7" fill="#d79754" />
      </IsoPlane>

      {wheelXs.map((x) => (
        <Wheel key={x} x={x} y={44.5} />
      ))}

      <g data-vehicle-part="front-lights-and-grille">
        <IsoPlane x={159} y={-19} z={87} plane="side">
          <rect width="39" height="7" rx="1.8" fill="#343d36" />
        </IsoPlane>
        {[-36, 22].map((y, index) => (
          <IsoPlane key={y} x={158} y={y} z={88} plane="side">
            <rect width="15" height="8" rx="1.4" fill="#f2f2df" />
            <rect
              x={index ? 11 : 0}
              width="4"
              height="8"
              rx=".8"
              fill="#dda05a"
            />
          </IsoPlane>
        ))}
        <path
          d={`M${p(158, -39, 70)}Q${p(165, 0, 69)} ${p(158, 39, 70)}L${p(158, 39, 64)}Q${p(165, 0, 63)} ${p(158, -39, 64)}Z`}
          fill="#cbd1c9"
        />
      </g>

      <g data-vehicle-part="door-mirror">
        <IsoLine
          from={[110, 44, 116]}
          to={[110, 51, 116]}
          stroke="#637267"
          width={1.6}
        />
        <IsoBox
          x={107}
          y={49}
          z={110}
          w={6}
          d={5}
          h={9}
          front="#d2d9d0"
          side="#aab7ad"
          top="#eef0e8"
          stroke="#a6b4aa"
          strokeWidth={0.45}
        />
        <IsoPlane x={108} y={54.3} z={117.5}>
          <rect width="4" height="6" rx=".5" fill="#56685c" />
        </IsoPlane>
      </g>
    </g>
  );
}
