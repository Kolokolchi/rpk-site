import {
  Box,
  CutawayRoom,
  Grass,
  Ground,
  Line3,
  WallPlane,
  Window3,
  type Point3,
} from "./FacadePrimitives";
import { iso } from "./isometric";

function CornerShop() {
  return (
    <g>
      <Ground />
      <Box
        x={-105}
        y={-85}
        w={210}
        d={160}
        h={180}
        front="#455055"
        side="#2e4048"
        top="#59696c"
      />
      <Box
        x={-110}
        y={-90}
        z={180}
        w={220}
        d={170}
        h={8}
        front="#7c8987"
        side="#566c72"
        top="#7a8582"
      />
      <WallPlane x={-104} y={76} z={180}>
        <path d="M0 48H208M0 100H208M0 172H208" stroke="#71817f" />
      </WallPlane>
      <Window3 x={-87} y={76} z={164} w={69} h={27} />
      <Window3 x={19} y={76} z={164} w={69} h={27} />
      <Window3 x={-92} y={76} z={75} w={53} h={63} />
      <Window3 x={40} y={76} z={75} w={53} h={63} />
      <Window3 x={-30} y={76} z={74} w={60} h={73} door />
      <Window3 x={106} y={-68} z={161} w={52} h={30} axis="y" />
      <Window3 x={106} y={7} z={161} w={50} h={30} axis="y" />
      <Window3 x={106} y={-68} z={91} w={52} h={48} axis="y" />
      <Window3 x={106} y={7} z={91} w={50} h={48} axis="y" />
      <Box
        x={-35}
        y={76}
        z={78}
        w={70}
        d={21}
        h={4}
        front="#536b72"
        top="#86938b"
      />
      <Box x={-36} y={77} w={72} d={20} h={5} top="#89948c" />
      <Grass x={-126} y={99} />
      <Grass x={125} y={99} />
      <Box
        x={58}
        y={116}
        z={18}
        w={55}
        d={17}
        h={5}
        front="#7e8979"
        top="#a0a48b"
      />
      {[64, 101].map((x) => (
        <Box key={x} x={x} y={118} w={5} d={12} h={18} front="#46595e" />
      ))}
    </g>
  );
}

function CafeChair({
  x,
  y,
  backLeft,
}: {
  x: number;
  y: number;
  backLeft: boolean;
}) {
  return (
    <g>
      {[x + 1, x + 9].flatMap((legX) =>
        [y + 1, y + 14].map((legY) => (
          <Box
            key={`${legX}-${legY}`}
            x={legX}
            y={legY}
            w={3}
            d={3}
            h={14}
            front="#5b706a"
          />
        )),
      )}
      <Box x={x} y={y} z={14} w={13} d={18} h={4} top="#8c957e" />
      <Box
        x={backLeft ? x - 1 : x + 10}
        y={y}
        z={18}
        w={3}
        d={18}
        h={19}
        front="#6b8071"
        top="#a0a68b"
      />
    </g>
  );
}

function CafePavilion() {
  return (
    <g>
      <Ground />
      <Box
        x={-130}
        y={-75}
        w={260}
        d={150}
        h={112}
        front="#495654"
        side="#31454a"
        top="#75827c"
      />
      <Box
        x={-138}
        y={-83}
        z={112}
        w={276}
        d={166}
        h={8}
        front="#829087"
        side="#4a6269"
        top="#667873"
      />
      <Window3 x={-119} y={76} z={64} w={80} h={59} />
      <Window3 x={-30} y={76} z={64} w={62} h={63} door />
      <Window3 x={43} y={76} z={64} w={75} h={59} />
      <Window3 x={131} y={-65} z={95} w={128} h={84} axis="y" />
      <WallPlane x={-118} y={77} z={28}>
        <path d="M4 0H72M10 0V17M63 0V17" stroke="#a49777" strokeWidth="3" />
      </WallPlane>
      <WallPlane x={46} y={77} z={28}>
        <path d="M4 0H67M12 0V17M58 0V17" stroke="#a49777" strokeWidth="3" />
      </WallPlane>
      <Box
        x={115}
        y={102}
        w={32}
        d={9}
        h={48}
        front="#32484b"
        side="#21373d"
        top="#8b9a8f"
      />
      <WallPlane x={118} y={112} z={44}>
        <path
          d="M1 0H24M1 9H24M1 18H19M1 27H22"
          stroke="#c6c5a7"
          strokeWidth="1.4"
        />
      </WallPlane>
      <Box
        x={-104}
        y={111}
        z={26}
        w={40}
        d={26}
        h={4}
        front="#718173"
        top="#929a7f"
      />
      <Box x={-88} y={121} w={6} d={6} h={26} />
      <CafeChair x={-120} y={118} backLeft />
      <CafeChair x={-61} y={118} backLeft={false} />
      <Box
        x={-85}
        y={119}
        z={30}
        w={7}
        d={7}
        h={7}
        front="#c4baa0"
        top="#ddd0b0"
      />
      <Grass x={-154} y={91} />
    </g>
  );
}

