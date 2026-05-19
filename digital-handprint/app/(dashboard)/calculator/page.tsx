"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  Tv, Mail, Smartphone, Plus, Minus, Server, Cloud, Zap, 
  BarChart3, TreePine, Leaf, Droplets, Factory, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CalculatorPage() {
  const [data, setData] = useState({ streaming: 0, emails: 0, scrolling: 0 });

  const totalCo2 = (data.streaming * 100) + (data.emails * 4) + (data.scrolling * 50);
  const pohonDibutuhkan = Math.ceil(totalCo2 / 60);

  const chartData = [
    { name: "Streaming", CO2: data.streaming * 100, color: "#2dd4bf" },
    { name: "Email", CO2: data.emails * 4, color: "#34d399" },
    { name: "Medsos", CO2: data.scrolling * 50, color: "#10b981" },
  ];

  // Fungsi untuk menambah/mengurangi dengan batas maksimal
  const updateData = (key: keyof typeof data, increment: number, max: number) => {
    setData((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(max, prev[key] + increment)),
    }));
  };

  // --- LOGIKA DINAMIS PULAU ---
  // Tentukan state lingkungan berdasarkan totalCo2
  // Thresholds (Batas) bisa disesuaikan sesuai rumus emisi
  const getEnvironmentState = () => {
    if (totalCo2 < 500) return "lush"; // Sangat Asri (Hijau Pastel)
    if (totalCo2 < 1500) return "struggling"; // Terancam (Kuning/Oranye Pastel)
    return "damaged"; // Rusak (Abu-abu/Red Pastel)
  };

  const envState = getEnvironmentState();

  // Mapping state ke visual (warna & ikon)
  const envVisuals = {
    lush: {
      islandBg: "bg-emerald-50",
      islandBorder: "border-emerald-100",
      waterBg: "bg-cyan-100",
      waterGlow: "bg-cyan-200/50",
      textColor: "text-emerald-900",
      descColor: "text-emerald-700",
      statusText: "Ekosistem Terjaga",
      statusIcon: Leaf,
      floatingIcons: [TreePine, Leaf, TreePine],
      iconColor: "text-emerald-500",
    },
    struggling: {
      islandBg: "bg-orange-50",
      islandBorder: "border-orange-100",
      waterBg: "bg-sky-100",
      waterGlow: "bg-sky-200/50",
      textColor: "text-orange-950",
      descColor: "text-orange-800",
      statusText: "Ekosistem Terancam",
      statusIcon: AlertTriangle,
      floatingIcons: [TreePine, Zap, Factory], // Mulai ada pabrik/asap
      iconColor: "text-orange-500",
    },
    damaged: {
      islandBg: "bg-slate-200", // Pulau mati
      islandBorder: "border-slate-300",
      waterBg: "bg-slate-300", // Air tercemar
      waterGlow: "bg-slate-400/50",
      textColor: "text-slate-950",
      descColor: "text-slate-800",
      statusText: "Ekosistem Rusak",
      statusIcon: AlertTriangle,
      floatingIcons: [Server, Cloud, Factory], // Banyak server panas & polusi
      iconColor: "text-slate-600",
    },
  };

  const visual = envVisuals[envState];

  // Komponen Kartu Input Gamified
  const InteractiveCard = ({ title, icon: Icon, value, max, unit, dataKey }: any) => {
    const progress = (value / max) * 100;
    
    return (
      <motion.div whileHover={{ y: -5 }} className="relative bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden group z-0">
        {/* Background Progress Fill Indicator */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-teal-50/50 -z-10 transition-all duration-500 ease-out" 
          style={{ height: `${progress}%` }} 
        />
        
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <div className="p-3 bg-white shadow-sm rounded-xl text-teal-500 ring-1 ring-slate-100"><Icon size={20}/></div>
            {title}
          </div>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <button 
            onClick={() => updateData(dataKey, -1, max)}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-colors active:scale-95"
          >
            <Minus size={18} />
          </button>
          
          <div className="text-center">
            <AnimatePresence mode="popLayout">
              <motion.span 
                key={value}
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="inline-block text-3xl font-black text-teal-700"
              >
                {value}
              </motion.span>
            </AnimatePresence>
            <span className="text-slate-400 text-sm ml-1">{unit}</span>
          </div>

          <button 
            onClick={() => updateData(dataKey, 1, max)}
            className="w-10 h-10 flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white rounded-full transition-colors active:scale-95 shadow-md shadow-teal-500/30"
          >
            <Plus size={18} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-12 selection:bg-teal-100">
      
      {/* HEADER & VISUALISASI PULAU 3D DINAMIS (Rombak Total) */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={envState} // Memicu animasi saat state lingkungan berubah
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`flex flex-col md:flex-row justify-between items-center mb-12 p-8 rounded-3xl shadow-[0_12px_40px_rgb(0,0,0,0.06)] border relative overflow-hidden transition-colors duration-500 ${visual.islandBg} ${visual.islandBorder}`}
        >
          {/* Teks Header (Dinamis sesuai visual) */}
          <div className="z-10 text-center md:text-left mb-8 md:mb-0 relative max-w-lg">
            <motion.div animate={{ scale: [1, 1.1, 1] }} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-white/60 border border-white shadow-sm ${visual.textColor}`}>
              <visual.statusIcon size={14} className={visual.iconColor} />
              {visual.statusText}
            </motion.div>
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-3 transition-colors ${visual.textColor}`}>
              Analisis <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">Handprint.</span>
            </h1>
            <p className={`text-base leading-relaxed transition-colors ${visual.descColor}`}>Ubah kebiasaan digitalmu. Lihat bagaimana setiap klik memengaruhi kesehatan pulau simulasi ini secara langsung.</p>
          </div>

          {/* Pseudo-3D Floating Island Animation */}
          <div className="relative w-64 h-64 flex items-center justify-center perspective-1000 order-first md:order-last mb-8 md:mb-0">
            
            {/* Water/Base Glow Layer */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className={`absolute w-56 h-56 rounded-full blur-3xl -z-10 transition-colors duration-500 ${visual.waterGlow}`} 
            />

            {/* Main Floating Island Body (Pseudo-3D) */}
            <motion.div 
              animate={{ rotateY: 360, rotateX: [0, 5, 0, -5, 0], y: [0, -10, 0] }}
              transition={{ rotateY: { duration: 25, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" }, rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" } }}
              className={`relative z-10 w-48 h-48 rounded-full border shadow-2xl flex items-center justify-center preserve-3d transition-colors duration-500 ${visual.islandBg} ${visual.islandBorder}`}
            >
              
              {/* Water Ring (di sekeliling pulau) */}
              <div className={`absolute inset-0 rounded-full border-4 transition-colors duration-500 ${visual.waterBg} ${visual.islandBorder}`} style={{ transform: 'translateZ(-2px)' }} />

              {/* Central Objects (Dynamic Icons) */}
              <div className="relative flex items-center justify-center gap-1 preserve-3d">
                {visual.floatingIcons.map((Icon: any, index: number) => (
                  <motion.div
                    key={index}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, delay: index * 0.5, repeat: Infinity }}
                    className={`preserve-3d transition-colors duration-500 ${visual.iconColor}`}
                    style={{ transform: `translateZ(${10 + index * 10}px)` }} // Efek kedalaman 3D
                  >
                    <Icon size={index === 0 ? 40 : 30} strokeWidth={1.5} />
                  </motion.div>
                ))}
              </div>

              {/* Orbiting Elements (Data/Polusi) */}
              <motion.div animate={{ rotateZ: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -inset-10 border border-dashed border-teal-200 rounded-full z-0 opacity-60">
                <div className={`absolute -top-3 left-1/2 bg-white p-2 rounded-full shadow-md ${visual.iconColor}`}><Zap size={16}/></div>
              </motion.div>

            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* KONTEN UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-0 relative">
        
        {/* INPUT: GAMIFIED CARDS (Kiri - 7 Kolom) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InteractiveCard title="Streaming Video" icon={Tv} value={data.streaming} max={24} unit="Jam" dataKey="streaming" />
          <InteractiveCard title="Kirim/Baca Email" icon={Mail} value={data.emails} max={100} unit="Email" dataKey="emails" />
          <InteractiveCard title="Media Sosial" icon={Smartphone} value={data.scrolling} max={24} unit="Jam" dataKey="scrolling" />
          
          <motion.div initial={{opacity: 0, y: 10}} animate={{opacity:1, y:0}} transition={{delay: 0.3}} className="bg-teal-600 text-white p-6 rounded-3xl flex items-center gap-4 shadow-lg shadow-teal-600/20">
            <Zap size={32} className="text-teal-200 shrink-0" />
            <p className="text-sm leading-relaxed font-medium">Tips: Menurunkan resolusi YouTube dari 4K ke 1080p dapat mengurangi emisi karbon hingga 75%.</p>
          </motion.div>
        </div>

        {/* HASIL & GRAFIK (Kanan - 5 Kolom) */}
        <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.2}} className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col z-0 relative">
          <h2 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-emerald-500"/> Akumulasi Emisi Harian
          </h2>
          
          <div className="flex items-end gap-2 mb-8">
            <motion.span 
              key={totalCo2}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-black text-slate-800 tracking-tighter"
            >
              {totalCo2}
            </motion.span>
            <span className="text-xl font-medium text-slate-400 mb-2">g CO2e</span>
          </div>

          <div className={`mt-0 mb-8 p-4 rounded-2xl flex items-start gap-3 border transition-colors ${visual.islandBg} ${visual.islandBorder}`}>
            <TreePine size={24} className={`${visual.iconColor} shrink-0 mt-1`}/> 
            <p className={`text-sm leading-relaxed transition-colors ${visual.descColor}`}>
              Bumi membutuhkan sekitar <strong>{pohonDibutuhkan} pohon</strong> dewasa yang tumbuh selama setahun untuk menyerap emisi digital harianmu ini.
            </p>
          </div>
          
          {/* Recharts Customization */}
          <div className="h-56 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.1)' }} 
                />
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
    </div>
  );
}