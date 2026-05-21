"use client";

import { useState, useRef, useMemo, useEffect, Suspense } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { 
  HeartHandshake, MailMinus, MonitorDown, PlayCircle, 
  Wifi, CloudOff, Bookmark, CheckCircle2, ArrowRight 
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles as DreiSparkles } from "@react-three/drei";
import * as THREE from "three";

// --- DATA OPSI KOMITMEN ---
const PLEDGE_OPTIONS = [
  { id: 1, title: "Hapus Email Sampah", desc: "Berhenti berlangganan newsletter yang tidak pernah dibaca untuk menghemat storage server.", icon: MailMinus, co2: 12 },
  { id: 2, title: "Turunkan Resolusi Video", desc: "Streaming di 720p alih-alih 4K saat menonton di layar kecil (HP/Tablet).", icon: MonitorDown, co2: 25 },
  { id: 3, title: "Matikan Auto-Play", desc: "Mencegah video atau media sosial memuat data tak berujung saat kita sedang tidak fokus.", icon: PlayCircle, co2: 15 },
  { id: 4, title: "Gunakan Wi-Fi", desc: "Menggunakan Wi-Fi mengonsumsi lebih sedikit energi per byte dibandingkan jaringan seluler (4G/5G).", icon: Wifi, co2: 10 },
  { id: 5, title: "Bersihkan Cloud", desc: "Hapus foto blur, duplikat, atau file lama dari Google Drive / iCloud Anda.", icon: CloudOff, co2: 18 },
  { id: 6, title: "Gunakan Bookmark", desc: "Langsung ke situs web yang sering dikunjungi daripada mencarinya lewat mesin pencari setiap saat.", icon: Bookmark, co2: 5 },
];

