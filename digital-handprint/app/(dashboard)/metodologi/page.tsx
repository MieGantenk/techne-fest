"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Database,
  ArrowRight,
  Smartphone,
  Server,
  Zap,
  Leaf,
  Layers,
  Cpu,
  TrendingUp
} from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Html,
  RoundedBox,
  Sparkles,
  ContactShadows,
  Sphere,
  MeshDistortMaterial,
  Torus,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import * as THREE from "three";

type StepKey = 0 | 1 | 2;

// Helper function untuk dampening gerakan 3D agar sehalus mentega
function damp(current: number, target: number, lambda: number, delta: number) {
  return THREE.MathUtils.damp(current, target, lambda, delta);
}

// ==========================================
// METADATA BACKGROUND GRID & FX
// ==========================================
function PremiumAmbientField() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame(({ clock }) => {
    if (gridRef.current) {
      // Pergerakan grid halus di lantai menciptakan efek dunia siber bergerak
      gridRef.current.position.z = (clock.getElapsedTime() * 0.2) % 1;
    }
  });

  return (
    <group position={[0, -2, 0]}>
      <gridHelper ref={gridRef} args={[30, 30, "#2dd4bf", "#e2e8f0"]} />
      <Sparkles count={100} scale={[25, 8, 10]} size={2} speed={0.2} color="#2dd4bf" opacity={0.15} />
    </group>
  );
}

// ==========================================
// 1. DIGITAL ACTIVITY NODE (High-Fidelity Smartphone)
// ==========================================
function PremiumDeviceNode({ active }: { active: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      // Efek floating sinematik + rotasi halus
      ref.current.position.y = damp(ref.current.position.y, Math.sin(t * 2) * (active ? 0.2 : 0.08) + 0.3, 4, delta);
      ref.current.rotation.y = damp(ref.current.rotation.y, active ? 0.35 : -0.1, 3, delta);
      ref.current.rotation.x = damp(ref.current.rotation.x, active ? 0.1 : 0, 3, delta);
      
      const s = damp(ref.current.scale.x, active ? 1.2 : 0.85, 6, delta);
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={ref} position={[-4.2, 0.3, 0]}>
      {/* Halo Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={active ? 0.3 : 0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Main Premium Phone Body */}
      <RoundedBox args={[1.0, 1.8, 0.15]} radius={0.12} smoothness={10}>
        <meshPhysicalMaterial
          color="#f8fafc"
          emissive="#60a5fa"
          emissiveIntensity={active ? 0.4 : 0.05}
          roughness={0.1}
          metalness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Glass Screen - FIX: Mengganti roundedBoxGeometry dengan RoundedBox resmi dari Drei */}
      <group position={[0, 0, 0.08]}>
        <RoundedBox args={[0.88, 1.68, 0.01]} radius={0.08} smoothness={10}>
          <meshPhysicalMaterial
            color="#1e3a8a"
            transparent
            opacity={0.8}
            transmission={0.6}
            roughness={0}
            thickness={0.5}
          />
        </RoundedBox>
      </group>

      {/* UI Overlay via Html */}
      <Html position={[0, 0, 0.1]} center distanceFactor={8}>
        <div className={`p-4 rounded-3xl transition-all duration-500 flex flex-col items-center justify-center border backdrop-blur-md ${
          active ? 'bg-blue-500/10 border-blue-400 text-blue-500 scale-110 shadow-[0_0_30px_rgba(96,165,250,0.3)]' : 'bg-white/40 border-slate-200 text-slate-400'
        }`}>
          <Smartphone size={36} strokeWidth={2.5} className={active ? "animate-pulse" : ""} />
        </div>
      </Html>

      <Html position={[0, -1.4, 0]} center distanceFactor={8}>
        <div className={`px-4 py-2 rounded-xl border text-[9px] font-black tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-500 ${
          active ? "bg-slate-900 border-blue-500 text-blue-400 shadow-xl" : "bg-white/80 border-slate-200 text-slate-400"
        }`}>
          01 // USER DATA GENERATION
        </div>
      </Html>
      <Sparkles count={active ? 30 : 0} scale={[1.2, 1.8, 1.2]} size={4} speed={1.5} color="#60a5fa" />
    </group>
  );
}

