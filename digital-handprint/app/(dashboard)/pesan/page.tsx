"use client";
 
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Send, Heart, Globe, X, ChevronRight, Sparkles, Star, Leaf
} from "lucide-react";
import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { supabase } from "@/lib/supabase";
 
// --- (3D components unchanged: FloatingParticles, VibrantIsland) ---
function FloatingParticles({ count = 20 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 4;
      p[i * 3 + 1] = Math.random() * 2;
      p[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return p;
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#2dd4bf" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}
 
function VibrantIsland() {
  const groupRef = useRef<THREE.Group>(null);
  const flagRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.1;
    if (flagRef.current) flagRef.current.rotation.x = Math.sin(t * 3) * 0.2;
  });
  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.5, 6]} />
        <meshStandardMaterial color="#cbd5e1" flatShading />
      </mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.1, 2.1, 0.2, 6]} />
        <meshStandardMaterial color="#059669" roughness={0.8} />
      </mesh>
      <group position={[0, 0.3, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.12, 0.8, 0.12]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[0.5, 0.45, 0.7]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh ref={flagRef} position={[0.26, 0.9, 0]} castShadow>
          <boxGeometry args={[0.02, 0.35, 0.12]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.2} />
        </mesh>
      </group>
      {[...Array(5)].map((_, i) => (
        <group key={i} position={[Math.cos(i * 1.2) * 1.4, 0.3, Math.sin(i * 1.2) * 1.4]}>
          <mesh castShadow>
            <sphereGeometry args={[0.1, 4, 4]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#fde047" : "#fb7185"} />
          </mesh>
        </group>
      ))}
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-1.2, 1.8, 0.5]}>
          <sphereGeometry args={[0.3, 7, 7]} />
          <meshStandardMaterial color="white" transparent opacity={0.9} flatShading />
        </mesh>
        <mesh position={[-1.5, 1.7, 0.5]}>
          <sphereGeometry args={[0.2, 7, 7]} />
          <meshStandardMaterial color="white" transparent opacity={0.9} flatShading />
        </mesh>
      </Float>
      <FloatingParticles count={30} />
    </group>
  );
}
 
// --- AVATAR COLORS ---
const avatarPalettes = [
  ["#0d9488", "#6ee7b7"],
  ["#7c3aed", "#c4b5fd"],
  ["#db2777", "#fbcfe8"],
  ["#d97706", "#fde68a"],
  ["#2563eb", "#bfdbfe"],
  ["#059669", "#a7f3d0"],
];
 
// --- MESSAGE CARD (beautiful redesign) ---
function MessageCard({ post, index }: { post: any; index: number }) {
  const palette = avatarPalettes[index % avatarPalettes.length];
  const initial = post.nama?.charAt(0).toUpperCase() ?? "?";
 
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 100, damping: 14, delay: index * 0.06 }}
      className="group relative bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(13,148,136,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default"
    >
      {/* Subtle gradient accent top-left */}
      <div
        className="absolute top-0 left-0 w-full h-[3px] rounded-t-[24px] opacity-80"
        style={{ background: `linear-gradient(90deg, ${palette[0]}, ${palette[1]})` }}
      />
 
      {/* Decorative background blob */}
      <div
        className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity"
        style={{ background: palette[0] }}
      />
 
      <div className="flex gap-4 items-start relative z-10">
        {/* Avatar */}
        <div
          className="w-11 h-11 shrink-0 rounded-[14px] flex items-center justify-center text-white font-black text-base shadow-md"
          style={{ background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})` }}
        >
          {initial}
        </div>
 
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-800 text-sm truncate leading-tight">{post.nama}</h4>
            <Leaf size={10} className="shrink-0 text-teal-400 opacity-70" />
          </div>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 italic">
            "{post.isi_pesan}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
 
// --- MODAL MESSAGE CARD ---
function ModalMessageCard({ post, index }: { post: any; index: number }) {
  const palette = avatarPalettes[index % avatarPalettes.length];
  const initial = post.nama?.charAt(0).toUpperCase() ?? "?";
  return (
    <div className="group relative bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{ background: `linear-gradient(90deg, ${palette[0]}, ${palette[1]})` }}
      />
      <div className="flex gap-3 items-start">
        <div
          className="w-10 h-10 shrink-0 rounded-[12px] flex items-center justify-center text-white font-black text-sm shadow"
          style={{ background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})` }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-slate-800 text-sm truncate">{post.nama}</h4>
          <p className="text-slate-500 text-xs italic mt-0.5">"{post.isi_pesan}"</p>
        </div>
      </div>
    </div>
  );
}
 
