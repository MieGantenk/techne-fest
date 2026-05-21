from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Mengizinkan Front-End React untuk mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Dalam produksi, ganti dengan URL domain aslimu
    allow_methods=["*"],
    allow_headers=["*"],
)

# Struktur Data Game State
class GameState(BaseModel):
    coins: int = 50
    co2: int = 0
    servers: int = 0
    solar_panels: int = 0
    server_cost: int = 50
    solar_cost: int = 150

# Inisialisasi State Global (Penyimpanan memori sederhana)
state = GameState()

@app.get("/api/state")
def get_state():
    """Mengambil data permainan saat ini."""
    return state

@app.post("/api/tick")
def game_tick():
    """Loop permainan: Dieksekusi setiap detik oleh Front-End."""
    global state
    
    # Pendapatan: Tiap server menghasilkan 5 koin/detik
    state.coins += state.servers * 5
    
    # Polusi: Tiap server menghasilkan 10 CO2, dikurangi 15 CO2 dari tiap Solar Panel
    co2_generated = state.servers * 10
    co2_reduced = state.solar_panels * 15
    
    # Pastikan CO2 tidak minus
    state.co2 = max(0, state.co2 + co2_generated - co2_reduced)
    
    return state

@app.post("/api/buy/{item_type}")
def buy_item(item_type: str):
    """Logika pembelian infrastruktur."""
    global state
    
    if item_type == "server" and state.coins >= state.server_cost:
        state.coins -= state.server_cost
        state.servers += 1
        # Inflasi: Harga server naik 30% setelah dibeli
        state.server_cost = int(state.server_cost * 1.3)
        
    elif item_type == "solar" and state.coins >= state.solar_cost:
        state.coins -= state.solar_cost
        state.solar_panels += 1
        # Inflasi: Harga panel surya naik 40% setelah dibeli
        state.solar_cost = int(state.solar_cost * 1.4)
        
    return state

@app.post("/api/reset")
def reset_game():
    """Mengulang permainan ke kondisi awal."""
    global state
    state = GameState()
    return state