// --- KOMPONEN 3D DETAILED: BUMI PROSEDURAL INTERAKTIF ---
function InteractiveEarth3D({ healthRatio }: { healthRatio: number }) {
  const earthGroupRef = useRef<THREE.Group>(null);
  const cloudsGroupRef = useRef<THREE.Group>(null);
  const waterMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const landMatRefs = useRef<THREE.MeshStandardMaterial[]>([]);
  const cloudMatRefs = useRef<THREE.MeshStandardMaterial[]>([]);
  const treesGroupRef = useRef<THREE.Group>(null);

  // Nilai kesehatan bumi saat ini untuk animasi (damped)
  const currentHealth = useRef(0);

  // Warna transisi (Buruk/Gersang -> Baik/Asri)
  const colors = useMemo(() => ({
    waterBad: new THREE.Color("#4a4f44"), // Air keruh/tercemar
    waterGood: new THREE.Color("#0ea5e9"), // Biru samudra
    landBad: new THREE.Color("#78716c"), // Tanah gersang berbatu
    landGood: new THREE.Color("#22c55e"), // Hijau subur
    cloudBad: new THREE.Color("#52525b"), // Polusi / Smog
    cloudGood: new THREE.Color("#ffffff"), // Awan putih bersih
  }), []);

  // Data koordinat pulau dan pohon (Distribusi bola pseudo-acak)
  const landmasses = useMemo(() => [
    { pos: [1.2, 0.8, 1.2], size: 1.1 },
    { pos: [-1.2, 0.5, 1.4], size: 0.9 },
    { pos: [0.5, -1.3, 1.2], size: 1.3 },
    { pos: [-1.4, -0.8, -1], size: 1.0 },
    { pos: [1.3, -0.5, -1.2], size: 1.2 },
    { pos: [0, 1.6, -0.8], size: 0.8 },
  ], []);

  const trees = useMemo(() => {
    const treeData = [];
    for (let i = 0; i < 20; i++) {
      // Posisi acak di permukaan bola dengan radius sedikit lebih besar dari pulau
      const phi = Math.acos(-1 + (2 * i) / 20);
      const theta = Math.sqrt(20 * Math.PI) * phi;
      const r = 1.95; 
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      // Setiap pohon punya "threshold" kesehatan kapan dia mulai tumbuh
      treeData.push({ pos: [x, y, z], threshold: Math.random() * 0.8 });
    }
    return treeData;
  }, []);

  const clouds = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const r = 2.6; // Jarak awan
      return {
        pos: [r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)],
        size: 0.3 + Math.random() * 0.3
      };
    });
  }, []);

  useFrame((_, delta) => {
    // 1. Smooth interpolation untuk Health Ratio
    currentHealth.current = THREE.MathUtils.damp(currentHealth.current, healthRatio, 4, delta);
    const h = currentHealth.current;

    // 2. Rotasi Otomatis Bumi & Awan
    if (earthGroupRef.current) earthGroupRef.current.rotation.y += delta * 0.1;
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.rotation.y += delta * 0.15;
      cloudsGroupRef.current.rotation.z += delta * 0.05;
    }

    // 3. Transisi Warna Material
    if (waterMatRef.current) {
      waterMatRef.current.color.lerpColors(colors.waterBad, colors.waterGood, h);
    }
    landMatRefs.current.forEach(mat => {
      if (mat) mat.color.lerpColors(colors.landBad, colors.landGood, h);
    });
    cloudMatRefs.current.forEach(mat => {
      if (mat) mat.color.lerpColors(colors.cloudBad, colors.cloudGood, h);
    });

    // 4. Skala Pohon (Tumbuh seiring naiknya health)
    if (treesGroupRef.current) {
      treesGroupRef.current.children.forEach((treeMesh, index) => {
        const threshold = trees[index].threshold;
        // Pohon mulai tumbuh jika health melewati threshold-nya
        let targetScale = 0;
        if (h > threshold) {
          targetScale = THREE.MathUtils.clamp((h - threshold) * 3, 0, 1);
        }
        const currentScale = treeMesh.scale.x;
        const smoothScale = THREE.MathUtils.damp(currentScale, targetScale, 6, delta);
        treeMesh.scale.set(smoothScale, smoothScale, smoothScale);
      });
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* KELOMPOK BUMI */}
      <group ref={earthGroupRef}>
        {/* Lautan (Base Sphere) */}
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[1.8, 3]} />
          <meshStandardMaterial ref={waterMatRef} roughness={0.2} metalness={0.1} flatShading />
        </mesh>

        {/* Daratan (Pulau / Benua) */}
        {landmasses.map((land, i) => (
          <mesh key={`land-${i}`} position={land.pos as [number, number, number]} castShadow receiveShadow>
            <icosahedronGeometry args={[land.size, 1]} />
            <meshStandardMaterial 
              ref={(el) => { if(el) landMatRefs.current[i] = el; }} 
              roughness={0.9} 
              flatShading 
            />
          </mesh>
        ))}

        {/* Pohon & Pegunungan */}
        <group ref={treesGroupRef}>
          {trees.map((tree, i) => {
            // Menghitung rotasi agar pohon tegak lurus dengan permukaan bola
            const vec = new THREE.Vector3(...tree.pos).normalize();
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
            const euler = new THREE.Euler().setFromQuaternion(quaternion);

            return (
              <group key={`tree-${i}`} position={tree.pos as [number, number, number]} rotation={euler} scale={[0, 0, 0]}>
                {/* Batang */}
                <mesh castShadow position={[0, 0.1, 0]}>
                  <cylinderGeometry args={[0.04, 0.06, 0.2, 5]} />
                  <meshStandardMaterial color="#713f12" roughness={1} />
                </mesh>
                {/* Daun */}
                <mesh castShadow position={[0, 0.3, 0]}>
                  <coneGeometry args={[0.15, 0.4, 5]} />
                  <meshStandardMaterial color="#16a34a" roughness={0.8} flatShading />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      {/* KELOMPOK AWAN & ATMOSFER */}
      <group ref={cloudsGroupRef}>
        {clouds.map((cloud, i) => (
          <mesh key={`cloud-${i}`} position={cloud.pos as [number, number, number]} castShadow>
            <dodecahedronGeometry args={[cloud.size, 0]} />
            <meshStandardMaterial 
              ref={(el) => { if(el) cloudMatRefs.current[i] = el; }} 
              transparent 
              opacity={0.8} 
              flatShading 
            />
          </mesh>
        ))}
      </group>

      {/* PARTIKEL: Menyesuaikan jumlah dengan tingkat kesehatan bumi */}
      {healthRatio > 0.2 && (
        <DreiSparkles 
          count={Math.floor(healthRatio * 150)} 
          scale={3} 
          size={4} 
          speed={0.4} 
          color="#a7f3d0" 
        />
      )}

      {/* Bayangan Dasar untuk depth UI */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </group>
  );
}


// --- KOMPONEN HALAMAN UTAMA ---
export default function KomitmenPage() {
  const [selectedPledges, setSelectedPledges] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const togglePledge = (id: number) => {
    setSelectedPledges(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const totalCO2Saved = selectedPledges.reduce((total, id) => {
    const pledge = PLEDGE_OPTIONS.find(p => p.id === id);
    return total + (pledge?.co2 || 0);
  }, 0);

  // Rasio untuk Bumi: 0 (0 dipilih) hingga 1 (semua 6 dipilih)
  const healthRatio = selectedPledges.length / PLEDGE_OPTIONS.length;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 40 },
    show: { 
      opacity: 1, scale: 1, y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans overflow-hidden selection:bg-teal-100">
      
      <motion.section 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="relative px-6 pt-12 md:pt-20 pb-12 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center"
      >
        <div className="order-last lg:order-first z-10 lg:col-span-6">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-6">
            <HeartHandshake size={16} className="text-teal-500" />
            Langkah Kecil, Dampak Besar
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6">
            Saatnya Berubah, <br className="hidden md:block"/>
            Mulai dari <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">Jari Kita.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-slate-500 mb-8 max-w-2xl leading-relaxed">
            Setiap komitmen digital yang kamu pilih akan memulihkan bumi kita. Pilih kebiasaan baikmu di bawah dan lihat perubahan nyata pada bumi secara langsung!
          </motion.p>
        </div>

        {/* CONTAINER 3D BUMI (RESPONSIF) */}
        <motion.div variants={itemVariants} className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center order-first lg:order-last cursor-grab active:cursor-grabbing lg:col-span-6 bg-gradient-to-b from-slate-900 to-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white">
          {/* Efek Glow di belakang bumi */}
          <div 
            className="absolute w-72 h-72 rounded-full blur-[100px] transition-colors duration-1000" 
            style={{ backgroundColor: healthRatio > 0.5 ? 'rgba(20, 184, 166, 0.4)' : 'rgba(239, 68, 68, 0.2)' }}
          />

          <div className="w-full h-full">
            <Canvas camera={{ position: [0, 2, 7], fov: 45 }} shadows antialias="true">
              <ambientLight intensity={0.6} />
              <hemisphereLight groundColor="#0f172a" intensity={0.4} color="#ffffff" />
              <directionalLight 
                position={[5, 5, 5]} 
                intensity={1.5} 
                castShadow 
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ccfbf1" />
              
              <Suspense fallback={null}>
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                  <InteractiveEarth3D healthRatio={healthRatio} />
                </Float>
              </Suspense>
              
              <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />
            </Canvas>
          </div>
          
          {/* Indikator Status Bumi */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center pointer-events-none">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2">
                Status: {healthRatio === 1 ? "Asri Sempurna 🌍" : healthRatio > 0.4 ? "Mulai Pulih 🌿" : "Kritis 🥀"}
             </div>
             <div className="text-xs font-mono text-slate-300 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                Drag untuk putar
             </div>
          </div>
        </motion.div>
      </motion.section>

      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div 
                key="pledge-grid"
                variants={containerVariants}
                exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {PLEDGE_OPTIONS.map((pledge) => {
                  const isSelected = selectedPledges.includes(pledge.id);
                  return (
                    <motion.div
                      key={pledge.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, y: -4, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => togglePledge(pledge.id)}
                      className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden group ${
                        isSelected 
                          ? "bg-teal-50 border-teal-500 shadow-[0_12px_30px_rgba(20,184,166,0.2)]" 
                          : "bg-white border-slate-100 hover:border-teal-300 hover:shadow-lg"
                      }`}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0, rotate: -45 }} 
                            animate={{ scale: 1, opacity: 1, rotate: 0 }} 
                            exit={{ scale: 0, opacity: 0, rotate: 45 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="absolute top-5 right-5 text-teal-500"
                          >
                            <CheckCircle2 size={26} className="fill-teal-100" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
                        isSelected ? "bg-teal-500 text-white shadow-md shadow-teal-500/30" : "bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-600"
                      }`}>
                        <pledge.icon size={26} />
                      </div>
                      
                      <h3 className={`text-xl font-bold mb-2 transition-colors ${isSelected ? "text-teal-900" : "text-slate-800"}`}>
                        {pledge.title}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-4 ${isSelected ? "text-teal-700/80" : "text-slate-500"}`}>
                        {pledge.desc}
                      </p>

                      <div className={`text-xs font-bold inline-flex items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                        isSelected ? "bg-teal-200/60 text-teal-900" : "bg-slate-50 text-slate-500"
                      }`}>
                        Hemat ~{pledge.co2}kg CO₂/tahun
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="success-state"
                initial={{ opacity: 0, scale: 0.8, y: 30 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-white border border-teal-100 shadow-2xl p-10 md:p-16 rounded-[2.5rem] text-center max-w-3xl mx-auto relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-50/50 to-white z-0 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                  
                  {/* BUG FIXED DI BAWAH INI: Memisahkan konfigurasi scale dan rotate */}
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1, rotate: [0, 15, -15, 0] }} 
                    transition={{ 
                      delay: 0.2, 
                      scale: { type: "spring", stiffness: 150 },
                      rotate: { type: "tween", duration: 0.5, ease: "easeInOut" }
                    }}
                    className="w-24 h-24 bg-teal-500 rounded-3xl rotate-3 flex items-center justify-center text-white mb-8 shadow-[0_0_50px_rgba(20,184,166,0.4)]"
                  >
                    <HeartHandshake size={48} />
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Terima Kasih Atas Komitmenmu!</h2>
                  <p className="text-slate-500 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                    Bumi sedikit lebih bernapas lega berkat keputusanmu hari ini. Kami telah mencatat ikrarmu sebagai bagian dari gerakan <span className="font-semibold text-teal-600">Digital Handprint</span>.
                  </p>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    className="bg-slate-50 border border-slate-200 px-8 py-6 rounded-3xl w-full max-w-sm mb-8 shadow-inner"
                  >
                    <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Potensi Dampakmu</div>
                    <div className="text-4xl font-black text-teal-600">
                      -{totalCO2Saved} <span className="text-xl text-teal-400">kg CO₂/thn</span>
                    </div>
                  </motion.div>
                  <button 
                    onClick={() => { setIsSubmitted(false); setSelectedPledges([]); }}
                    className="text-slate-400 hover:text-teal-600 font-semibold transition-colors flex items-center gap-2"
                  >
                    Buat Komitmen Baru
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* STICKY BOTTOM BAR (ACTION BUTTON) */}
      <AnimatePresence>
        {selectedPledges.length > 0 && !isSubmitted && (
          <motion.div 
            initial={{ y: 120, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] md:w-auto md:min-w-[450px]"
          >
            <div className="bg-slate-900 text-white p-4 pr-4 pl-6 rounded-full shadow-2xl shadow-slate-900/50 flex items-center justify-between gap-6 border border-slate-700">
              <div>
                <div className="text-xs text-slate-400 font-medium mb-0.5">Total Pencegahan Emisi</div>
                <div className="text-xl font-black text-emerald-400">{totalCO2Saved} kg <span className="text-sm font-medium text-slate-400">CO₂ / thn</span></div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setIsSubmitted(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-3.5 rounded-full flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Ikrar Sekarang <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}