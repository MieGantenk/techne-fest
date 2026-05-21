"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Wind,
  Factory,
  Trees,
  Droplets,
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  Sparkles,
  ContactShadows,
  Cloud,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";

// ==========================================
// DATA SEJARAH EMISI KARBON
// ==========================================
const TIMELINE = [
  {
    id: 0,
    year: "Pra-1750",
    title: "Masa Pra-Industri",
    subtitle: "Keseimbangan Alam yang Sempurna",
    desc: "Sebelum manusia menemukan mesin uap, bumi bernapas dengan ritme alaminya. Hutan lebat menyerap seluruh jejak karbon alami, hewan berkembang biak bebas, manusia hidup selaras dengan alam, dan udara benar-benar murni tanpa polusi.",
    impact: 0,
    co2: "~280 ppm",
    icon: Trees,
  },
  {
    id: 1,
    year: "1850 - 1950",
    title: "Revolusi Industri",
    subtitle: "Asap Pertama di Udara",
    desc: "Manusia mulai membakar batu bara secara massal untuk pabrik dan kereta api uap. Pemukiman mulai padat, beberapa wilayah hijau beralih fungsi, dan kepulan asap industri pertama mulai mengotori atmosfer bumi.",
    impact: 0.35,
    co2: "300 - 310 ppm",
    icon: Factory,
  },
  {
    id: 2,
    year: "1950 - 2000",
    title: "Akselerasi Hebat",
    subtitle: "Ledakan Industri dan Urbanisasi",
    desc: "Penggunaan minyak bumi meledak. Jutaan kendaraan bermotor mulai memadati jalan raya, gedung-gedung beton dibangun tinggi, aktivitas alam tergusur, dan langit mulai kehilangan warna birunya akibat polusi.",
    impact: 0.7,
    co2: "310 - 370 ppm",
    icon: Wind,
  },
  {
    id: 3,
    year: "2000 - Saat Ini",
    title: "Krisis Iklim Modern",
    subtitle: "Tanda Bahaya untuk Bumi",
    desc: "Era digital dan globalisasi membuat konsumsi energi mencapai rekor tertinggi. Polusi udara menebal secara ekstrem, ekosistem alam rusak parah, populasi makhluk hidup menyusut, dan bumi memasuki fase krisis iklim kritis.",
    impact: 1,
    co2: "420+ ppm",
    icon: Droplets,
  },
];

// ==========================================
// ATMOSFER & LANGIT DINAMIS
// ==========================================
function AtmosphereFX({ impact }: { impact: number }) {
  const sunRef = useRef<THREE.Mesh>(null);
  const hazeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (sunRef.current) {
      sunRef.current.position.x = Math.sin(t * 0.15) * 0.4 + 2.6;
      sunRef.current.position.y = 2.9 + Math.cos(t * 0.18) * 0.12;
      sunRef.current.rotation.z += 0.002;
    }

    if (hazeRef.current) {
      hazeRef.current.rotation.z += 0.0015;
    }
  });

  return (
    <group>
      <mesh ref={sunRef} position={[2.6, 2.9, -3]}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshBasicMaterial
          color={impact > 0.65 ? "#f59e0b" : "#fde68a"}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh position={[2.6, 2.9, -3.2]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshBasicMaterial
          color={impact > 0.65 ? "#fb923c" : "#fef3c7"}
          transparent
          opacity={0.18}
        />
      </mesh>

      <mesh ref={hazeRef} position={[0, 1.6, -2.8]} rotation={[0, 0, 0.2]}>
        <torusGeometry args={[4.6, 0.12, 24, 100]} />
        <meshBasicMaterial
          color={impact > 0.6 ? "#64748b" : "#a5f3fc"}
          transparent
          opacity={impact > 0.6 ? 0.16 : 0.08}
        />
      </mesh>

      <Cloud
        position={[-2.4, 2.3, -2.8]}
        speed={0.15}
        opacity={impact > 0.7 ? 0.12 : 0.3}
        color={impact > 0.65 ? "#94a3b8" : "#ffffff"}
        segments={18}
      />
      <Cloud
        position={[1.2, 2.0, -2.6]}
        speed={0.12}
        opacity={impact > 0.7 ? 0.1 : 0.26}
        color={impact > 0.65 ? "#94a3b8" : "#ffffff"}
        segments={14}
      />

      {impact > 0.8 && (
        <Stars
          radius={20}
          depth={12}
          count={400}
          factor={2}
          saturation={0}
          fade
          speed={0.15}
        />
      )}
    </group>
  );
}