function PedestrianStreet() {
  return (
    <g>
      <Ground />
      <Box
        x={-160}
        y={-60}
        w={88}
        d={110}
        h={143}
        front="#384a51"
        side="#253b44"
        top="#6b7a7c"
      />
      <Box
        x={-60}
        y={-65}
        w={120}
        d={110}
        h={177}
        front="#53615e"
        side="#33484d"
        top="#849086"
      />
      <Box
        x={72}
        y={-58}
        w={88}
        d={108}
        h={151}
        front="#42545a"
        side="#2a4049"
        top="#758781"
      />
      {[-146, -32, 87].map((x, i) => (
        <g key={x}>
          <Window3
            x={x}
            y={i === 1 ? 46 : 51}
            z={i === 1 ? 161 : 132}
            w={i === 1 ? 64 : 59}
            h={31}
          />
          <Window3
            x={x}
            y={i === 1 ? 46 : 51}
            z={91}
            w={i === 1 ? 64 : 59}
            h={29}
          />
          <Window3
            x={x}
            y={i === 1 ? 46 : 51}
            z={51}
            w={i === 1 ? 64 : 59}
            h={49}
            door
          />
        </g>
      ))}
      <Window3 x={161} y={-49} z={132} w={84} h={32} axis="y" />
      <Window3 x={161} y={-49} z={88} w={84} h={35} axis="y" />
      <Box
        x={-165}
        y={49}
        z={55}
        w={99}
        d={16}
        h={4}
        front="#8e8063"
        top="#a6997d"
      />
      <Box
        x={69}
        y={49}
        z={55}
        w={98}
        d={16}
        h={4}
        front="#788b80"
        top="#9caa91"
      />
      {[104, 149].map((x) => (
        <g key={x}>
          <Line3 a={[x, 112, 0]} b={[x, 112, 31]} width={4} color="#85968c" />
          <Line3
            a={[x, 112, 31]}
            b={[x + 10, 112, 38]}
            width={3}
            color="#85968c"
          />
        </g>
      ))}
      <Box x={-152} y={108} w={4} d={4} h={94} front="#899b9c" side="#617a83" />
      <Box
        x={-159}
        y={101}
        z={94}
        w={18}
        d={17}
        h={8}
        front="#a7aa8a"
        top="#c0c0a0"
      />
      <Grass x={60} y={99} small />
    </g>
  );
}

function Sofa({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Box
        x={x}
        y={y}
        z={8}
        w={87}
        d={43}
        h={22}
        front="#62776d"
        side="#3d5953"
        top="#8a9987"
      />
      <Box
        x={x}
        y={y}
        z={30}
        w={87}
        d={9}
        h={23}
        front="#708575"
        top="#9aa58a"
      />
      <Box x={x - 2} y={y + 7} z={29} w={8} d={38} h={11} front="#6c8377" />
      <Box x={x + 81} y={y + 7} z={29} w={8} d={38} h={11} front="#6c8377" />
      {[x + 7, x + 75].flatMap((px) =>
        [y + 5, y + 35].map((py) => (
          <Box key={`${px}-${py}`} x={px} y={py} w={4} d={4} h={8} />
        )),
      )}
    </g>
  );
}