// --- MAIN PAGE ---
export default function PesanPage() {
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
 
  const fetchDisplayMessages = async () => {
    const { data } = await supabase
      .from("pesan").select("*").order("created_at", { ascending: false }).limit(6);
    if (data) setMessages(data);
  };
  const fetchAllMessages = async () => {
    const { data } = await supabase
      .from("pesan").select("*").order("created_at", { ascending: false });
    if (data) setAllMessages(data);
  };
 
  useEffect(() => {
    fetchDisplayMessages();
    fetchAllMessages();
    const channel = supabase
      .channel("realtime-pesan")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "pesan" }, (payload) => {
        setMessages((prev) => [payload.new, ...prev.slice(0, 5)]);
        setAllMessages((prev) => [payload.new, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
 
  const handleSend = async () => {
    if (!nama || !pesan) return alert("Lengkapi namamu dan pesanmu");
    setIsSending(true);
    const { error } = await supabase.from("pesan").insert([{ nama, isi_pesan: pesan }]);
    if (error) { alert("Error: " + error.message); }
    else {
      setNama(""); setPesan("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setIsSending(false);
  };
 
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 12 } },
  };
 
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 overflow-x-hidden font-sans relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-50/50 rounded-full blur-[120px]" />
      </div>
 
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto px-6">
 
        {/* HERO SECTION */}
        <section className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center pt-12 md:pt-20">
          <div className="order-2 lg:order-1 relative">
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
              <span className="h-[1px] w-12 bg-teal-500/30"></span>
              <span className="text-teal-600 font-bold text-xs uppercase tracking-[0.2em]">Kirim Harapan Digital</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
              Pesan untuk <br />
              <span className="relative">
                <span className="relative z-10 text-teal-600">Bumi Kita.</span>
                <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none">
                  <motion.path d="M5 15Q150 2 295 15" stroke="#2dd4bf" strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1 }} />
                </motion.svg>
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-slate-500 max-w-md leading-relaxed mb-10">
              Kumpulkan niat baikmu dalam sebuah botol digital. Mari bersama-sama menurunkan jejak karbon lewat aksi nyata.
            </motion.p>
          </div>
          <motion.div variants={itemVariants} className="h-[400px] md:h-[550px] w-full order-1 lg:order-2 relative group">
            <Canvas camera={{ position: [5, 5, 5], fov: 30 }} shadows>
              <ambientLight intensity={0.7} />
              <pointLight position={[5, 5, 5]} intensity={1.5} castShadow />
              <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
              <Suspense fallback={null}>
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                  <VibrantIsland />
                </Float>
              </Suspense>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </motion.div>
        </section>
 
        {/* INTERACTION SECTION */}
        <section className="grid lg:grid-cols-12 gap-12 mt-24">
          {/* FORM CARD */}
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative">
              <div className="absolute -top-6 -left-6 bg-teal-600 text-white p-4 rounded-2xl shadow-xl rotate-[-10deg]">
                <Heart size={24} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">Apa Komitmenmu?</h2>
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 block ml-1">Nickname</label>
                  <input
                    type="text" value={nama} onChange={(e) => setNama(e.target.value)}
                    placeholder="GreenGuardian"
                    className="w-full bg-slate-100/50 border-2 border-transparent focus:border-teal-500/20 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-semibold"
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 block ml-1">Pesan / Harapan</label>
                  <textarea
                    rows={4} value={pesan} onChange={(e) => setPesan(e.target.value)}
                    placeholder="Tuliskan janji kecilmu..."
                    className="w-full bg-slate-100/50 border-2 border-transparent focus:border-teal-500/20 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-semibold resize-none"
                  />
                </div>
                <motion.button
                  onClick={handleSend} disabled={isSending}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 30px -10px rgba(13, 148, 136, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                  {isSending ? "MENGIRIM..." : "KIRIM"} <Send size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
 
          {/* ✨ HARAPAN GLOBAL — REDESIGNED FEED */}
          <div className="lg:col-span-7">
            <motion.div
              variants={itemVariants}
              className="relative rounded-[40px] overflow-hidden border border-slate-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] min-h-full"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 -z-10" />
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/5 rounded-full blur-xl pointer-events-none" />
 
              {/* Header */}
              <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-slate-100/80">
                <div className="flex items-center gap-3">
                  {/* Animated globe icon with glow */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center shadow-[0_4px_12px_rgba(20,184,166,0.35)]">
                      <Globe size={18} className="text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="absolute inset-0 rounded-2xl bg-teal-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-none">Harapan Global</h3>
                    <p className="text-[11px] text-teal-600 font-semibold mt-0.5 tracking-wide">
                      {messages.length} pesan terbaru
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowAllModal(true)}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-full transition-all"
                >
                  Lihat Semua <ChevronRight size={13} />
                </motion.button>
              </div>
 
              {/* Message Grid */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <AnimatePresence mode="popLayout">
                    {messages.map((post, i) => (
                      <MessageCard key={post.id} post={post} index={i} />
                    ))}
                  </AnimatePresence>
                </div>
 
                {messages.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <Sparkles size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Belum ada harapan. Jadilah yang pertama!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
 
      {/* ✨ MODAL — REDESIGNED */}
      <AnimatePresence>
        {showAllModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ y: 60, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[40px] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.2)]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100 bg-gradient-to-r from-slate-50 to-teal-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center shadow-md">
                    <Globe size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Seluruh Harapan</h2>
                    <p className="text-xs text-teal-600 font-semibold">{allMessages.length} warriors telah berkomitmen</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowAllModal(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="p-2.5 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
 
              {/* Modal Body */}
              <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3">
                {allMessages.map((post, i) => (
                  <ModalMessageCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100, rotate: -5 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="bg-white rounded-[40px] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col items-center text-center max-w-sm w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-400" />
              <motion.div
                initial={{ rotateY: 180, scale: 0 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-3xl mb-6 flex items-center justify-center shadow-[0_15px_30px_-5px_rgba(20,184,166,0.4)] rotate-12"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </motion.div>
              <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-2xl font-black text-slate-900 mb-2">
                Berhasil Terkirim!
              </motion.h3>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-slate-500 font-medium">
                Pesanmu telah mendarat di pulau harapan. Terima kasih!
              </motion.p>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 -right-4 text-teal-400"
              >
                <Sparkles size={40} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}