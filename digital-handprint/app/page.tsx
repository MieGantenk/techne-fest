"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Leaf, Zap, Shield, BarChart3, Globe } from "lucide-react";

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-teal-200 selection:text-teal-900 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 lg:pt-32 flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
        
        {/* KIRI: Animasi Abstrak 3D (Bumi & Ekosistem Digital) */}
        {/* FIX: Mengubah h-400 menjadi h-[400px] agar layout tidak collapse */}
        <div className="relative w-full h-[400px] flex items-center justify-center order-last lg:order-first">
          {/* Latar Belakang Cahaya (Glow) */}
          <div className="absolute w-64 h-64 bg-teal-200/50 rounded-full blur-3xl" />

          {/* Elemen Tengah: Bumi Abstrak */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="relative w-64 h-64 rounded-full border border-teal-200 bg-white/40 shadow-2xl backdrop-blur-sm flex items-center justify-center"
          >
            <Globe size={80} strokeWidth={1} className="text-teal-600/50" />
            
            {/* Orbit 1 */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-80 h-80 rounded-full border border-dashed border-teal-300/60"
            >
              <div className="absolute -top-4 left-1/2 p-3 bg-white rounded-full shadow-lg text-emerald-500">
                <Leaf size={24} />
              </div>
            </motion.div>

            {/* Orbit 2 */}
            {/* FIX: Mengubah w-104 h-104 menjadi w-[26rem] h-[26rem] */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-[26rem] h-[26rem] rounded-full border border-slate-200/80"
            >
              <div className="absolute bottom-12 -left-4 p-3 bg-white rounded-full shadow-lg text-teal-500">
                <Zap size={20} />
              </div>
              <div className="absolute top-20 -right-4 p-3 bg-white rounded-full shadow-lg text-emerald-400">
                <BarChart3 size={20} />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* KANAN: Teks dan Call to Action */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center lg:items-start lg:text-left z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Kalkulator Jejak Karbon v1.0
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Kecilkan Jejak <br className="hidden lg:block"/>
            {/* FIX: Mengubah bg-linear-to-r menjadi bg-gradient-to-r */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-400">
              Digitalmu.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
            Internet tidak mengambang di awan. Ia hidup di server yang mengonsumsi listrik raksasa. Mari hitung dan kurangi emisi karbon dari aktivitas digital harianmu demi bumi yang lebih hijau.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Link href="/calculator">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-teal-600/20 transition-colors"
              >
                Mulai Hitung Emisi
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

      </section>

      {/* SECTION FITUR & MANFAAT (CARDS) */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Kenapa Ini Penting?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Kami merancang platform ini dengan prinsip Eco-Minimalism. Menghemat data, menghemat energi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-teal-500 mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Real-time Analysis</h3>
              <p className="text-slate-500 leading-relaxed">
                Ubah kebiasaan digitalmu (streaming, medsos, email) menjadi data emisi karbon harian secara instan.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                <Leaf size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Eco-Minimalist</h3>
              <p className="text-slate-500 leading-relaxed">
                Antarmuka dirancang tanpa aset gambar berat, menggunakan warna cerah dan tipografi agar hemat energi (Green Web).
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Aksi Nyata</h3>
              <p className="text-slate-500 leading-relaxed">
                Dapatkan rekomendasi praktis untuk mengurangi beban data center global dan bantu bumi bernapas lega.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

    </div>
  );
}