function CafeLounge() {
  return (
    <g>
      <CutawayRoom slats />
      <WallPlane x={-130} y={-106} z={184}>
        {[23, 47, 71, 95, 119, 143, 167].map((v, row) => (
          <g key={v} stroke="#69716a" fill="none" strokeWidth=".7">
            <path d={`M0 ${v}H267`} />
            {[0, 1, 2, 3, 4, 5].map((col) => (
              <path
                key={col}
                d={`M${col * 45 + (row % 2) * 22} ${v - 23}V${v}`}
              />
            ))}
          </g>
        ))}
      </WallPlane>
      {[-103, 112].map((x) => (
        <g key={x}>
          <Line3
            a={[x, -89, 185]}
            b={[x, -89, 136]}
            color="#8e9d92"
            width={1}
          />
          <Box
            x={x - 10}
            y={-99}
            z={130}
            w={20}
            d={20}
            h={6}
            front="#c2ae80"
            side="#887c61"
            top="#9a987d"
          />
        </g>
      ))}
      <Sofa x={-109} y={19} />
      <Box
        x={21}
        y={42}
        z={28}
        w={55}
        d={41}
        h={5}
        front="#8e967b"
        side="#627465"
        top="#b0ae88"
      />
      <Box x={44} y={57} w={8} d={8} h={28} front="#63766c" />
      <Box
        x={30}
        y={54}
        z={33}
        w={8}
        d={8}
        h={8}
        front="#d1c9a9"
        top="#e3d8b7"
      />
      <Box x={55} y={66} z={33} w={10} d={8} h={6} front="#c2c2a2" />
      {[105, 124].flatMap((legX) =>
        [40, 64].map((legY) => (
          <Box key={`${legX}-${legY}`} x={legX} y={legY} w={4} d={4} h={9} />
        )),
      )}
      <Box
        x={102}
        y={37}
        z={9}
        w={28}
        d={34}
        h={20}
        front="#6c8274"
        side="#3c5b55"
        top="#93a18a"
      />
      <Box x={123} y={37} z={29} w={8} d={34} h={26} front="#678170" />
      <Grass x={107} y={-62} />
    </g>
  );
}

function OfficeLobby() {
  return (
    <g>
      <CutawayRoom slats />
      <Window3 x={-136} y={-88} z={164} w={65} h={160} axis="y" door />
      <WallPlane x={-130} y={-106} z={184}>
        <path d="M85 0V183M178 0V183M0 92H267" stroke="#6c7a72" />
      </WallPlane>
      <Box
        x={2}
        y={24}
        w={107}
        d={29}
        h={8}
        front="#526a6b"
        side="#344c56"
        top="#81938b"
      />
      <Box
        x={-4}
        y={18}
        z={8}
        w={119}
        d={41}
        h={47}
        front="#7b8a83"
        side="#485f64"
        top="#a3ada1"
      />
      <Box
        x={-9}
        y={13}
        z={55}
        w={129}
        d={51}
        h={5}
        front="#abb3a4"
        side="#778c87"
        top="#bfc6b4"
      />
      <WallPlane x={4} y={60} z={45}>
        <path d="M0 7H102M0 20H102" stroke="#a4b3a4" />
      </WallPlane>
      <Box
        x={53}
        y={25}
        z={60}
        w={31}
        d={4}
        h={22}
        front="#1c333c"
        side="#52696b"
        top="#7e8d86"
      />
      <Box x={65} y={31} z={60} w={7} d={7} h={4} />
      <Sofa x={-109} y={51} />
      <Grass x={116} y={-65} />
    </g>
  );
}

function BusinessCenter() {
  return (
    <g>
      <Ground />
      <Box
        x={-90}
        y={-60}
        w={180}
        d={110}
        h={230}
        front="#455960"
        side="#2d454f"
        top="#71817f"
      />
      <Box
        x={-96}
        y={-66}
        z={230}
        w={192}
        d={122}
        h={7}
        front="#82928e"
        side="#576e76"
        top="#8a9690"
      />
      {[219, 179, 139, 99, 59].map((z) => (
        <g key={z}>
          {[-77, -23, 31].map((x) => (
            <Window3 key={x} x={x} y={51} z={z} w={44} h={26} />
          ))}
          <Window3 x={91} y={-49} z={z} w={88} h={26} axis="y" />
          <Line3
            a={[-90, 51, z - 31]}
            b={[90, 51, z - 31]}
            color="#8b9b99"
            width={2}
          />
        </g>
      ))}
      <Window3 x={-32} y={51} z={26} w={64} h={25} door />
      <Box x={-44} y={52} w={88} d={23} h={5} top="#9fa99d" />
      <Grass x={-114} y={88} />
      <Grass x={114} y={88} />
    </g>
  );
}

