"use client";

import { useState, useEffect } from "react";
import { Server, Sun, RefreshCw, Coins, Factory } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

// CATATAN: Import komponen <FloatingIsland3D> yang sudah kamu buat sebelumnya di sini.
// Untuk demo ini, saya asumsikan komponen tersebut sudah siap.
import FloatingIsland3D from "../../../components/FloatingIsland3D"; 

const API_URL = "http://localhost:8000/api";

export default function DigitalTycoonGame() {
  const [gameState, setGameState] = useState({
    coins: 0,
    co2: 0,
    servers: 0,
    solar_panels: 0,
    server_cost: 0,
    solar_cost: 0
  });

  // GAME LOOP: Mengambil dan mengupdate data dari Python setiap 1 detik
  useEffect(() => {
    const tickInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/tick`, { method: "POST" });
        const data = await res.json();
        setGameState(data);
      } catch (error) {
        console.error("Gagal terhubung ke server Python", error);
      }
    }, 1000);

    return () => clearInterval(tickInterval);
  }, []);

  // FUNGSI PEMBELIAN
  const buyItem = async (itemType: "server" | "solar") => {
    try {
      const res = await fetch(`${API_URL}/buy/${itemType}`, { method: "POST" });
      const data = await res.json();
      setGameState(data);
    } catch (error) {
      console.error("Gagal melakukan pembelian", error);
    }
  };

  const resetGame = async () => {
    const res = await fetch(`${API_URL}/reset`, { method: "POST" });
    const data = await res.json();
    setGameState(data);
  };

  // Logika transisi visual pulau berdasarkan CO2 dari Backend
  const getEnvState = () => {
    if (gameState.co2 < 200) return "lush";
    if (gameState.co2 < 800) return "struggling";
    return "damaged";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL KIRI: UI GAME & STATISTIK */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h1 className="text-3xl font-black mb-2">Digital Tycoon</h1>
            <p className="text-slate-500 mb-6 text-sm">Kelola aset digitalmu tanpa menghancurkan ekosistem pulau!</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex flex-col items-center justify-center">
                <Coins size={24} className="text-amber-500 mb-2"/>
                <span className="text-2xl font-bold text-amber-600">{gameState.coins}</span>
                <span className="text-xs text-amber-500 font-medium">Koin Digital</span>
              </div>
              <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-colors
                ${gameState.co2 > 800 ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                <Factory size={24} className="mb-2"/>
                <span className="text-2xl font-bold">{gameState.co2}</span>
                <span className="text-xs font-medium">Emisi CO2</span>
              </div>
            </div>

            {/* SHOP / TOKO INFRASTRUKTUR */}
            <h2 className="font-bold mb-4 text-slate-700">Toko Infrastruktur</h2>
            
            {/* Item 1: Server */}
            <button 
              onClick={() => buyItem("server")}
              disabled={gameState.coins < gameState.server_cost}
              className="w-full flex items-center justify-between p-4 mb-3 bg-white border-2 border-slate-100 rounded-xl hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-lg"><Server size={20}/></div>
                <div>
                  <div className="font-bold text-slate-700">Data Center Server</div>
                  <div className="text-xs text-slate-500">Milikmu: {gameState.servers} | +5 Koin/s | +10 CO2/s</div>
                </div>
              </div>
              <div className="font-bold text-amber-500 flex items-center gap-1">
                {gameState.server_cost} <Coins size={14}/>
              </div>
            </button>

            {/* Item 2: Solar Panel */}
            <button 
              onClick={() => buyItem("solar")}
              disabled={gameState.coins < gameState.solar_cost}
              className="w-full flex items-center justify-between p-4 mb-4 bg-white border-2 border-slate-100 rounded-xl hover:border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-lg"><Sun size={20}/></div>
                <div>
                  <div className="font-bold text-slate-700">Panel Surya</div>
                  <div className="text-xs text-slate-500">Milikmu: {gameState.solar_panels} | -15 CO2/s</div>
                </div>
              </div>
              <div className="font-bold text-amber-500 flex items-center gap-1">
                {gameState.solar_cost} <Coins size={14}/>
              </div>
            </button>

            <button onClick={resetGame} className="w-full py-3 flex items-center justify-center gap-2 text-rose-500 font-medium hover:bg-rose-50 rounded-xl transition-colors">
              <RefreshCw size={16} /> Reset Permainan
            </button>
          </div>
        </div>

        {/* PANEL KANAN: 3D VISUALIZATION */}
        <div className="lg:col-span-7 bg-gradient-to-b from-sky-50 to-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative min-h-[500px]">
          <Canvas camera={{ position: [0, 3, 6], fov: 45 }} shadows>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
              {/* Komponen visual 3D-mu mengambil state dari logika permainan */}
              <FloatingIsland3D envState={getEnvState()} />
            </Float>
            <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
          </Canvas>
          
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-white">
            Status: <span className="uppercase text-slate-600">{getEnvState()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}