// ==========================================
// BURUNG TERBANG
// ==========================================
function FlyingBirds({ impact }: { impact: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.4;
    }
  });

  const birdScale = Math.max(0, 1 - impact * 1.25);

  const birds = [
    [1.5, 0.2, 0],
    [-1.2, 0.5, 0.8],
    [0.2, 0, -1.4],
    [1.9, 0.55, 0.9],
    [-1.8, 0.15, -0.7],
    [0.7, 0.35, 1.4],
  ];

  return (
    <group
      ref={groupRef}
      scale={[birdScale, birdScale, birdScale]}
      position={[0, 2.5, 0]}
    >
      {birds.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.11, 0.02, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
          <mesh rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.11, 0.02, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==========================================
// MAKHLUK HIDUP
// ==========================================
function LivingCreatures({ impact }: { impact: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.02;
    }
  });

  const natureLifeScale = Math.max(0, 1 - impact * 1.2);
  const cityLifeScale = Math.min(1, impact * 1.5);

  return (
    <group ref={groupRef} position={[0, 0.25, 0]}>
      <group scale={[natureLifeScale, natureLifeScale, natureLifeScale]}>
        <group position={[-0.8, 0, 0.8]}>
          <mesh castShadow position={[0, 0.15, 0]}>
            <boxGeometry args={[0.08, 0.2, 0.08]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
          <mesh castShadow position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#fdba74" />
          </mesh>
        </group>

        <group position={[0.8, -0.05, -0.5]} rotation={[0, Math.PI / 4, 0]}>
          <mesh castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[0.18, 0.12, 0.1]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh castShadow position={[0.08, 0.18, 0]}>
            <boxGeometry args={[0.06, 0.1, 0.08]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>

        <group position={[1.15, -0.02, 0.9]} rotation={[0, -Math.PI / 5, 0]}>
          <mesh castShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[0.16, 0.1, 0.08]} />
            <meshStandardMaterial color="#fde68a" />
          </mesh>
          <mesh castShadow position={[0.06, 0.15, 0]}>
            <boxGeometry args={[0.06, 0.08, 0.06]} />
            <meshStandardMaterial color="#fde68a" />
          </mesh>
        </group>
      </group>

      <group scale={[cityLifeScale, cityLifeScale, cityLifeScale]}>
        <group position={[0.6, -0.1, 0.6]} rotation={[0, -Math.PI / 3, 0]}>
          <mesh castShadow position={[0, 0.1, 0]}>
            <boxGeometry args={[0.25, 0.12, 0.14]} />
            <meshStandardMaterial color="#ef4444" metalness={0.6} />
          </mesh>
          <mesh castShadow position={[-0.02, 0.2, 0]}>
            <boxGeometry args={[0.14, 0.09, 0.12]} />
            <meshStandardMaterial color="#93c5fd" />
          </mesh>
        </group>

        <group position={[-0.1, -0.08, 1.0]} rotation={[0, Math.PI / 6, 0]}>
          <mesh castShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[0.22, 0.1, 0.12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.5} />
          </mesh>
          <mesh castShadow position={[0.02, 0.17, 0]}>
            <boxGeometry args={[0.11, 0.07, 0.1]} />
            <meshStandardMaterial color="#bfdbfe" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ==========================================
// POHON BANTUAN
// ==========================================
function Tree({
  position,
  type = "cone",
  trunk = "#451a03",
  leaf = "#16a34a",
  scale = 1,
}: {
  position: [number, number, number];
  type?: "cone" | "round";
  trunk?: string;
  leaf?: string;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.4, 8]} />
        <meshStandardMaterial color={trunk} />
      </mesh>

      {type === "cone" ? (
        <mesh castShadow position={[0, 0.6, 0]}>
          <coneGeometry args={[0.32, 0.7, 6]} />
          <meshStandardMaterial color={leaf} flatShading />
        </mesh>
      ) : (
        <mesh castShadow position={[0, 0.58, 0]}>
          <sphereGeometry args={[0.26, 6, 6]} />
          <meshStandardMaterial color={leaf} flatShading />
        </mesh>
      )}
    </group>
  );
}

// ==========================================
// KOTA / INDUSTRI
// ==========================================
function IndustrialCity({ impact }: { impact: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow position={[0.4, 0.85, -0.4]}>
        <boxGeometry args={[0.5, 1.7, 0.5]} />
        <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.7} />
      </mesh>

      <mesh castShadow position={[0.95, 0.65, -0.1]}>
        <boxGeometry args={[0.34, 1.2, 0.34]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.6} />
      </mesh>

      <mesh castShadow position={[0.25, 0.48, 0.42]}>
        <boxGeometry args={[0.28, 0.85, 0.28]} />
        <meshStandardMaterial color="#475569" roughness={0.25} metalness={0.55} />
      </mesh>

      <group position={[-0.5, 0.4, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.8, 0.6]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>

        <mesh castShadow position={[0.2, 0.7, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.9, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        <mesh castShadow position={[-0.15, 0.6, 0.12]}>
          <cylinderGeometry args={[0.05, 0.05, 0.7, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        <Sparkles
          count={impact > 0.3 ? Math.floor(impact * 80) : 0}
          scale={1.4}
          size={6}
          speed={0.7}
          opacity={0.45}
          color="#1e293b"
          position={[0.12, 1.25, 0]}
        />
      </group>

      <mesh position={[0.15, 0.06, 0.1]} rotation={[-Math.PI / 2, 0.35, 0]}>
        <torusGeometry args={[0.95, 0.06, 10, 80]} />
        <meshStandardMaterial color="#334155" roughness={1} />
      </mesh>
    </group>
  );
}

// ==========================================
// DEKORASI PULAU
// ==========================================
function IslandRimDetails({ impact }: { impact: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[1.85, 0.08, -0.6]} castShadow>
        <dodecahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color={impact > 0.6 ? "#78716c" : "#14532d"} flatShading />
      </mesh>
      <mesh position={[-1.55, 0.1, -1.0]} castShadow>
        <dodecahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color={impact > 0.6 ? "#57534e" : "#166534"} flatShading />
      </mesh>
      <mesh position={[1.25, 0.12, 1.25]} castShadow>
        <dodecahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial color={impact > 0.6 ? "#78716c" : "#22c55e"} flatShading />
      </mesh>
      <mesh position={[-0.25, 0.11, -1.55]} castShadow>
        <dodecahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial color={impact > 0.6 ? "#57534e" : "#15803d"} flatShading />
      </mesh>
    </group>
  );
}

// ==========================================
// LAUT / RING GELOMBANG
// ==========================================
function OceanRings({ impact }: { impact: number }) {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.z = t * 0.05;
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.03;
    }
  });

  return (
    <group position={[0, -0.15, 0]}>
      <mesh ref={ring1} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.9, 3.35, 64]} />
        <meshBasicMaterial
          color={impact > 0.7 ? "#334155" : "#67e8f9"}
          transparent
          opacity={0.14}
        />
      </mesh>

      <mesh ref={ring2} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.55, 4.05, 64]} />
        <meshBasicMaterial
          color={impact > 0.7 ? "#475569" : "#38bdf8"}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