// ==========================================
// 2. DATA PROCESSING VORTEX (Quantum Server Core)
// ==========================================
function PremiumDataVortex({ active }: { active: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = damp(ref.current.position.y, Math.sin(t * 1.5) * 0.12 + 0.3, 4, delta);
      ref.current.rotation.y = t * 0.2;
      const s = damp(ref.current.scale.x, active ? 1.25 : 0.85, 6, delta);
      ref.current.scale.setScalar(s);
    }
    if (ringA.current) {
      ringA.current.rotation.z += active ? 0.12 : 0.03;
      ringA.current.rotation.x = Math.sin(t) * 0.2;
    }
    if (ringB.current) {
      ringB.current.rotation.z -= active ? 0.08 : 0.02;
      ringB.current.rotation.y = Math.cos(t) * 0.2;
    }
  });

  return (
    <group ref={ref} position={[0, 0.3, 0]}>
      {/* Cyber Base Halo */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <ringGeometry args={[1.2, 1.5, 64]} />
        <meshBasicMaterial color="#2dd4bf" transparent opacity={active ? 0.4 : 0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Core Plasma Sphere */}
      <Sphere args={[0.85, 64, 64]}>
        <MeshDistortMaterial
          color="#ccfbf1"
          emissive="#06b6d4"
          emissiveIntensity={active ? 1.8 : 0.5}
          roughness={0.05}
          metalness={0.3}
          distort={active ? 0.55 : 0.2}
          speed={active ? 5 : 1}
          clearcoat={1}
        />
      </Sphere>

      {/* Orbit Rings Jaringan */}
      <Torus ref={ringA} args={[1.5, 0.05, 16, 100]}>
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={active ? 1 : 0.2} transparent opacity={0.7} />
      </Torus>
      <Torus ref={ringB} args={[1.1, 0.03, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#99f6e4" transparent opacity={0.5} />
      </Torus>

      <Html position={[0, 0, 0]} center distanceFactor={8}>
        <div className={`p-4 rounded-full transition-all duration-500 border backdrop-blur-md ${
          active ? 'bg-teal-500/10 border-teal-400 text-teal-400 scale-110 shadow-[0_0_30px_rgba(45,212,191,0.4)]' : 'bg-white/40 border-slate-200 text-slate-400'
        }`}>
          <Server size={30} strokeWidth={2.5} className={active ? "animate-spin" : ""} style={{ animationDuration: '6s' }} />
        </div>
      </Html>

      <Html position={[0, -1.4, 0]} center distanceFactor={8}>
        <div className={`px-4 py-2 rounded-xl border text-[9px] font-black tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-500 ${
          active ? "bg-slate-900 border-teal-500 text-teal-400 shadow-xl" : "bg-white/80 border-slate-200 text-slate-400"
        }`}>
          02 // INFRASTRUCTURE ENERGY
        </div>
      </Html>
      <Sparkles count={active ? 50 : 15} scale={[2.5, 2.5, 2.5]} size={4} speed={1.2} color="#2dd4bf" />
    </group>
  );
}

// ==========================================
// 3. GREEN EMISSION NODE (Eco Cloud Ecosystem)
// ==========================================
function PremiumEmissionNode({ active }: { active: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = damp(ref.current.position.y, Math.sin(t * 1.8) * 0.15 + 0.3, 4, delta);
      ref.current.rotation.z = Math.sin(t * 0.5) * 0.05;
      const s = damp(ref.current.scale.x, active ? 1.2 : 0.85, 6, delta);
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={ref} position={[4.2, 0.3, 0]}>
      {/* Floor Base Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
        <ringGeometry args={[0.9, 1.1, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={active ? 0.3 : 0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Organic Cloud Structural Clusters */}
      <group position={[0, 0.2, 0]}>
        <Sphere args={[0.65, 32, 32]} position={[0, 0, 0]}>
          <meshPhysicalMaterial color={active ? "#e6fbf4" : "#f1f5f9"} roughness={0.4} metalness={0.1} clearcoat={0.5} />
        </Sphere>
        <Sphere args={[0.45, 32, 32]} position={[-0.55, -0.1, 0.1]}>
          <meshPhysicalMaterial color="#f8fafc" roughness={0.5} />
        </Sphere>
        <Sphere args={[0.52, 32, 32]} position={[0.5, -0.05, -0.1]}>
          <meshPhysicalMaterial color="#e2e8f0" roughness={0.5} />
        </Sphere>
      </group>

      <Html position={[0, 0.2, 0.25]} center distanceFactor={8}>
        <div className={`p-4 rounded-3xl transition-all duration-500 border backdrop-blur-md ${
          active ? 'bg-emerald-500/10 border-emerald-400 text-emerald-500 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-white/40 border-slate-200 text-slate-400'
        }`}>
          <Leaf size={32} strokeWidth={2.5} className={active ? "animate-bounce" : ""} />
        </div>
      </Html>

      <Html position={[0, -1.4, 0]} center distanceFactor={8}>
        <div className={`px-4 py-2 rounded-xl border text-[9px] font-black tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-500 ${
          active ? "bg-slate-900 border-emerald-500 text-emerald-400 shadow-xl" : "bg-white/80 border-slate-200 text-slate-400"
        }`}>
          03 // CARBON FOOTPRINT
        </div>
      </Html>
      <Sparkles count={active ? 40 : 5} scale={[2, 1.5, 2]} size={5} speed={1} color="#34d399" />
    </group>
  );
}

// ==========================================
// FLOATING VECTOR STREAMS (Aliran Data Berkelok)
// ==========================================
function PremiumDataStreams({ activeStep }: { activeStep: StepKey }) {
  const ref = useRef<THREE.Group>(null);
  const totalParticles = 50;
  
  const particles = useMemo(() => {
    return Array.from({ length: totalParticles }).map((_, i) => ({
      id: i,
      randomY: (Math.random() - 0.5) * 0.4,
      randomZ: (Math.random() - 0.5) * 0.3,
      speed: 1.2 + Math.random() * 0.8,
      offset: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current?.children.forEach((child, i) => {
      const p = particles[i];
      if (child.name === 'leftStream') {
        const progress = ((t * p.speed + p.offset) % 4.2) / 4.2;
        child.position.x = THREE.MathUtils.lerp(-4.2, 0, progress);
        child.position.y = 0.4 + p.randomY + Math.sin(t * 4 + p.offset) * 0.06;
        child.position.z = p.randomZ;
      } else {
        const progress = ((t * p.speed * 0.95 + p.offset) % 4.2) / 4.2;
        child.position.x = THREE.MathUtils.lerp(0, 4.2, progress);
        child.position.y = 0.4 + p.randomY + Math.cos(t * 3.5 + p.offset) * 0.06;
        child.position.z = p.randomZ;
      }
    });
  });

  return (
    <group ref={ref}>
      {particles.slice(0, 25).map((p) => (
        <mesh key={`ls-${p.id}`} name="leftStream">
          <boxGeometry args={[0.04, 0.04, 0.04]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={activeStep === 0 ? 0.9 : 0.15} />
        </mesh>
      ))}
      {particles.slice(25, 50).map((p) => (
        <mesh key={`rs-${p.id}`} name="rightStream">
          <boxGeometry args={[0.04, 0.04, 0.04]} />
          <meshBasicMaterial color="#10b981" transparent opacity={activeStep === 1 || activeStep === 2 ? 0.9 : 0.15} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// SCENE CAMERA ANIMATION CONTROLLER
// ==========================================
function CinematicScrollScene({
  activeStep,
  setActiveStep,
}: {
  activeStep: StepKey;
  setActiveStep: (step: StepKey) => void;
}) {
  const { camera } = useThree();
  const scroll = useScroll();

  useFrame((state, delta) => {
    const offset = scroll.offset;

    // Hitung step aktif secara presisi berdasarkan posisi scroll/drag horizontal
    let currentStep: StepKey = 0;
    if (offset > 0.35 && offset <= 0.7) currentStep = 1;
    else if (offset > 0.7) currentStep = 2;

    if (currentStep !== activeStep) {
      setActiveStep(currentStep);
    }

    // Menggerakkan isi scroll internal jika user mengklik kartu di bawah luar kanvas
    const targetScroll = activeStep === 0 ? 0 : activeStep === 1 ? 0.52 : 1;
    scroll.el.scrollLeft = damp(scroll.el.scrollLeft, targetScroll * (scroll.el.scrollWidth - scroll.el.clientWidth), 4, delta);

    // Kamera otomatis meluncur halus ke koordinat objek + Efek Zoom-In Sinematik
    const targetCamX = THREE.MathUtils.lerp(-4.2, 4.2, offset);
    const targetCamZ = 4.8 - Math.sin(offset * Math.PI) * 0.6; 

    camera.position.x = damp(camera.position.x, targetCamX, 4, delta);
    camera.position.z = damp(camera.position.z, targetCamZ, 4, delta);
    camera.lookAt(targetCamX, 0.3, 0);
  });

  return (
    <>
      <color attach="background" args={["#fafafa"]} />
      <directionalLight position={[10, 12, 8]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, 5, -2]} intensity={0.5} color="#bfdbfe" />
      <pointLight position={[0, 4, 2]} intensity={1} />

      <PremiumDeviceNode active={activeStep === 0} />
      <PremiumDataVortex active={activeStep === 1} />
      <PremiumEmissionNode active={activeStep === 2} />
      
      <PremiumDataStreams activeStep={activeStep} />
      <PremiumAmbientField />
      <ContactShadows position={[0, -1.9, 0]} opacity={0.15} scale={15} blur={4} />
    </>
  );
}

// ==========================================
// PREMIUM INTERACTIVE CARD COMPONENT
// ==========================================
function PremiumStepCard({
  index,
  title,
  subtitle,
  description,
  formula,
  icon,
  active,
  onClick,
  accentColor,
  borderColor,
}: {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  formula: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  accentColor: string;
  borderColor: string;
}) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`relative w-full text-left rounded-[32px] border p-8 transition-all duration-500 cursor-pointer group select-none ${
        active
          ? `bg-white ${borderColor} shadow-[0_30px_70px_rgba(15,23,42,0.08)] scale-[1.03] z-10`
          : "bg-white/60 border-slate-100 opacity-60 hover:opacity-100"
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${active ? accentColor + " text-white shadow-lg" : "bg-slate-100 text-slate-400"}`}>
          {icon}
        </div>
        <span className="text-xs font-mono font-bold tracking-widest text-slate-300 group-hover:text-slate-400">
          STAGE // {index}
        </span>
      </div>

      <div className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-400">{subtitle}</div>
      <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-xs leading-relaxed mb-6 h-12 overflow-hidden">{description}</p>

      <div className={`rounded-2xl border px-4 py-3 text-[11px] font-mono flex items-center justify-between transition-all ${active ? "bg-slate-900 text-teal-400 border-slate-900" : "bg-slate-50 text-slate-500 border-slate-100"}`}>
        <span className="truncate max-w-[200px]">{formula}</span>
        <ArrowRight size={14} className={`transition-transform duration-300 ${active ? "translate-x-1" : "text-slate-300"}`} />
      </div>
    </div>
  );
}

// ==========================================
// CORE METODOLOGI PAGE MAIN EXPORT
// ==========================================
export default function MetodologiPage() {
  const [activeStep, setActiveStep] = useState<StepKey>(0);

  return (
    <div className="min-h-screen pb-24 bg-[#fafafa] overflow-x-hidden antialiased">
      {/* HEADER SECTION */}
      <section className="relative px-6 pt-16 md:pt-24 pb-8 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(circle_at_80%_20%,rgba(45,212,191,0.08),transparent_40%)] pointer-events-none" />

        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            <Zap size={12} className="text-teal-400 fill-teal-400" />
            National Championship Showcase
          </div>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] mb-6">
            Metodologi Konversi
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600">
              Siber-Ke-Karbon
            </span>
          </h1>

          <p className="text-base text-slate-500 mb-8 max-w-xl leading-relaxed">
            Inovasi kalkulator jejak karbon digital berbasis *Data Stream Math Mapping*. Mengukur emisi dari setiap bita aktivitas virtual Anda secara presisi dari hulu perangkat hingga hilir pembangkit listrik makro bumi.
          </p>

          {/* Quick Jump Stage Tab */}
          <div className="flex gap-2 max-w-md bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
            {(["01. Hulu Data", "02. Proses Jaringan", "03. Hilir Emisi"] as const).map((label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveStep(idx as StepKey)}
                className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeStep === idx ? "bg-white text-slate-900 shadow-md scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* COMPREHENSIVE 3D VIEWPORT CONTAINER */}
        <div className="relative w-full h-[500px] md:h-[540px] flex items-center justify-center">
          <div className="absolute inset-0 rounded-[48px] bg-gradient-to-tr from-slate-200/40 to-slate-100/10 p-[1px] shadow-2xl">
            <div className="w-full h-full bg-white rounded-[47px] overflow-hidden relative">
              
              {/* R3F Canvas */}
              <div className="absolute inset-0 cursor-grab active:cursor-grabbing z-10">
                <Canvas dpr={[1, 2]} camera={{ position: [-4.2, 0.3, 4.8], fov: 40 }}>
                  <ScrollControls pages={3} distance={0.8} horizontal damping={0.3}>
                    <CinematicScrollScene activeStep={activeStep} setActiveStep={setActiveStep} />
                  </ScrollControls>
                </Canvas>
              </div>

              {/* Floating Interactive Badge HUD */}
              <div className="absolute top-6 left-6 z-20 pointer-events-none bg-slate-900/5 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-900/5">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                  Live Engine Active // Swipe Viewport
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE TIER HIGH LEVEL INTERACTIVE CARDS */}
      <section className="max-w-7xl mx-auto px-6 mt-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PremiumStepCard
            index="01"
            subtitle="Ingress // Bit Stream"
            title="Aktivitas Penjelajahan"
            description="Setiap megabita data dari interaksi layar gawai diubah ke bentuk request paket data siber kontinu yang meluncur ke internet."
            formula="Data Paket = Vol (MB) × Waktu (s)"
            icon={<Smartphone size={24} />}
            accentColor="bg-blue-600"
            borderColor="border-blue-400"
            active={activeStep === 0}
            onClick={() => setActiveStep(0)}
          />

          <PremiumStepCard
            index="02"
            subtitle="Processing // Compute"
            title="Beban Kerja Server"
            description="Paket data diterima pusat server komputasi awan. Server memakan daya listrik dinamis murni guna mendinginkan core prosesor inti."
            formula="Energi (kWh) = Data (GB) × PUE Data Center"
            icon={<Server size={24} />}
            accentColor="bg-teal-500"
            borderColor="border-teal-400"
            active={activeStep === 1}
            onClick={() => setActiveStep(1)}
          />

          <PremiumStepCard
            index="03"
            subtitle="Egress // Carbonization"
            title="Emisi Konversi Gas"
            description="Daya listrik dikonversikan dengan indeks intensitas karbon grid regional lokal guna merangkum berat emisi gas rumah kaca."
            formula="CO2e (g) = Energi (kWh) × Faktor Emisi"
            icon={<Leaf size={24} />}
            accentColor="bg-emerald-500"
            borderColor="border-emerald-400"
            active={activeStep === 2}
            onClick={() => setActiveStep(2)}
          />
        </div>
      </section>

      {/* METRIC SPECS BOARD FOR NATIONAL JUDGES */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 text-teal-400 font-mono text-xs tracking-widest uppercase mb-3">
                <Layers size={16} /> Technical Spec Standard
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">
                Metodologi Akurasi Tinggi Sesuai Standar Global GHG Protocol
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-0">
                Formula matematika pengukur jejak siber kami mengadopsi koefisien mutakhir dari basis data sains terbuka industri lingkungan hidup global. Hal ini memastikan integritas aplikasi buatan kami bernilai jual tinggi saat dipresentasikan di depan dewan juri tingkat nasional.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <Cpu size={20} className="text-cyan-400 mb-2" />
                <div className="text-xl font-bold font-mono">Real-Time</div>
                <div className="text-[11px] text-slate-400">Stream Processing Matrix</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <TrendingUp size={20} className="text-emerald-400 mb-2" />
                <div className="text-xl font-bold font-mono">99.8%</div>
                <div className="text-[11px] text-slate-400">Akurasi Formula Ilmiah</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}