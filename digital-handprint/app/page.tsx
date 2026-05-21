"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Leaf, Shield, Globe, 
  Server, CloudFog, MailWarning, Tv2
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
      const smoothScale = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 10, delta);
      groupRef.current.scale.set(smoothScale, smoothScale, smoothScale);
    }
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>
      {children}
    </group>
  );
}

// --- UTILS: MATEMATIKA ORIENTASI PERMUKAAN BOLA ---
function OrientToNormal({ position, children, scale = 1 }: { position: [number, number, number], children: React.ReactNode, scale?: number }) {
  const pos = useMemo(() => new THREE.Vector3(...position), [position]);
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
    return q;
  }, [pos]);

  return (
    <group position={pos} quaternion={quat} scale={scale}>
      {children}
    </group>
  );
}

// --- DETEKTOR BENUA DUNIA NYATA ---
function checkIsRealContinent(lat: number, lon: number): { isLand: boolean; type: "forest" | "mountain" | "plain" } {
  let isLand = false;
  if (lat < -60) isLand = true; 
  else if (lat > -42 && lat < -10 && lon > 112 && lon < 154) isLand = true; 
  else if (lat > 12 && lat < 72 && lon > -168 && lon < -52) isLand = true; 
  else if (lat > -55 && lat <= 12 && lon > -82 && lon < -34) isLand = true; 
  else if (lat > -34 && lat <= 37 && lon > -17 && lon < 51) isLand = true; 
  else if (lat > 10 && lat < 75 && lon > -10 && lon < 145) isLand = true; 
  else if (lat > -10 && lat < 8 && lon > 95 && lon < 141) isLand = true; 

  if (!isLand) return { isLand: false, type: "plain" };

  const rand = Math.random();
  if ((lat > 35 && lat < 55 && rand > 0.6) || (lat > -30 && lat < -10 && rand > 0.7)) {
    return { isLand: true, type: "mountain" }; 
  }
  if (lat > -15 && lat < 25) {
    return { isLand: true, type: "forest" }; 
  }
  return { isLand: true, type: rand > 0.5 ? "forest" : "plain" };
}

// --- KOMPONEN BUMI LOW-POLY AKURAT ---
function LowPolyEarth() {
  const earthRef = useRef<THREE.Group>(null);
  const EARTH_RADIUS = 1.8;

  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.08;
      earthRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.05;
    }
  });

  const earthElements = useMemo(() => {
    const elements: React.ReactNode[] = [];
    const totalSamples = 450; 

    for (let i = 0; i < totalSamples; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const lat = 90.0 - (phi * 180.0 / Math.PI);
      const lon = (theta * 180.0 / Math.PI) - 180.0;

      const biome = checkIsRealContinent(lat, lon);

      if (biome.isLand) {
        const x = EARTH_RADIUS * Math.sin(phi) * Math.cos(theta);
        const y = EARTH_RADIUS * Math.cos(phi);
        const z = EARTH_RADIUS * Math.sin(phi) * Math.sin(theta);
        const pos: [number, number, number] = [x, y, z];
        const delayEffect = Math.random() * 0.8; 

        elements.push(
          <OrientToNormal key={`land-${i}`} position={pos} scale={0.4 + Math.random() * 0.3}>
            <PopUp3D delay={delayEffect}>
              <mesh receiveShadow castShadow position={[0, -0.05, 0]}>
                <dodecahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial 
                  color={lat < -60 ? "#f8fafc" : biome.type === "forest" ? "#059669" : "#10b981"} 
                  roughness={0.9} 
                  flatShading 
                />
              </mesh>
            </PopUp3D>
          </OrientToNormal>
        );

        if (biome.type === "mountain") {
          elements.push(
            <OrientToNormal key={`mountain-${i}`} position={pos} scale={0.3 + Math.random() * 0.3}>
              <PopUp3D delay={delayEffect + 0.2}>
                <group position={[0, 0.1, 0]}>
                  <mesh castShadow receiveShadow>
                    <coneGeometry args={[0.2, 0.5, 4]} />
                    <meshStandardMaterial color="#64748b" roughness={0.8} flatShading />
                  </mesh>
                  <mesh position={[0, 0.2, 0]}>
                    <coneGeometry args={[0.1, 0.16, 4]} />
                    <meshStandardMaterial color="#ffffff" roughness={1} flatShading />
                  </mesh>
                </group>
              </PopUp3D>
            </OrientToNormal>
          );
        }

        if (biome.type === "forest" && Math.random() > 0.4 && lat > -60) {
          elements.push(
            <OrientToNormal key={`tree-${i}`} position={pos} scale={0.3 + Math.random() * 0.4}>
              <PopUp3D delay={delayEffect + 0.1}>
                <group position={[0, 0.05, 0]}>
                  <mesh castShadow position={[0, 0.05, 0]}>
                    <cylinderGeometry args={[0.02, 0.04, 0.12, 4]} />
                    <meshStandardMaterial color="#451a03" roughness={1} />
                  </mesh>
                  <mesh castShadow position={[0, 0.16, 0]}>
                    <coneGeometry args={[0.12, 0.22, 5]} />
                    <meshStandardMaterial color="#047857" roughness={0.6} flatShading />
                  </mesh>
                </group>
              </PopUp3D>
            </OrientToNormal>
          );
        }
      }
    }
    return elements;
  }, []);

  return (
    <group ref={earthRef}>
      <mesh receiveShadow>
        <icosahedronGeometry args={[EARTH_RADIUS, 4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.1} flatShading />
      </mesh>
      {earthElements}
      <group>
        {[...Array(6)].map((_, i) => (
          <GlobeCloud key={`cloud-${i}`} yOffset={(Math.random() - 0.5) * 1.8} speed={0.15 + i * 0.05} startAngle={i * (Math.PI / 3)} />
        ))}
      </group>
    </group>
  );
}