// ==========================================
// KOMPONEN UTAMA 3D
// ==========================================
function DynamicIsland({ targetImpact }: { targetImpact: number }) {
  const grassMat = useRef<THREE.MeshStandardMaterial>(null);
  const waterMat = useRef<THREE.MeshStandardMaterial>(null);
  const treeGroup = useRef<THREE.Group>(null);
  const cityGroup = useRef<THREE.Group>(null);
  const landTopMat = useRef<THREE.MeshStandardMaterial>(null);

  const colors = useMemo(
    () => ({
      grassNature: new THREE.Color("#22c55e"),
      grassPolluted: new THREE.Color("#451a03"),
      landTopNature: new THREE.Color("#2fb75b"),
      landTopPolluted: new THREE.Color("#6b4423"),
      waterNature: new THREE.Color("#0ea5e9"),
      waterPolluted: new THREE.Color("#1c1917"),
      skyNature: new THREE.Color("#bae6fd"),
      skyPolluted: new THREE.Color("#334155"),
    }),
    []
  );

  useFrame((state, delta) => {
    if (grassMat.current) {
      grassMat.current.color.lerpColors(
        colors.grassNature,
        colors.grassPolluted,
        targetImpact
      );
    }

    if (landTopMat.current) {
      landTopMat.current.color.lerpColors(
        colors.landTopNature,
        colors.landTopPolluted,
        targetImpact
      );
    }

    if (waterMat.current) {
      waterMat.current.color.lerpColors(
        colors.waterNature,
        colors.waterPolluted,
        targetImpact
      );
    }

    const fogNear = THREE.MathUtils.lerp(15, 6, targetImpact);
    const fogFar = THREE.MathUtils.lerp(40, 16, targetImpact);
    const currentSkyColor = new THREE.Color().lerpColors(
      colors.skyNature,
      colors.skyPolluted,
      targetImpact
    );

    state.scene.fog = new THREE.Fog(currentSkyColor, fogNear, fogFar);
    state.scene.background = currentSkyColor;

    if (treeGroup.current) {
      const treeScale = THREE.MathUtils.damp(
        treeGroup.current.scale.x,
        1 - targetImpact * 0.9,
        4,
        delta
      );
      treeGroup.current.scale.set(treeScale, treeScale, treeScale);
    }

    if (cityGroup.current) {
      const cityScale = THREE.MathUtils.damp(
        cityGroup.current.scale.x,
        targetImpact,
        4,
        delta
      );
      cityGroup.current.scale.set(cityScale, cityScale, cityScale);
    }
  });

  return (
    <group position={[0, -0.8, 0]}>
      <AtmosphereFX impact={targetImpact} />

      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5, 0.4, 64]} />
        <meshStandardMaterial
          ref={waterMat}
          transparent
          opacity={0.88}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>

      <OceanRings impact={targetImpact} />

      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2.3, 2.6, 0.5, 32]} />
        <meshStandardMaterial ref={grassMat} roughness={0.95} />
      </mesh>

      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[2.05, 2.2, 0.18, 32]} />
        <meshStandardMaterial ref={landTopMat} roughness={1} />
      </mesh>

      <FlyingBirds impact={targetImpact} />
      <LivingCreatures impact={targetImpact} />
      <IslandRimDetails impact={targetImpact} />

      <group ref={treeGroup}>
        <Tree position={[-0.8, 0.25, -0.8]} type="cone" leaf="#16a34a" scale={1} />
        <Tree position={[0.3, 0.25, 1.2]} type="round" leaf="#15803d" scale={1} />
        <Tree position={[-1.35, 0.22, 0.55]} type="round" leaf="#166534" scale={0.8} />
        <Tree position={[1.2, 0.22, -0.95]} type="cone" leaf="#22c55e" scale={0.85} />
        <Tree position={[1.45, 0.24, 0.2]} type="round" leaf="#16a34a" scale={0.7} />
        <Tree position={[-0.15, 0.22, -1.35]} type="cone" leaf="#15803d" scale={0.72} />

        <mesh position={[-1.2, 0.3, 0.2]} castShadow>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#166534" flatShading />
        </mesh>
        <mesh position={[1, 0.28, 0.3]} castShadow>
          <dodecahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color="#22c55e" flatShading />
        </mesh>
      </group>

      <group ref={cityGroup} scale={[0, 0, 0]}>
        <IndustrialCity impact={targetImpact} />
      </group>

      <Sparkles
        count={80}
        scale={[9, 5, 9]}
        size={targetImpact > 0.6 ? 4 : 2}
        speed={targetImpact > 0.6 ? 0.35 : 0.2}
        opacity={targetImpact > 0.6 ? 0.22 : 0.12}
        color={targetImpact > 0.6 ? "#94a3b8" : "#ffffff"}
        position={[0, 1.8, 0]}
      />
    </group>
  );
}

