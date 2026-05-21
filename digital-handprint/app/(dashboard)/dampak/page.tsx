"use client";

import { motion, Variants } from "framer-motion";
import { 
  TreePine, Cloud, Plane, Droplet, 
  Smartphone, MonitorPlay, Mail, AlertTriangle, 
  Globe2, ArrowRight, Wind, Server
} from "lucide-react";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

// --- ANIMASI UTILITY 3D (FLUID SPRING POP-UP) ---
function PopUp3D({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [startAnimating, setStartAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartAnimating(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetScale = startAnimating ? 1 : 0;
      const smoothScale = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 8, delta);
      groupRef.current.scale.set(smoothScale, smoothScale, smoothScale);
    }
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>
      {children}
    </group>
  );
}

// --- KOMPONEN UTAMA 3D: FLOATING ECO-DIGITAL ISLAND ---
function EcoDigitalIsland() {
  const islandRef = useRef<THREE.Group>(null);
  const turbineBladesRef = useRef<THREE.Mesh>(null);

  // Animasi Mengapung & Rotasi Lambat Idle
  useFrame(({ clock }) => {
    if (islandRef.current) {
      islandRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (turbineBladesRef.current) {
      // Kincir angin berputar konstan mewakili energi terbarukan
      turbineBladesRef.current.rotation.z = clock.getElapsedTime() * 1.5;
    }
  });

  // Konstruksi Server Blinking Lights (Indikator Data Center Emisi)
  const serverLights = useMemo(() => {
    return [...Array(6)].map((_, i) => ({
      position: [
        -0.4 + (i % 2) * 0.15, 
        0.3 + Math.floor(i / 2) * 0.2, 
        0.51
      ] as [number, number, number],
      color: i % 3 === 0 ? "#ef4444" : "#10b981" // Merah (Beban) & Hijau (Eco)
    }));
  }, []);

  return (
    <group ref={islandRef} position={[0, -0.2, 0]}>
      
      {/* 1. BASE ISLAND (Heksagonal Low-Poly Platform) */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2, 2.2, 0.4, 6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} flatShading />
      </mesh>
      
      {/* Lapisan Rumput Sisi Alam */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[1.95, 1.95, 0.4, 6]} />
        <meshStandardMaterial color="#10b981" roughness={0.9} flatShading />
      </mesh>

      {/* Lapisan Aspal/Server Sisi Digital (Kontras Grid Geometri) */}
      <mesh position={[-0.5, 0.23, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.02, 1.4]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* ================= SISI DIGITAL: SERVER CLUSTER ================= */}
      <group position={[-0.5, 0.25, 0.4]}>
        <PopUp3D delay={0.2}>
          {/* Rak Server Utama */}
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[0.8, 1.0, 0.8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.2} />
          </mesh>
          {/* Neon Glow Data Bar */}
          <mesh position={[0, 0.5, 0.41]}>
            <boxGeometry args={[0.6, 0.04, 0.02]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} />
          </mesh>
          {/* Lampu Indikator Kedip */}
          {serverLights.map((light, idx) => (
            <mesh key={idx} position={light.position}>
              <sphereGeometry args={[0.025, 4, 4]} />
              <meshStandardMaterial color={light.color} emissive={light.color} emissiveIntensity={0.8} />
            </mesh>
          ))}
        </PopUp3D>
      </group>

      {/* ================= SISI ALAM: GREEN ENERGY & VEGETASI ================= */}
      {/* Kincir Angin (Wind Turbine) */}
      <group position={[0.8, 0.2, -0.6]}>
        <PopUp3D delay={0.4}>
          {/* Tiang Utama */}
          <mesh castShadow position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 1.6, 6]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          {/* Kepala Generator */}
          <mesh position={[0, 1.6, 0.08]} castShadow>
            <boxGeometry args={[0.1, 0.1, 0.2]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
          {/* Baling-Baling Generator */}
          <group position={[0, 1.6, 0.19]}>
            <mesh ref={turbineBladesRef} castShadow>
              <boxGeometry args={[1.2, 0.06, 0.02]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
              {/* Tambahan cross blade untuk estetik low poly */}
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[1.2, 0.06, 0.02]} />
                <meshStandardMaterial color="#ffffff" roughness={0.4} />
              </mesh>
            </mesh>
          </group>
        </PopUp3D>
      </group>

      {/* Cluster Pohon Makro */}
      <group position={[0.8, 0.2, 0.6]}>
        <PopUp3D delay={0.6}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.05, 0.2, 4]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <coneGeometry args={[0.2, 0.4, 5]} />
            <meshStandardMaterial color="#047857" flatShading roughness={0.7} />
          </mesh>
        </PopUp3D>
      </group>

      <group position={[1.3, 0.2, 0.1]}>
        <PopUp3D delay={0.7}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.04, 0.16, 4]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          <mesh position={[0, 0.28, 0]} castShadow>
            <coneGeometry args={[0.15, 0.32, 5]} />
            <meshStandardMaterial color="#065f46" flatShading roughness={0.7} />
          </mesh>
        </PopUp3D>
      </group>

    </group>
  );
}

