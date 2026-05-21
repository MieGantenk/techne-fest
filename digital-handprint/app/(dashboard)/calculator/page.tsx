"use client";

import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Tv, Mail, Smartphone, Plus, Minus, Zap, BarChart3, TreePine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

// --- ANIMASI UTILITY 3D (POP-UP) ---
// Komponen ini membuat children di dalamnya membesar dari skala 0 ke 1 dengan halus
function PopUp3D({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Menggunakan interpolasi damp untuk efek pergerakan yang mulus (seperti spring)
      const targetScale = 1;
      const smoothScale = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 12, delta);
      groupRef.current.scale.set(smoothScale, smoothScale, smoothScale);
    }
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>
      {children}
    </group>
  );
}

// --- KOMPONEN LINGKUNGAN DETAIL ---
function Cloud3D({ position, scale = 1, color = "#ffffff", speed = 0.2 }: { position: [number, number, number], scale?: number, color?: string, speed?: number }) {
  const cloudRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (cloudRef.current) {
      cloudRef.current.position.x = position[0] + Math.sin(clock.elapsedTime * speed) * 0.5;
      cloudRef.current.rotation.y = clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={cloudRef} position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.2, 7, 7]} />
        <meshStandardMaterial color={color} roughness={1} flatShading />
      </mesh>
      <mesh position={[0.15, -0.05, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 7, 7]} />
        <meshStandardMaterial color={color} roughness={1} flatShading />
      </mesh>
      <mesh position={[-0.15, -0.05, -0.05]} castShadow>
        <sphereGeometry args={[0.18, 7, 7]} />
        <meshStandardMaterial color={color} roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function Rock3D({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <mesh position={position} scale={[scale, scale, scale]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial color="#94a3b8" roughness={0.8} flatShading />
    </mesh>
  );
}

// --- KOMPONEN POHON 3D ---
function Tree3D({ position, color, scale = 1 }: { position: [number, number, number]; color: string, scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.1, 0.5, 5]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.3, 0.7, 6]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>
    </group>
  );
}

// --- KOMPONEN KEHIDUPAN (Burung, Hewan, Pekerja) ---
function Bird3D({ radius, speed, height, offset }: { radius: number, speed: number, height: number, offset: number }) {
  const birdRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (birdRef.current) {
      const t = clock.elapsedTime * speed + offset;
      birdRef.current.position.x = Math.cos(t) * radius;
      birdRef.current.position.z = Math.sin(t) * radius;
      birdRef.current.position.y = height + Math.sin(t * 5) * 0.1;
      birdRef.current.rotation.y = -t + Math.PI;
      birdRef.current.rotation.z = Math.sin(t * 15) * 0.2;
    }
  });

  return (
    <group ref={birdRef}>
      <mesh castShadow>
        <coneGeometry args={[0.03, 0.1, 3]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

function Animal3D({ radius, speed, color, offset }: { radius: number, speed: number, color: string, offset: number }) {
  const animalRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (animalRef.current) {
      const t = (clock.elapsedTime * speed) + offset;
      animalRef.current.position.x = Math.cos(t) * radius;
      animalRef.current.position.z = Math.sin(t) * radius;
      animalRef.current.position.y = 0.45 + Math.abs(Math.sin(t * 10)) * 0.12;
      animalRef.current.rotation.y = -t + Math.PI;
    }
  });

  return (
    <group ref={animalRef}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.12, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Worker3D({ start, end, speed, delay, color = "#2563eb" }: { start: [number, number, number], end: [number, number, number], speed: number, delay: number, color?: string }) {
  const workerRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (workerRef.current) {
      const t = clock.elapsedTime * speed + delay;
      const pingPong = (Math.sin(t) + 1) / 2; 
      workerRef.current.position.x = THREE.MathUtils.lerp(start[0], end[0], pingPong);
      workerRef.current.position.z = THREE.MathUtils.lerp(start[2], end[2], pingPong);
      workerRef.current.position.y = start[1] + Math.abs(Math.sin(t * 12)) * 0.04;

      const isGoingForward = Math.cos(t) > 0;
      workerRef.current.rotation.y = isGoingForward 
        ? Math.atan2(end[0] - start[0], end[2] - start[2])
        : Math.atan2(start[0] - end[0], start[2] - end[2]);
    }
  });

  return (
    <group ref={workerRef}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.08, 0.18, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#eab308" flatShading />
      </mesh>
    </group>
  );
}

