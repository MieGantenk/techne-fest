"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Tv, Mail, Smartphone, Plus, Minus, Zap, BarChart3, TreePine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

// --- IMPORT ASSET PULAU YANG SUDAH DIPISAH ---
import FloatingIsland3D from "../../../components/FloatingIsland3D"; // Sesuaikan jika menggunakan alias seperti "@/components/FloatingIsland3D"

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
    lush: { text: "Ekosistem Lestari", desc: "Kadar emisi rendah. Pulau hidup dengan subur, udara bersih, dan kehidupan berkembang alami.", color: "text-emerald-600", bg: "bg-emerald-50" },
    struggling: { text: "Ekosistem Tertekan", desc: "Emisi meningkat tajam. Suhu naik, struktur jalan perkotaan, polusi udara, dan pabrik mulai mengambil alih lahan hijau.", color: "text-amber-600", bg: "bg-amber-50" },
    damaged: { text: "Ekosistem Hancur", desc: "Krisis Iklim! Tata kota padat industri, polusi pekat berbahaya, alam mati digantikan jalan raya serta gedung bertingkat.", color: "text-rose-600", bg: "bg-rose-50" }
  };

  const infoVisual = envTexts[envState];

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