function CommercialEntrance() {
  return (
    <g>
      <Ground />
      <Box
        x={-150}
        y={-70}
        w={300}
        d={150}
        h={160}
        front="#4e5d5e"
        side="#2e444c"
        top="#667975"
      />
      <Box
        x={-157}
        y={-77}
        z={160}
        w={314}
        d={164}
        h={8}
        front="#8d9990"
        side="#5f777b"
        top="#818e87"
      />
      <WallPlane x={-149} y={81} z={159}>
        <path
          d="M0 47H298M0 99H298M63 0V148M234 0V148"
          fill="none"
          stroke="#778a84"
        />
      </WallPlane>
      <Window3 x={-137} y={81} z={99} w={65} h={82} />
      <Window3 x={73} y={81} z={99} w={64} h={82} />
      <Window3 x={-51} y={81} z={106} w={102} h={94} door />
      <Box x={-118} y={82} z={6} w={236} d={26} h={6} top="#9eaaa0" />
      <Box x={-128} y={100} w={256} d={25} h={6} top="#7f918c" />
      {[-115, 115].map((x) => (
        <g key={x}>
          <Line3 a={[x, 88, 12]} b={[x, 88, 42]} color="#b0beb0" width={2} />
          <Line3 a={[x, 120, 6]} b={[x, 120, 36]} color="#b0beb0" width={2} />
          <Line3 a={[x, 88, 42]} b={[x, 120, 36]} color="#b0beb0" width={2} />
        </g>
      ))}
      <Grass x={-157} y={113} />
      <Grass x={157} y={113} />
    </g>
  );
}

function ServiceWorkshop() {
  const rung = (t: number): [Point3, Point3] => [
    [-54, 145 - t * 44, t * 91],
    [-29, 145 - t * 44, t * 91],
  ];
  const [headX, headY] = iso(-40, 112, 83);
  return (
    <g>
      <Ground />
      <Box
        x={-140}
        y={-65}
        w={280}
        d={155}
        h={125}
        front="#465960"
        side="#2c454f"
        top="#637a7c"
      />
      <Box
        x={-148}
        y={-73}
        z={125}
        w={296}
        d={171}
        h={6}
        front="#8b9993"
        side="#516e78"
        top="#6c8381"
      />
      <WallPlane x={-124} y={91} z={84}>
        <rect width="87" height="82" fill="#1c333d" stroke="#849a9b" />
        {[9, 20, 31, 42, 53, 64, 75].map((v) => (
          <path key={v} d={`M3 ${v}H84`} stroke="#5d7882" strokeWidth="2" />
        ))}
      </WallPlane>
      <Window3 x={62} y={91} z={84} w={58} h={82} door />
      <Window3 x={-10} y={91} z={65} w={43} h={42} />
      <Line3 a={[-54, 145, 0]} b={[-54, 101, 91]} width={3} color="#becbc1" />
      <Line3 a={[-29, 145, 0]} b={[-29, 101, 91]} width={3} color="#becbc1" />
      {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1].map((t) => (
        <Line3
          key={t}
          a={rung(t)[0]}
          b={rung(t)[1]}
          width={2}
          color="#bdccc3"
        />
      ))}
      <Box
        x={-47}
        y={108}
        z={52}
        w={14}
        d={8}
        h={22}
        front="#c08b44"
        side="#8c663d"
        top="#cfaa68"
      />
      <Line3 a={[-40, 112, 51]} b={[-50, 130, 31]} color="#9aaba3" width={5} />
      <Line3 a={[-40, 112, 51]} b={[-32, 130, 31]} color="#9aaba3" width={5} />
      <Line3 a={[-40, 112, 68]} b={[-21, 96, 84]} color="#c7b49a" width={4} />
      <circle cx={headX} cy={headY} r="5" fill="#d3b797" />
      <Box
        x={-47}
        y={106}
        z={86}
        w={14}
        d={13}
        h={4}
        front="#cba257"
        top="#dec17f"
      />
      <Box x={70} y={117} w={56} d={24} h={19} front="#586e72" top="#8c9d92" />
      <Box
        x={6}
        y={120}
        w={29}
        d={22}
        h={17}
        front="#8c7750"
        side="#5e604d"
        top="#b29b68"
      />
    </g>
  );
}

export default function FacadeContext({ slug }: { slug: string }) {
  return (
    <g data-scene-context={slug} data-stage-kind="environment">
      {slug === "channel-letters" ? (
        <CornerShop />
      ) : slug === "lightboxes" ? (
        <CafePavilion />
      ) : slug === "projecting-signs" ? (
        <PedestrianStreet />
      ) : slug === "neon-signs" ? (
        <CafeLounge />
      ) : slug === "non-illuminated-signs" ? (
        <OfficeLobby />
      ) : slug === "roof-signs" ? (
        <BusinessCenter />
      ) : slug === "facades-and-entrances" ? (
        <CommercialEntrance />
      ) : (
        <ServiceWorkshop />
      )}
    </g>
  );
}