// --- KOMPONEN PABRIK & GEDUNG ---
function Factory3D({ position, scale = 1, smogColor = "#94a3b8" }: { position: [number, number, number], scale?: number, smogColor?: string }) {
  const smokeRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (smokeRef.current) {
      smokeRef.current.children.forEach((particle) => {
        particle.position.y += 0.015 * scale;
        particle.position.x += (Math.random() - 0.5) * 0.01;
        if (particle.position.y > 1.8 * scale) {
          particle.position.y = 0.7 * scale;
          particle.position.x = (Math.random() - 0.5) * 0.1 * scale;
        }
      });
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.6, 0.15]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <group ref={smokeRef}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 0.1, 0.7 + i * 0.2, (Math.random() - 0.5) * 0.1]}>
            <sphereGeometry args={[0.15, 5, 5]} />
            <meshStandardMaterial color={smogColor} transparent opacity={0.4} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function OfficeBuilding3D({ position, height, lightColor = "#fbbf24" }: { position: [number, number, number], height: number, lightColor?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2 + 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, height, 0.35]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.5} flatShading />
      </mesh>
      <mesh position={[0, height / 2 + 0.4, 0.176]}>
        <planeGeometry args={[0.15, height * 0.8]} />
        <meshBasicMaterial color={lightColor} wireframe />
      </mesh>
    </group>
  );
}

