"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { 
  HeartHandshake, ShieldCheck, Sparkles, MailMinus, 
  MonitorDown, PlayCircle, Wifi, CloudOff, Bookmark, 
  CheckCircle2, ArrowRight
} from "lucide-react";

// Data Opsi Komitmen
const PLEDGE_OPTIONS = [
  { id: 1, title: "Hapus Email Sampah", desc: "Berhenti berlangganan newsletter yang tidak pernah dibaca untuk menghemat storage server.", icon: MailMinus, co2: 12 },
  { id: 2, title: "Turunkan Resolusi Video", desc: "Streaming di 720p alih-alih 4K saat menonton di layar kecil (HP/Tablet).", icon: MonitorDown, co2: 25 },
  { id: 3, title: "Matikan Auto-Play", desc: "Mencegah video atau media sosial memuat data tak berujung saat kita sedang tidak fokus.", icon: PlayCircle, co2: 15 },
  { id: 4, title: "Gunakan Wi-Fi", desc: "Menggunakan Wi-Fi mengonsumsi lebih sedikit energi per byte dibandingkan jaringan seluler (4G/5G).", icon: Wifi, co2: 10 },
  { id: 5, title: "Bersihkan Cloud", desc: "Hapus foto blur, duplikat, atau file lama dari Google Drive / iCloud Anda.", icon: CloudOff, co2: 18 },
  { id: 6, title: "Gunakan Bookmark", desc: "Langsung ke situs web yang sering dikunjungi daripada mencarinya lewat mesin pencari setiap saat.", icon: Bookmark, co2: 5 },
];

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

  // Animasi Stagger
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans overflow-hidden">
      
      {/* HERO SECTION 3D */}
      <section className="relative px-6 pt-12 md:pt-20 pb-12 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">
        
        {/* KIRI: Teks Utama */}
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="order-last lg:order-first z-10">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-6">
            <HeartHandshake size={16} className="text-teal-500" />
            Langkah Kecil, Dampak Besar
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6">
            Saatnya Berubah, <br className="hidden md:block"/>
            Mulai dari <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">Jari Kita.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
            Menyelamatkan bumi tidak harus dengan menanam seribu pohon sekaligus. Memilih kebiasaan digital yang lebih efisien juga berkontribusi besar. Pilih komitmen harianmu di bawah ini.
          </motion.p>
        </motion.div>

        {/* KANAN: Animasi 3D Abstrak "Jantung Ekosistem" */}
        <div className="relative w-full h-[350px] flex items-center justify-center order-first lg:order-last">
          <div className="absolute w-64 h-64 bg-teal-300/30 rounded-full blur-3xl" />

          {/* Inti (Core) */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20 w-32 h-32 rounded-full bg-white/80 backdrop-blur-md border border-teal-100 shadow-2xl flex flex-col items-center justify-center text-teal-500"
          >
            <HeartHandshake size={48} />
          </motion.div>

          {/* Orbit Pelindung (Miring) */}
          <motion.div 
            style={{ rotateX: 70, rotateY: 15 }}
            animate={{ rotateZ: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute z-10 w-72 h-72 rounded-full border-2 border-teal-200/60 border-dashed"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg text-emerald-500" style={{ rotateX: -70 }}>
              <ShieldCheck size={24} />
            </div>
          </motion.div>

          {/* Orbit Percikan (Berlawanan arah) */}
          <motion.div 
            style={{ rotateX: 60, rotateY: -15 }}
            animate={{ rotateZ: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute z-30 w-96 h-96 rounded-full border border-slate-200/50"
          >
            <div className="absolute bottom-1/4 -right-2 bg-white p-2 rounded-full shadow-md text-teal-400" style={{ rotateX: -60 }}>
              <Sparkles size={18} />
            </div>
            <div className="absolute top-1/4 -left-2 bg-white p-2 rounded-full shadow-md text-emerald-400" style={{ rotateX: -60 }}>
              <Sparkles size={16} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTERACTIVE PLEDGE GRID */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div 
              key="pledge-grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {PLEDGE_OPTIONS.map((pledge) => {
                const isSelected = selectedPledges.includes(pledge.id);
                return (
                  <motion.div
                    key={pledge.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => togglePledge(pledge.id)}
                    className={`cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden group ${
                      isSelected 
                        ? "bg-teal-50 border-teal-500 shadow-[0_8px_30px_rgba(20,184,166,0.15)]" 
                        : "bg-white border-slate-100 hover:border-teal-200 hover:shadow-md"
                    }`}
                  >
                    {/* Ikon Check di pojok kanan atas saat terpilih */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-5 right-5 text-teal-500"
                        >
                          <CheckCircle2 size={24} className="fill-teal-100" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                      isSelected ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-600"
                    }`}>
                      <pledge.icon size={24} />
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 transition-colors ${isSelected ? "text-teal-900" : "text-slate-800"}`}>
                      {pledge.title}
                    </h3>
                    <p className={`text-sm leading-relaxed mb-4 ${isSelected ? "text-teal-700/80" : "text-slate-500"}`}>
                      {pledge.desc}
                    </p>

                    <div className={`text-xs font-bold inline-flex items-center gap-1 px-3 py-1.5 rounded-lg ${
                      isSelected ? "bg-teal-200/50 text-teal-800" : "bg-slate-50 text-slate-500"
                    }`}>
                      Hemat ~{pledge.co2}kg CO₂/tahun
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            // STATE SUCCESS SETELAH SUBMIT
            <motion.div 
              key="success-state"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-teal-100 shadow-xl p-10 md:p-16 rounded-[2.5rem] text-center max-w-3xl mx-auto relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-50 to-white z-0" />
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-white mb-8 shadow-[0_0_40px_rgba(20,184,166,0.4)]"
                >
                  <HeartHandshake size={48} />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Terima Kasih Atas Komitmenmu!</h2>
                <p className="text-slate-500 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                  Bumi sedikit lebih bernapas lega berkat keputusanmu hari ini. Kami telah mencatat ikrarmu sebagai bagian dari gerakan *Digital Handprint*.
                </p>
                <div className="bg-slate-50 border border-slate-200 px-8 py-6 rounded-3xl w-full max-w-sm mb-8">
                  <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Potensi Dampakmu</div>
                  <div className="text-4xl font-black text-teal-600">
                    -{totalCO2Saved} <span className="text-xl text-teal-400">kg CO₂/tahun</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setIsSubmitted(false); setSelectedPledges([]); }}
                  className="text-slate-400 hover:text-teal-600 font-semibold transition-colors"
                >
                  Kembali & Ulangi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* STICKY BOTTOM BAR (ACTION BUTTON) */}
      <AnimatePresence>
        {selectedPledges.length > 0 && !isSubmitted && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] md:w-auto md:min-w-[400px]"
          >
            <div className="bg-slate-900 text-white p-4 pr-4 pl-6 rounded-3xl shadow-2xl flex items-center justify-between gap-6 border border-slate-700">
              <div>
                <div className="text-xs text-slate-400 font-medium mb-1">Total Estimasi Pencegahan</div>
                <div className="text-xl font-bold text-emerald-400">{totalCO2Saved} kg CO₂ / tahun</div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsSubmitted(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-colors"
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