// --- MAIN PAGE COMPONENT WITH SMOOTH SPRING ORCHESTRATION ---
export default function DampakPage() {
  // Master Spring Configuration untuk Transisi UI yang sangat Halus & Membal
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.94, y: 35 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 120, damping: 16, mass: 0.9 } 
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans overflow-hidden">
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        
        {/* HERO SECTION DENGAN KANVAS PULAU DIGITAL 3D */}
        <section className="relative px-6 pt-12 md:pt-20 pb-16 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">
          
          {/* KIRI: Blok Konten Teks */}
          <div className="order-last lg:order-first z-10">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              <Globe2 size={16} className="text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} />
              Realita Internet Kita
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6">
              Jejak Tak Terlihat <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                Berdampak Nyata.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
              Internet menyumbang sekitar 4% dari total emisi gas rumah kaca global—lebih besar dari industri penerbangan sipil. Mari lihat dampak nyata dari kebiasaan digital kita.
            </motion.p>
          </div>

          {/* KANAN: Kontainer Kanvas Real 3D Studio */}
          <motion.div variants={itemVariants} className="relative w-full h-[400px] md:h-[480px] flex items-center justify-center order-first lg:order-last cursor-grab active:cursor-grabbing">
            {/* Ambient Atmosphere Radial Background */}
            <div className="absolute w-80 h-80 bg-emerald-200/40 rounded-full blur-[100px] -z-10" />

            <div className="w-full h-full">
              <Canvas camera={{ position: [3.2, 3.2, 4.2], fov: 45 }} shadows>
                {/* Sistem Pencahayaan Studio Tingkat Lanjut */}
                <ambientLight intensity={0.6} />
                <hemisphereLight groundColor="#1e293b" intensity={0.4} />
                <directionalLight 
                  position={[5, 8, 5]} 
                  intensity={1.5} 
                  castShadow 
                  shadow-mapSize={[1024, 1024]} 
                />
                <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#06b6d4" />

                <Suspense fallback={null}>
                  <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                    <EcoDigitalIsland />
                  </Float>
                </Suspense>
                
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.8}
                />
              </Canvas>
            </div>
          </motion.div>
        </section>

        {/* INFOGRAFIS 1: FAKTA INTERNET (STAGGERED POP-UP CARDS) */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Fakta Internet Global</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Angka di balik layar layar gawai Anda.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MonitorPlay, color: "group-hover:bg-teal-500 group-hover:text-teal-600", val: "60%", desc: "Dari seluruh lalu lintas internet global digunakan semata-mata untuk <strong>Video Streaming</strong> (Netflix, YouTube, dll)." },
              { icon: Globe2, color: "group-hover:bg-emerald-500 group-hover:text-emerald-600", val: "Top 4", desc: "Jika internet adalah sebuah negara, ia akan menjadi <strong>penyumbang polusi terbesar ke-4</strong> di dunia, tepat di bawah India." },
              { icon: Mail, color: "group-hover:bg-blue-500 group-hover:text-blue-600", val: "50g", desc: "Adalah jumlah emisi CO₂ rata-rata dari <strong>satu email dengan lampiran foto besar</strong>. Bayangkan dikalikan miliaran email per hari." }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 text-slate-50/70 group-hover:scale-110 transition-transform duration-500 z-0 pointer-events-none">
                  <card.icon size={130} />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-teal-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-600 mb-6 transition-colors duration-300">
                    <card.icon size={24} />
                  </div>
                  <h3 className="text-4xl font-black text-slate-800 mb-2 transition-colors">{card.val}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: card.desc }} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* INFOGRAFIS 2: EKUIVALENSI (PERBANDINGAN VISUAL DENGAN INTERAKSI SPRING) */}
        <section className="bg-white py-20 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Apa Artinya 1 Ton CO₂ Digital?</h2>
              <p className="text-slate-500">Menganalogikan data maya ke dalam bentuk fisik agar mudah dipahami.</p>
            </motion.div>

            <div className="flex flex-col gap-6">
              {[
                { icon: Plane, color: "bg-blue-50 text-blue-500", hover: "hover:border-teal-200", title: "1 Penerbangan Paris - New York", desc: "Konsumsi energi server setara dengan bahan bakar satu penumpang pesawat rute trans-atlantik." },
                { icon: TreePine, color: "bg-emerald-50 text-emerald-500", hover: "hover:border-emerald-200", title: "Butuh 50 Pohon Dewasa", desc: "Dibutuhkan 50 pohon yang tumbuh selama satu tahun penuh hanya untuk menyerap emisi tersebut." }
              ].map((row, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className={`flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 ${row.hover} transition-all duration-300`}
                >
                  <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center p-4 shrink-0">
                    <div className="text-4xl font-black text-slate-800">1 Ton</div>
                    <div className="text-sm text-slate-500 font-semibold mt-1">Karbon Digital</div>
                  </div>
                  <div className="hidden md:flex items-center text-slate-300"><ArrowRight size={32}/></div>
                  <div className="w-full md:w-2/3 flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm">
                    <div className={`w-16 h-16 rounded-full ${row.color} flex items-center justify-center shrink-0`}>
                      <row.icon size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{row.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{row.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </motion.div>
    </div>
  );
}