// --- CORE LINGKUNGAN PULAU 3D ---
function FloatingIsland3D({ envState }: { envState: "lush" | "struggling" | "damaged" }) {
  const islandRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (islandRef.current) islandRef.current.rotation.y += 0.0015;
  });

  const groundColor = envState === "lush" ? "#10b981" : envState === "struggling" ? "#d97706" : "#374151";
  const waterColor = envState === "lush" ? "#0ea5e9" : envState === "struggling" ? "#0369a1" : "#020617";
  const waterOpacity = envState === "lush" ? 0.7 : 0.9;

  return (
    <group ref={islandRef} position={[0, -0.5, 0]}>
      {/* TANAH & LAUT (Tidak ikut pop-up ulang agar transisi mulus) */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.6, 0.8, 12]} />
        <meshStandardMaterial color={groundColor} roughness={1} flatShading />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
        <ringGeometry args={[2.2, 3.5, 24]} />
        <meshStandardMaterial color={waterColor} transparent opacity={waterOpacity} roughness={0.1} metalness={0.3} />
      </mesh>

      {/* --- STATE: LESTARI --- */}
      {envState === "lush" && (
        <PopUp3D key="lush-state">
          <Tree3D position={[-0.6, 0.4, 0.5]} color="#047857" scale={1.2} />
          <Tree3D position={[0.5, 0.4, -0.8]} color="#059669" />
          <Tree3D position={[-0.8, 0.4, -0.5]} color="#10b981" scale={0.8} />
          <Tree3D position={[0.8, 0.4, 0.6]} color="#34d399" scale={0.9} />
          <Tree3D position={[0.2, 0.4, -1.2]} color="#047857" scale={1.1} />
          
          <Rock3D position={[-1.2, 0.45, 0.2]} scale={1.5} />
          <Rock3D position={[1.0, 0.42, -0.2]} scale={1} />
          
          <Cloud3D position={[-1.5, 2, -1]} scale={1.2} />
          <Cloud3D position={[1.5, 2.5, 1]} scale={0.8} />

          <Animal3D radius={1.2} speed={0.5} color="#ffffff" offset={0} />
          <Animal3D radius={1.6} speed={0.4} color="#fef08a" offset={Math.PI} />
          <Animal3D radius={0.9} speed={0.6} color="#ffedd5" offset={Math.PI / 2} />
          
          <Bird3D radius={2.5} speed={0.3} height={2} offset={0} />
          <Bird3D radius={2.4} speed={0.3} height={2.1} offset={0.2} />
          <Bird3D radius={2.6} speed={0.3} height={1.9} offset={0.4} />
        </PopUp3D>
      )}

      {/* --- STATE: TERTEKAN --- */}
      {envState === "struggling" && (
        <PopUp3D key="struggling-state">
          <Tree3D position={[-0.6, 0.4, 0.5]} color="#b45309" scale={1} />
          <Tree3D position={[0.7, 0.4, 0.6]} color="#d97706" scale={0.8} />
          <Rock3D position={[-1.2, 0.45, 0.2]} scale={1.5} />
          
          <Factory3D position={[0.2, 0.4, -0.5]} />
          
          <Cloud3D position={[0, 2, 0]} scale={1.5} color="#cbd5e1" speed={0.1} />

          <Worker3D start={[0.5, 0.4, -0.2]} end={[1.5, 0.4, 0.5]} speed={1} delay={0} />
          <Worker3D start={[-0.2, 0.4, -0.8]} end={[-1.2, 0.4, -0.2]} speed={1.2} delay={2} />
          <Worker3D start={[0.8, 0.4, 0.2]} end={[0.2, 0.4, 0.8]} speed={0.8} delay={1} color="#ef4444" />
        </PopUp3D>
      )}

      {/* --- STATE: HANCUR --- */}
      {envState === "damaged" && (
        <PopUp3D key="damaged-state">
          <mesh position={[-0.6, 0.45, 0.5]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.15, 4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          <Factory3D position={[-0.4, 0.4, 0.3]} scale={1.2} smogColor="#475569" />
          <Factory3D position={[0.6, 0.4, -0.6]} scale={1} smogColor="#334155" />
          <Factory3D position={[-1.0, 0.4, -0.5]} scale={0.9} smogColor="#1e293b" />
          
          <OfficeBuilding3D position={[1.3, 0, 0.2]} height={1.8} lightColor="#ef4444" />
          <OfficeBuilding3D position={[-0.6, 0, 1.2]} height={1.4} lightColor="#ef4444" />
          <OfficeBuilding3D position={[0.4, 0, 1.4]} height={2.2} />
          
          <Cloud3D position={[-1, 1.8, -1]} scale={2} color="#475569" speed={0.05} />
          <Cloud3D position={[1, 2.2, 1]} scale={1.5} color="#334155" speed={0.08} />
          
          <Worker3D start={[0, 0.4, 0]} end={[1.5, 0.4, 1.5]} speed={0.5} delay={0} color="#64748b" />
        </PopUp3D>
      )}
    </group>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function CalculatorPage() {
  const [data, setData] = useState({ streaming: 0, emails: 0, scrolling: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const totalCo2 = (data.streaming * 100) + (data.emails * 4) + (data.scrolling * 50);
  const pohonDibutuhkan = Math.ceil(totalCo2 / 60);

  const chartData = [
    { name: "Streaming", CO2: data.streaming * 100, color: "#2dd4bf" },
    { name: "Email", CO2: data.emails * 4, color: "#34d399" },
    { name: "Medsos", CO2: data.scrolling * 50, color: "#10b981" },
  ];

  const updateData = (key: keyof typeof data, increment: number, max: number) => {
    setData((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(max, prev[key] + increment)),
    }));
  };

  const getEnvironmentState = (): "lush" | "struggling" | "damaged" => {
    if (totalCo2 < 500) return "lush";
    if (totalCo2 < 1800) return "struggling";
    return "damaged";
  };

  const envState = getEnvironmentState();

  const envTexts = {
    lush: { text: "Ekosistem Lestari", desc: "Kadar emisi rendah. Pulau hidup dengan subur, udara bersih, dan kehidupan berkembang.", color: "text-emerald-600", bg: "bg-emerald-50" },
    struggling: { text: "Ekosistem Tertekan", desc: "Emisi meningkat tajam. Suhu naik, pabrik mulai mengambil alih lahan hijau.", color: "text-amber-600", bg: "bg-amber-50" },
    damaged: { text: "Ekosistem Hancur", desc: "Krisis Iklim! Pulau tertutup polusi pekat, alam mati digantikan industri berat.", color: "text-rose-600", bg: "bg-rose-50" }
  };

  const infoVisual = envTexts[envState];

  // VARIANT ANIMASI MUNCUL UNTUK UI
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 250, damping: 20 } 
    }
  };

  const InteractiveCard = ({ title, icon: Icon, value, max, unit, dataKey }: any) => {
    const progress = (value / max) * 100;
    return (
      <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="relative bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group">
        <div className="absolute bottom-0 left-0 w-full bg-teal-50/40 -z-10 transition-all duration-500 ease-out" style={{ height: `${progress}%` }} />
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <div className="p-3 bg-white shadow-sm rounded-xl text-teal-500 ring-1 ring-slate-100"><Icon size={20}/></div>
            {title}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => updateData(dataKey, -1, max)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-colors active:scale-95">
            <Minus size={18} />
          </button>
          <div className="text-center">
            <AnimatePresence mode="popLayout">
              <motion.span key={value} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="inline-block text-3xl font-black text-teal-700">
                {value}
              </motion.span>
            </AnimatePresence>
            <span className="text-slate-400 text-sm ml-1">{unit}</span>
          </div>
          <button onClick={() => updateData(dataKey, 1, max)} className="w-10 h-10 flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white rounded-full transition-colors active:scale-95 shadow-md shadow-teal-500/30">
            <Plus size={18} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-12 selection:bg-teal-100">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 bg-white p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-slate-100 items-center overflow-hidden">
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-500 ${infoVisual.bg} ${infoVisual.color}`}>
              ● {infoVisual.text}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Kalkulator Dampak <br />
              Jejak <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">Karbon Digital.</span>
            </h1>
            <p className="text-slate-500 text-base max-w-md leading-relaxed">
              {infoVisual.desc} Tambah atau kurangi aktivitas harianmu untuk mengontrol kondisi simulasi pulau 3D di samping.
            </p>
          </div>

          <div className="lg:col-span-6 h-72 md:h-80 w-full relative bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-2xl border border-slate-100 flex items-center justify-center cursor-grab active:cursor-grabbing">
            {mounted ? (
              <Canvas camera={{ position: [0, 2.5, 5], fov: 45 }} shadows>
                <ambientLight intensity={0.5} />
                <hemisphereLight groundColor="#000000" intensity={0.6} />
                <directionalLight 
                  position={[5, 10, 5]} 
                  intensity={1.5} 
                  castShadow 
                  shadow-mapSize={[1024, 1024]} 
                  shadow-camera-far={20}
                  shadow-camera-left={-5}
                  shadow-camera-right={5}
                  shadow-camera-top={5}
                  shadow-camera-bottom={-5}
                />
                
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                  <FloatingIsland3D envState={envState} />
                </Float>
                <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.1} />
              </Canvas>
            ) : (
              <div className="text-sm font-medium text-slate-400 animate-pulse">Memuat Grafis 3D Resolusi Tinggi...</div>
            )}
            <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-mono pointer-events-none bg-white/80 px-2 py-0.5 rounded-md border border-slate-100">
              ▲ Drag 3D untuk Orbit
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InteractiveCard title="Streaming Video" icon={Tv} value={data.streaming} max={24} unit="Jam" dataKey="streaming" />
            <InteractiveCard title="Kirim/Baca Email" icon={Mail} value={data.emails} max={100} unit="Email" dataKey="emails" />
            <InteractiveCard title="Media Sosial" icon={Smartphone} value={data.scrolling} max={24} unit="Jam" dataKey="scrolling" />
            
            <motion.div variants={itemVariants} className="bg-teal-600 text-white p-6 rounded-3xl flex items-center gap-4 shadow-lg shadow-teal-600/20">
              <Zap size={32} className="text-teal-200 shrink-0" />
              <p className="text-sm leading-relaxed font-medium">Tips: Menurunkan resolusi YouTube dari 4K ke 1080p dapat mengurangi emisi karbon hingga 75%.</p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
            <h2 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-500"/> Akumulasi Emisi Harian
            </h2>
            
            <div className="flex items-end gap-2 mb-8">
              <motion.span key={totalCo2} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-7xl font-black text-slate-800 tracking-tighter">
                {totalCo2}
              </motion.span>
              <span className="text-xl font-medium text-slate-400 mb-2">g CO2e</span>
            </div>

            <div className={`mt-0 mb-8 p-4 rounded-2xl flex items-start gap-3 border transition-colors ${infoVisual.bg} border-slate-100`}>
              <TreePine size={24} className="text-teal-500 shrink-0 mt-1"/> 
              <p className="text-sm leading-relaxed text-slate-600">
                Bumi membutuhkan sekitar <strong>{pohonDibutuhkan} pohon</strong> dewasa yang tumbuh selama setahun untuk menyerap emisi digital harianmu ini.
              </p>
            </div>
            
            <div className="h-56 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="CO2" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}