function GlobeCloud({ yOffset, speed, startAngle }: { yOffset: number, speed: number, startAngle: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * speed + startAngle;
    }
  });

  return (
    <group ref={groupRef}>
      <group position={[2.3, yOffset, 0]} scale={0.7}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 5, 5]} />
          <meshStandardMaterial color="#ffffff" opacity={0.9} transparent flatShading />
        </mesh>
      </group>
    </group>
  );
}

// --- MAIN LANDING PAGE WITH PREMIUM ANIMATIONS ---
export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92, y: 30 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 140, damping: 16 } 
    },
  };

  // ✅ FIXED: Mengubah "visible" menjadi "show" agar sinkron dengan itemVariants
  const scrollRevealVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, y: 0, 
      transition: { type: "spring", stiffness: 80, damping: 20, staggerChildren: 0.15 } 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-teal-200 selection:text-teal-900 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-32 flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div variants={itemVariants} className="relative w-full h-[450px] lg:h-[550px] flex items-center justify-center order-last lg:order-first">
            <div className="absolute w-85 h-85 bg-teal-300/30 rounded-full blur-[120px] -z-10" />

            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} shadows>
                <ambientLight intensity={0.6} />
                <hemisphereLight groundColor="#0f172a" intensity={0.5} />
                <directionalLight position={[6, 12, 6]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
                <directionalLight position={[-6, 6, -6]} intensity={0.4} color="#38bdf8" />

                <Suspense fallback={null}>
                  <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.25}>
                    <LowPolyEarth />
                  </Float>
                </Suspense>
                
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.6} />
              </Canvas>
            </div>

            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-4 lg:left-10 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md text-emerald-500 border border-slate-100 pointer-events-none">
              <Leaf size={24} />
            </motion.div>
            <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-20 right-4 lg:right-10 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-md text-teal-500 border border-slate-100 pointer-events-none">
              <Globe size={24} />
            </motion.div>
          </motion.div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left z-10">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Gerakan Digital Handprint
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Kecilkan Jejak <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-400">
                Digitalmu.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
              Dunia maya tidak mengambang di awan. Ia hidup di server fisik yang terus menyala. Pahami dampaknya dan selamatkan bumi lewat kebiasaan digitalmu.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link href="/komitmen">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full group flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-teal-600/20 transition-colors">
                  Buat Komitmen
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </motion.div>

      {/* 2. THE HOOK: BENTO GRID EDUKASI (Progressive Disclosure) */}
      <section className="py-20 relative bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
              Realitas di Balik Layar Kaca
            </h2>
            <p className="text-slate-500 max-w-2xl text-lg">
              Setiap kali kita memutar video, mengirim email, atau menyimpan foto di cloud, ada server raksasa yang bekerja keras memprosesnya.
            </p>
          </motion.div>

          <motion.div 
            variants={scrollRevealVariants}
            initial="hidden"
            whileInView="show" // ✅ FIXED: Mengubah "visible" menjadi "show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {/* Bento Card 1 - Main Info */}
            <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors duration-700" />
              <Server className="text-teal-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Infrastruktur Tak Kasat Mata</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                Internet menyumbang sekitar <strong className="text-teal-300">3.7% dari emisi gas rumah kaca global</strong>. Angka ini setara dengan emisi dari seluruh industri penerbangan komersial di dunia.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-teal-200 bg-teal-900/40 px-4 py-2 rounded-full backdrop-blur-sm border border-teal-800/50">
                <Shield size={16} /> Butuh pendingin ekstra 24/7
              </div>
            </motion.div>

            {/* Bento Card 2 - Video Streaming */}
            <motion.div variants={itemVariants} className="bg-teal-50 border border-teal-100 p-8 rounded-[2rem] group hover:shadow-lg transition-shadow">
              <Tv2 className="text-teal-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="text-lg font-bold text-slate-800 mb-2">Streaming 1 Jam</h4>
              <p className="text-slate-500 text-sm mb-4">Menonton dalam resolusi tinggi memakan banyak bandwidth.</p>
              <div className="text-3xl font-black text-teal-700">~55g <span className="text-base font-medium text-slate-500">CO₂</span></div>
            </motion.div>

            {/* Bento Card 3 - Cloud & Email */}
            <motion.div variants={itemVariants} className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] group hover:shadow-lg transition-shadow">
              <MailWarning className="text-slate-700 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="text-lg font-bold text-slate-800 mb-2">Email Mengendap</h4>
              <p className="text-slate-500 text-sm mb-4">1 Email biasa tanpa lampiran yang terus tersimpan di server.</p>
              <div className="text-3xl font-black text-slate-700">0.3g <span className="text-base font-medium text-slate-500">CO₂ / email</span></div>
            </motion.div>

            {/* Bento Card 4 - Action Bridge */}
            <motion.div variants={itemVariants} className="md:col-span-2 bg-emerald-500 p-8 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
               <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12">
                  <CloudFog size={150} />
               </div>
               <div className="z-10 text-center sm:text-left">
                 <h3 className="text-2xl font-bold mb-2">Siap Melakukan Perubahan?</h3>
                 <p className="text-emerald-100">Langkah kecilmu menyehatkan paru-paru bumi.</p>
               </div>
               <Link href="/komitmen" className="z-10">
                 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-slate-900 text-white whitespace-nowrap px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-black transition-colors">
                   Coba Simulasi 3D
                 </motion.button>
               </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