// ==========================================
// HALAMAN UTAMA
// ==========================================
export default function SejarahEmisiPage() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const currentPhase = TIMELINE[phaseIndex];
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    if (
      (newDirection === 1 && phaseIndex === TIMELINE.length - 1) ||
      (newDirection === -1 && phaseIndex === 0)
    ) {
      return;
    }
    setPage([page + newDirection, newDirection]);
    setPhaseIndex((prev) => prev + newDirection);
  };

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 90, damping: 14 },
    },
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 180, damping: 18 },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      transition: { duration: 0.25 },
    }),
  };

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-slate-100 flex flex-col font-sans overflow-hidden selection:bg-teal-100 selection:text-teal-900"
    >
      <motion.div
        variants={itemVars}
        className="w-full text-center py-6 md:py-8 z-10 relative px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 text-slate-700 text-xs font-bold tracking-wider backdrop-blur-md mb-2 border border-slate-200">
          VISUALISASI DATA INTERAKTIF
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
          Timeline Jejak Karbon Bumi
        </h1>
      </motion.div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-10 pb-32 lg:pb-16">
        <motion.div
          variants={itemVars}
          className="relative w-full h-[42vh] lg:h-[68vh] rounded-[2rem] shadow-inner bg-gradient-to-b from-sky-200 to-slate-200 overflow-hidden border border-white lg:col-span-7"
        >
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [4, 3, 5], fov: 45 }} shadows dpr={[1, 2]}>
              <ambientLight intensity={0.85} />
              <directionalLight
                position={[8, 12, 8]}
                intensity={1.55}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              <directionalLight position={[-6, 8, 4]} intensity={0.45} />

              <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
                <DynamicIsland targetImpact={currentPhase.impact} />
              </Float>

              <ContactShadows
                position={[0, -1.8, 0]}
                opacity={0.42}
                scale={12}
                blur={2.2}
                far={3}
              />

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 4}
                autoRotate
                autoRotateSpeed={0.42}
              />
            </Canvas>
          </div>

          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_24%),radial-gradient(circle_at_80%_85%,rgba(20,184,166,0.10),transparent_28%)]" />

          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-white/60 pointer-events-none">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
              Konsentrasi CO₂
            </div>
            <div className="text-xl font-black text-slate-800 tracking-tight">
              {currentPhase.co2}
            </div>
          </div>

          <div className="absolute left-4 bottom-4 bg-slate-900/70 text-white backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 pointer-events-none">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300 mb-1">
              Fase
            </div>
            <div className="text-sm font-bold">{currentPhase.year}</div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVars}
          className="relative flex flex-col justify-center w-full lg:col-span-5 h-full"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white p-6 md:p-10 rounded-[2rem] shadow-lg shadow-slate-200/60 border border-slate-100"
            >
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 border border-teal-100 shadow-sm">
                <currentPhase.icon size={28} />
              </div>

              <div className="text-teal-500 font-black text-lg md:text-xl tracking-wider mb-1">
                {currentPhase.year}
              </div>

              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight leading-tight">
                {currentPhase.title}
              </h2>

              <h3 className="text-sm md:text-base font-semibold text-slate-400 mb-5">
                {currentPhase.subtitle}
              </h3>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {currentPhase.desc}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 via-amber-400 to-rose-500 transition-all duration-700"
                    style={{ width: `${Math.max(6, currentPhase.impact * 100)}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Dampak {Math.round(currentPhase.impact * 100)}%
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        variants={itemVars}
        className="fixed bottom-0 left-0 w-full bg-white/70 backdrop-blur-xl border-t border-slate-200/80 z-50 p-4 md:p-5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between md:justify-center md:gap-16">
          <button
            onClick={() => paginate(-1)}
            disabled={phaseIndex === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              phaseIndex === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-md active:scale-95"
            }`}
          >
            <ChevronLeft size={18} /> <span>Sebelumnya</span>
          </button>

          <div className="flex gap-2">
            {TIMELINE.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === phaseIndex ? "w-6 bg-teal-500" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => paginate(1)}
            disabled={phaseIndex === TIMELINE.length - 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              phaseIndex === TIMELINE.length - 1
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-teal-500 text-white hover:bg-teal-600 shadow-md shadow-teal-500/20 active:scale-95"
            }`}
          >
            <span>Berikutnya</span> <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}