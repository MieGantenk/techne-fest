"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Calculator, BookOpen, BarChart2, HeartHandshake, Menu, X, Leaf } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); // Default true untuk menghindari layout bergeser drastis
  const pathname = usePathname();

  // Mencegah Hydration Error di Next.js & deteksi layar responsif yang aman
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    
    handleResize(); // Cek saat pertama kali dimuat
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Home", icon: LayoutDashboard, path: "/" },
    { name: "Kalkulator", icon: Calculator, path: "/calculator" },
    { name: "Metodologi", icon: BookOpen, path: "/metodologi" },
    { name: "Dampak & Info", icon: BarChart2, path: "/dampak" },
    { name: "Komitmen Bersama", icon: HeartHandshake, path: "/komitmen" },
  ];

  return (
      // PERBAIKAN 1: Hapus overflow-x-hidden dari sini agar 'sticky' berfungsi
      <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col md:flex-row">
        
        {/* NAVBAR MOBILE */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm w-full">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-lg">
            <Leaf size={24} /> Handprint.
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 bg-slate-50 rounded-lg">
            <Menu size={24} />
          </button>
        </div>

        <div className="flex flex-1 w-full relative">
          
          {/* SIDEBAR (Desktop & Mobile Drawer) */}
          <AnimatePresence>
            {(isSidebarOpen || isDesktop) && (
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                // PERBAIKAN 2: sticky dan h-screen sekarang akan bekerja dengan sempurna
                className="fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-100 shadow-[4px_0_24px_rgb(0,0,0,0.02)] p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-2 text-teal-600 font-extrabold text-2xl">
                    <Leaf size={28} /> Handprint.
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link href={item.path} key={item.path} onClick={() => setIsSidebarOpen(false)}>
                        <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                          isActive ? "bg-teal-50 text-teal-700 font-bold" : "text-slate-500 hover:bg-slate-50 hover:text-teal-600"
                        }`}>
                          <item.icon size={20} className={isActive ? "text-teal-500" : "text-slate-400"} />
                          {item.name}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* OVERLAY MOBILE */}
          <AnimatePresence>
            {isSidebarOpen && !isDesktop && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
              />
            )}
          </AnimatePresence>

          {/* AREA KONTEN UTAMA */}
          {/* PERBAIKAN 3: overflow-x-hidden dipindah ke sini agar tidak merusak layout parent */}
          <main className="flex-1 min-w-0 w-full relative overflow-x-hidden">
            {children}
          </main>
          
        </div>
      </div>
  );
}
