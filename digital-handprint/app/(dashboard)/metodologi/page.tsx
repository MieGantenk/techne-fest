"use client";

import { motion, Variants } from "framer-motion";
import { Server, Zap, Leaf, Database, Cpu, Activity, Calculator, ArrowRight } from "lucide-react";

export default function MetodologiPage() {
  // Variasi animasi untuk teks dan kontainer
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, ease: "easeOut" },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
  };

  return (
    <div className="min-h-screen pb-24">
      {/* HERO SECTION DENGAN 3D ANIMATION */}
      <section className="relative px-6 pt-12 md:pt-20 pb-16 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">
        
        {/* KIRI: Penjelasan Metodologi */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="order-last lg:order-first z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-semibold mb-6">
            <Calculator size={16} className="text-teal-500" />
            Transparansi Perhitungan
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6">
            Bagaimana Kami <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-400">
              Menghitung Emisimu?
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
            Setiap bit data yang Anda akses melewati jaringan internet dan diproses oleh *data center*. Kami mengonversi penggunaan data tersebut menjadi konsumsi energi listrik, lalu menjadi jejak karbon.
          </motion.p>
        </motion.div>

        {/* KANAN: Animasi 3D Abstrak "Data Flow" */}
        <div className="relative w-full h-[350px] md:h-[400px] flex items-center justify-center order-first lg:order-last">
          {/* Efek Cahaya Belakang */}
          <div className="absolute w-64 h-64 bg-teal-200/40 rounded-full blur-3xl" />

          {/* Core Server Node */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 w-32 h-32 rounded-3xl bg-white border border-slate-100 shadow-2xl flex flex-col items-center justify-center text-teal-600"
          >
            <Server size={40} className="mb-2" />
            <span className="text-xs font-bold text-slate-400">CORE</span>
          </motion.div>

          {/* Orbit 1: Data Packets (Rotasi X & Z untuk efek 3D) */}
          <motion.div 
            style={{ rotateX: 60 }}
            animate={{ rotateZ: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute z-10 w-64 h-64 rounded-full border border-teal-200/50 border-dashed"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full shadow-lg flex items-center justify-center text-blue-500" style={{ rotateX: -60 }}>
              <Database size={14} />
            </div>
          </motion.div>

          {/* Orbit 2: Energy & Carbon (Rotasi X & Z Berlawanan) */}
          <motion.div 
            style={{ rotateX: 70 }}
            animate={{ rotateZ: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute z-0 w-80 h-80 rounded-full border-2 border-slate-200/60"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-teal-500 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.4)] flex items-center justify-center text-white" style={{ rotateX: -70 }}>
              <Zap size={18} />
            </div>
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-10 h-10 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.4)] flex items-center justify-center text-white" style={{ rotateX: -70 }}>
              <Leaf size={18} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION TAHAPAN (STEPS CARDS) */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 text-9xl font-black text-slate-50 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none">1</div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Estimasi Data (GB)</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Kami mengonversi durasi aktivitas (misal: 1 jam streaming) menjadi taksiran ukuran data yang ditransfer melalui jaringan.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono">
                Contoh: 1 Jam Streaming = ~3 GB Data
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 text-9xl font-black text-slate-50 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none">2</div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-500 mb-6">
                <Cpu size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Konversi Energi (kWh)</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Data yang ditransfer membutuhkan energi listrik untuk server, jaringan, dan perangkat akhir (HP/PC Anda).
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono">
                Rumus: 1 GB ≈ 0.81 kWh Listrik
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 text-9xl font-black text-slate-50 opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none">3</div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                <Leaf size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Emisi Karbon (kg CO₂)</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Terakhir, listrik tersebut dikalikan dengan faktor intensitas karbon global untuk mendapatkan jejak emisi nyata.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono flex items-center gap-2">
                1 kWh ≈ 0.494 kg CO₂
                <ArrowRight size={14} className="text-teal-500" />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* REFERENSI / DISCLAIMER SECTION */}
      <section className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden"
        >
          {/* Dekorasi Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Database size={24} className="text-teal-400" />
              Sumber Data & Referensi
            </h3>
            <p className="text-slate-300 mb-6 leading-relaxed text-sm md:text-base">
              Perhitungan di aplikasi ini adalah <strong>estimasi</strong> yang didasarkan pada standar rata-rata global yang dipublikasikan oleh organisasi lingkungan digital independen. Faktor intensitas karbon dapat berbeda drastis tergantung di negara mana server berada dan campuran energi lokal (energi terbarukan vs batu bara).
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-xs font-medium text-slate-300">
                Data Center Energy Factsheet
              </span>
              <span className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-xs font-medium text-slate-300">
                Global Carbon Intensity Index
              </span>
              <span className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-xs font-medium text-teal-300">
                v1.0 Methodology
              </span>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}