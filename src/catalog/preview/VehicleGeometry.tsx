import { isoPoints, IsoBox, IsoLine, IsoPlane } from "./isometric";

const wheelXs = [-92, 108];
const wheelZ = 69;
const wheelRadius = 24;

function Wheel({ x, y }: { x: number; y: number }) {
  const back = y - 7.5;
  const front = y + 7.5;
  return (
    <g data-vehicle-part="wheel" data-ground-contact="45">
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const b = ((i + 1) / 24) * Math.PI * 2;
        return (
          <polygon
            key={i}
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
            fill={i % 2 ? "#202c33" : "#25343c"}
          />
        );
      })}
      <IsoPlane x={x} y={front} z={wheelZ}>
        <circle
          r={wheelRadius}
          fill="#1c2930"
          stroke="#52656f"
          strokeWidth="1.4"
        />
        <circle r="14" fill="#bac3c5" stroke="#71848c" strokeWidth="2" />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = i * Math.PI * 0.4;
          return (
            <circle
              key={i}
              cx={Math.cos(a) * 9}
              cy={Math.sin(a) * 9}
              r="2.3"
              fill="#536a76"
            />
          );
        })}
        <circle r="5" fill="#718793" stroke="#e0e5e4" strokeWidth="1" />
      </IsoPlane>
    </g>
  );
}

/** A continuous panel-van shell. All facets and the inclined glass use world coordinates. */
export default function VehicleGeometry() {
  return (
    <g data-vehicle-part="panel-van">
      {wheelXs.map((x) => (
        <Wheel key={x} x={x} y={-40} />
      ))}

      <polygon
        points={isoPoints(
          [-142, -43, 68],
          [-142, -43, 155],
          [-127, -43, 178],
          [45, -43, 178],
          [75, -43, 168],
          [112, -43, 130],
          [140, -43, 117],
          [157, -43, 95],
          [157, -43, 73],
        )}
        fill="#617987"
        stroke="#8499a3"
        strokeWidth=".8"
      />

      <polygon
        points={isoPoints(
          [-142, -43, 155],
          [-127, -43, 178],
          [-127, 46, 178],
          [-142, 46, 155],
        )}
        fill="#a8b6bd"
        stroke="#c2cbce"
        strokeWidth=".7"
      />
      <polygon
        points={isoPoints(
          [-127, -43, 178],
          [45, -43, 178],
          [45, 46, 178],
          [-127, 46, 178],
        )}
        fill="#b5c0c5"
        stroke="#ced6d7"
        strokeWidth=".8"
      />
      <polygon
        points={isoPoints(
          [45, -43, 178],
          [75, -43, 168],
          [75, 46, 168],
          [45, 46, 178],
        )}
        fill="#aabac1"
        stroke="#c0cbce"
        strokeWidth=".7"
      />
      <polygon
        points={isoPoints(
          [75, -43, 168],
          [112, -43, 130],
          [112, 46, 130],
          [75, 46, 168],
        )}
        fill="#849ca8"
        stroke="#b7c6cc"
        strokeWidth=".8"
      />
      <polygon
        points={isoPoints(
          [112, -43, 130],
          [140, -43, 117],
          [140, 46, 117],
          [112, 46, 130],
        )}
        fill="#a7b8bf"
        stroke="#c2cdd0"
        strokeWidth=".8"
      />
      <polygon
        points={isoPoints(
          [140, -43, 117],
          [157, -43, 95],
          [157, 46, 95],
          [140, 46, 117],
        )}
        fill="#819ba8"
        stroke="#aabdc5"
        strokeWidth=".8"
      />
      <polygon
        points={isoPoints(
          [157, -43, 95],
          [157, 46, 95],
          [157, 46, 73],
          [157, -43, 73],
        )}
        fill="#5a788a"
        stroke="#95aab5"
        strokeWidth=".8"
      />

      <g data-vehicle-part="inclined-windscreen">
        <polygon
          points={isoPoints(
            [81, -36, 162],
            [81, 38, 162],
            [108, 38, 134],
            [108, -36, 134],
          )}
          fill="#244b5d"
          stroke="#3e6171"
          strokeWidth="2"
        />
        <IsoLine
          from={[84, -29, 159]}
          to={[84, 30, 159]}
          stroke="#91b1bd"
          width={1.6}
        />
        <IsoLine
          from={[106, -28, 136]}
          to={[98, -6, 144]}
          stroke="#1a3443"
          width={2}
        />
        <IsoLine
          from={[106, 11, 136]}
          to={[98, 31, 144]}
          stroke="#1a3443"
          width={2}
        />
      </g>

      <IsoPlane x={-145} y={46} z={185}>
        <path
          data-vehicle-part="body-with-wheel-arches"
          d="M3 117V30Q3 12 18 7H190Q205 7 220 17L257 55 285 68Q300 75 302 90V112L284 117A31 31 0 0 0 222 117H84A31 31 0 0 0 22 117Z"
          fill="#8fa2ac"
          stroke="#b8c6cc"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M14 28V83M190 15V85M92 90H179"
          stroke="#718a98"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M210 25 218 24 248 55H210Z"
          fill="#2d5264"
          stroke="#526f7d"
          strokeWidth="2"
        />
        <path d="m215 30 18 16" stroke="#8faeba" strokeWidth="1.4" />
        <path
          d="M207 26V106H218M261 59V78"
          stroke="#5e7887"
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M217 67H231"
          stroke="#d5dfe0"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M219 71H232"
          stroke="#617b8a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M5 117H19M87 117H219M287 117H300"
          stroke="#526e7e"
          strokeWidth="4"
        />
      </IsoPlane>

      {wheelXs.map((x) => (
        <Wheel key={x} x={x} y={45.5} />
      ))}

      <g data-vehicle-part="front-lights-and-grille">
        {[-37, 23].map((y) => (
          <polygon
            key={y}
            points={isoPoints(
              [147, y, 109],
              [157, y, 97],
              [157, y + 17, 97],
              [147, y + 17, 109],
            )}
            fill="#d8e3df"
            stroke="#718b98"
            strokeWidth="1"
          />
        ))}
        <IsoPlane x={158} y={-25} z={93} plane="side">
          <rect
            width="54"
            height="13"
            rx="1"
            fill="#203743"
            stroke="#7993a0"
            strokeWidth="1"
          />
          <path d="M4 4H50M4 9H50" stroke="#617f90" strokeWidth="1.1" />
          <ellipse cx="27" cy="6.5" rx="3" ry="2.2" fill="#bdccd1" />
        </IsoPlane>
        <IsoBox
          x={149}
          y={-46}
          z={65}
          w={12}
          d={95}
          h={11}
          front="#425b6b"
          side="#304a5b"
          top="#7a919e"
          stroke="#8ba1ac"
        />
        <IsoBox
          x={-145}
          y={-46}
          z={65}
          w={9}
          d={95}
          h={9}
          front="#496270"
          side="#314c5d"
          top="#7d919b"
          stroke="#8599a4"
        />
      </g>

      <g data-vehicle-part="door-mirror">
        <IsoLine
          from={[110, 46, 139]}
          to={[110, 58, 139]}
          stroke="#4c6879"
          width={3}
        />
        <IsoBox
          x={105}
          y={55}
          z={131}
          w={10}
          d={9}
          h={18}
          front="#3e5a6a"
          side="#2c4759"
          top="#8199a5"
        />
        <IsoPlane x={106} y={65} z={147}>
          <rect
            width="8"
            height="14"
            rx="1"
            fill="#668b9e"
            stroke="#a0b5be"
            strokeWidth=".7"
          />
        </IsoPlane>
      </g>
    </g>
  );
}
