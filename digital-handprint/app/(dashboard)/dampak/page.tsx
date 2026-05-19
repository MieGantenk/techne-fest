"use client";

import { motion, Variants } from "framer-motion";
import { 
  TreePine, Cloud, Plane, Droplet, 
  Smartphone, MonitorPlay, Mail, AlertTriangle, 
  Globe2, ArrowRight, Wind
} from "lucide-react";

export default function DampakPage() {
  // Animasi Stagger untuk Container
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, ease: "easeOut" },
    },
  };

  // Animasi Spring untuk item di dalam Container
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans overflow-hidden">
      
      {/* HERO SECTION DENGAN 3D ECO-ANIMATION */}
      <section className="relative px-6 pt-12 md:pt-20 pb-16 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">
        
        {/* KIRI: Teks Utama */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="order-last lg:order-first z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
            <Globe2 size={16} className="text-emerald-500" />
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
        </motion.div>

        {/* KANAN: Animasi 3D Abstrak "Eco-Transformation" */}
        <div className="relative w-full h-[350px] md:h-[400px] flex items-center justify-center order-first lg:order-last">
          {/* Latar Belakang Cahaya Hijau */}
          <div className="absolute w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />

          {/* Elemen Tengah (Pohon / Alam) */}
          <motion.div 
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 w-40 h-40 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-2xl flex items-center justify-center text-emerald-500"
          >
            <TreePine size={64} strokeWidth={1.5} />
          </motion.div>

          {/* Orbit Awan Polusi (CO2) -> Berputar & Menghilang */}
          <motion.div 
            style={{ rotateX: 65, rotateY: 10 }}
            animate={{ rotateZ: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute z-10 w-80 h-80 rounded-full border-2 border-slate-300/40 border-dashed"
          >
            {/* Awan 1 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 p-3 rounded-full shadow-lg text-slate-400" style={{ rotateX: -65 }}>
              <Cloud size={20} />
            </div>
            {/* Awan 2 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-slate-100 p-3 rounded-full shadow-lg text-slate-400" style={{ rotateX: -65 }}>
              <Cloud size={20} />
            </div>
          </motion.div>

          {/* Orbit Angin Bersih -> Rotasi Berlawanan */}
          <motion.div 
            style={{ rotateX: 65, rotateY: -10 }}
            animate={{ rotateZ: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute z-30 w-64 h-64 rounded-full border-[3px] border-emerald-300/30"
          >
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-emerald-50 p-2 rounded-full shadow-md text-emerald-400" style={{ rotateX: -65 }}>
              <Wind size={18} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* INFOGRAFIS 1: FAKTA INTERNET (HOVER CARDS) */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Fakta Internet Global</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Angka di balik layar layar gawai Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fakta 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-teal-50 transition-colors duration-300 z-0">
              <MonitorPlay size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-teal-500 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-600 mb-6 transition-colors duration-300">
                <MonitorPlay size={24} />
              </div>
              <h3 className="text-4xl font-black text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">60%</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Dari seluruh lalu lintas internet global digunakan semata-mata untuk <strong>Video Streaming</strong> (Netflix, YouTube, dll).
              </p>
            </div>
          </motion.div>

          {/* Fakta 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-emerald-50 transition-colors duration-300 z-0">
              <AlertTriangle size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-emerald-500 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-600 mb-6 transition-colors duration-300">
                <Globe2 size={24} />
              </div>
              <h3 className="text-4xl font-black text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">Top 4</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Jika internet adalah sebuah negara, ia akan menjadi <strong>penyumbang polusi terbesar ke-4</strong> di dunia, tepat di bawah India.
              </p>
            </div>
          </motion.div>

          {/* Fakta 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-blue-50 transition-colors duration-300 z-0">
              <Mail size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-500 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-600 mb-6 transition-colors duration-300">
                <Mail size={24} />
              </div>
              <h3 className="text-4xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">50g</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Adalah jumlah emisi CO₂ rata-rata dari <strong>satu email dengan lampiran foto besar</strong>. Bayangkan dikalikan miliaran email per hari.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INFOGRAFIS 2: EKUIVALENSI (PERBANDINGAN VISUAL) */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Apa Artinya 1 Ton CO₂ Digital?</h2>
            <p className="text-slate-500">Menganalogikan data maya ke dalam bentuk fisik agar mudah dipahami.</p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Baris 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors"
            >
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center p-4">
                <div className="text-4xl font-black text-slate-800">1 Ton</div>
                <div className="text-sm text-slate-500 font-semibold mt-1">Karbon Digital</div>
              </div>
              <div className="hidden md:flex items-center text-slate-300"><ArrowRight size={32}/></div>
              <div className="w-full md:w-2/3 flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                  <Plane size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">1 Penerbangan Paris - New York</h4>
                  <p className="text-sm text-slate-500 mt-1">Konsumsi energi server setara dengan bahan bakar satu penumpang pesawat rute trans-atlantik.</p>
                </div>
              </div>
            </motion.div>

            {/* Baris 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors"
            >
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center p-4">
                <div className="text-4xl font-black text-slate-800">1 Ton</div>
                <div className="text-sm text-slate-500 font-semibold mt-1">Karbon Digital</div>
              </div>
              <div className="hidden md:flex items-center text-slate-300"><ArrowRight size={32}/></div>
              <div className="w-full md:w-2/3 flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                  <TreePine size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">Butuh 50 Pohon Dewasa</h4>
                  <p className="text-sm text-slate-500 mt-1">Dibutuhkan 50 pohon yang tumbuh selama satu tahun penuh hanya untuk menyerap emisi tersebut.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}