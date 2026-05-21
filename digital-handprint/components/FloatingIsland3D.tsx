"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- ANIMASI UTILITY 3D (POP-UP) ---
function PopUp3D({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetScale = 1;
      const smoothScale = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 12, delta);
      groupRef.current.scale.set(smoothScale, smoothScale, smoothScale);
    }
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>
      {children}
    </group>
  );
}

// --- KOMPONEN LINGKUNGAN DETAIL ---
function Cloud3D({ position, scale = 1, color = "#ffffff", speed = 0.2 }: { position: [number, number, number], scale?: number, color?: string, speed?: number }) {
  const cloudRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (cloudRef.current) {
      cloudRef.current.position.x = position[0] + Math.sin(clock.elapsedTime * speed) * 0.5;
      cloudRef.current.rotation.y = clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={cloudRef} position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.2, 7, 7]} />
        <meshStandardMaterial color={color} roughness={1} flatShading />
      </mesh>
      <mesh position={[0.15, -0.05, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 7, 7]} />
        <meshStandardMaterial color={color} roughness={1} flatShading />
      </mesh>
      <mesh position={[-0.15, -0.05, -0.05]} castShadow>
        <sphereGeometry args={[0.18, 7, 7]} />
        <meshStandardMaterial color={color} roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function Smog3D({ count = 20, color = "#475569", scale = 1, bounds = 2.5 }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.elapsedTime;
      groupRef.current.children.forEach((puff, i) => {
        puff.position.y += 0.006;
        puff.position.x += Math.sin(t * 0.5 + i) * 0.003;
        puff.position.z += Math.cos(t * 0.5 + i) * 0.003;
        
        if (puff.position.y > 2.5) {
           puff.position.y = 0.2;
           puff.position.x = (Math.random() - 0.5) * bounds;
           puff.position.z = (Math.random() - 0.5) * bounds;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(count)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * bounds, 
            Math.random() * 2 + 0.2, 
            (Math.random() - 0.5) * bounds
          ]}
          scale={Math.random() * 0.4 * scale + 0.2}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color={color} transparent opacity={0.35} flatShading depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Rock3D({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <mesh position={position} scale={[scale, scale, scale]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial color="#94a3b8" roughness={0.8} flatShading />
    </mesh>
  );
}

function Tree3D({ position, color, scale = 1 }: { position: [number, number, number]; color: string, scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.1, 0.5, 5]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.3, 0.7, 6]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>
    </group>
  );
}

// --- KOMPONEN KEHIDUPAN & URBANISASI ---
function Bird3D({ radius, speed, height, offset }: { radius: number, speed: number, height: number, offset: number }) {
  const birdRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (birdRef.current) {
      const t = clock.elapsedTime * speed + offset;
      birdRef.current.position.x = Math.cos(t) * radius;
      birdRef.current.position.z = Math.sin(t) * radius;
      birdRef.current.position.y = height + Math.sin(t * 5) * 0.1;
      birdRef.current.rotation.y = -t + Math.PI;
      birdRef.current.rotation.z = Math.sin(t * 15) * 0.2;
    }
  });

  return (
    <group ref={birdRef}>
      <mesh castShadow>
        <coneGeometry args={[0.03, 0.1, 3]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

function Animal3D({ radius, speed, color, offset }: { radius: number, speed: number, color: string, offset: number }) {
  const animalRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (animalRef.current) {
      const t = clock.elapsedTime * speed + offset;
      const currentRadius = radius + Math.sin(t * 0.5) * 0.4;
      const angle = t * 0.8 + Math.cos(t * 0.3) * 0.5;
      
      const x = Math.cos(angle) * currentRadius;
      const z = Math.sin(angle) * currentRadius;
      
      const futureT = t + 0.05;
      const futureRadius = radius + Math.sin(futureT * 0.5) * 0.4;
      const futureAngle = futureT * 0.8 + Math.cos(futureT * 0.3) * 0.5;
      const futureX = Math.cos(futureAngle) * futureRadius;
      const futureZ = Math.sin(futureAngle) * futureRadius;

      animalRef.current.position.x = x;
      animalRef.current.position.z = z;
      animalRef.current.position.y = 0.45 + Math.abs(Math.sin(t * 8)) * 0.06;
      animalRef.current.rotation.y = Math.atan2(x - futureX, z - futureZ);
    }
  });

  return (
    <group ref={animalRef}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.12, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Road3D() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.41, 0]} receiveShadow>
      <ringGeometry args={[0.9, 1.5, 32]} />
      <meshStandardMaterial color="#334155" roughness={0.8} />
    </mesh>
  );
}

function Car3D({ radius, speed, offset, color = "#ef4444" }: { radius: number, speed: number, offset: number, color?: string }) {
  const carRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (carRef.current) {
      const t = clock.elapsedTime * speed + offset;
      carRef.current.position.x = Math.cos(t) * radius;
      carRef.current.position.z = Math.sin(t) * radius;
      carRef.current.rotation.y = -t + Math.PI; 
    }
  });

  return (
    <group ref={carRef} position={[0, 0.45, 0]}>
      <mesh castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[0.12, 0.08, 0.28]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.12, -0.02]}>
        <boxGeometry args={[0.1, 0.06, 0.14]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Worker3D({ start, end, speed, delay, color = "#2563eb" }: { start: [number, number, number], end: [number, number, number], speed: number, delay: number, color?: string }) {
  const workerRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (workerRef.current) {
      const t = clock.elapsedTime * speed + delay;
      const pingPong = (Math.sin(t) + 1) / 2; 
      workerRef.current.position.x = THREE.MathUtils.lerp(start[0], end[0], pingPong);
      workerRef.current.position.z = THREE.MathUtils.lerp(start[2], end[2], pingPong);
      workerRef.current.position.y = start[1] + Math.abs(Math.sin(t * 12)) * 0.04;

      const isGoingForward = Math.cos(t) > 0;
      workerRef.current.rotation.y = isGoingForward 
        ? Math.atan2(end[0] - start[0], end[2] - start[2])
        : Math.atan2(start[0] - end[0], start[2] - end[2]);
    }
  });

  return (
    <group ref={workerRef}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.08, 0.18, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#eab308" flatShading />
      </mesh>
    </group>
  );
}

// --- KOMPONEN PABRIK & GEDUNG ---
function Factory3D({ position, scale = 1, smogColor = "#94a3b8" }: { position: [number, number, number], scale?: number, smogColor?: string }) {
  const smokeRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (smokeRef.current) {
      smokeRef.current.children.forEach((particle) => {
        particle.position.y += 0.015 * scale;
        particle.position.x += (Math.random() - 0.5) * 0.01;
        if (particle.position.y > 1.8 * scale) {
          particle.position.y = 0.7 * scale;
          particle.position.x = (Math.random() - 0.5) * 0.1 * scale;
        }
      });
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.6, 0.15]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.4, 6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <group ref={smokeRef}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 0.1, 0.7 + i * 0.2, (Math.random() - 0.5) * 0.1]}>
            <sphereGeometry args={[0.15, 5, 5]} />
            <meshStandardMaterial color={smogColor} transparent opacity={0.4} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function OfficeBuilding3D({ position, height, lightColor = "#fbbf24" }: { position: [number, number, number], height: number, lightColor?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2 + 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, height, 0.35]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.5} flatShading />
      </mesh>
      <mesh position={[0, height / 2 + 0.4, 0.176]}>
        <planeGeometry args={[0.15, height * 0.8]} />
        <meshBasicMaterial color={lightColor} wireframe />
      </mesh>
    </group>
  );
}

// --- CORE LINGKUNGAN PULAU 3D ---
export default function FloatingIsland3D({ envState }: { envState: "lush" | "struggling" | "damaged" }) {
  const islandRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (islandRef.current) islandRef.current.rotation.y += 0.0015;
  });

  const groundColor = envState === "lush" ? "#10b981" : envState === "struggling" ? "#d97706" : "#475569";
  const waterColor = envState === "lush" ? "#0ea5e9" : envState === "struggling" ? "#0369a1" : "#020617";
  const waterOpacity = envState === "lush" ? 0.7 : 0.9;

  return (
    <group ref={islandRef} position={[0, -0.5, 0]}>
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.6, 0.8, 12]} />
        <meshStandardMaterial color={groundColor} roughness={1} flatShading />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
        <ringGeometry args={[2.2, 3.5, 24]} />
        <meshStandardMaterial color={waterColor} transparent opacity={waterOpacity} roughness={0.1} metalness={0.3} />
      </mesh>

      {envState === "lush" && (
        <PopUp3D key="lush-state">
          <Tree3D position={[-0.6, 0.4, 0.5]} color="#047857" scale={1.2} />
          <Tree3D position={[0.5, 0.4, -0.8]} color="#059669" />
          <Tree3D position={[-0.8, 0.4, -0.5]} color="#10b981" scale={0.8} />
          <Tree3D position={[0.8, 0.4, 0.6]} color="#34d399" scale={0.9} />
          <Tree3D position={[0.2, 0.4, -1.2]} color="#047857" scale={1.1} />
          <Rock3D position={[-1.2, 0.45, 0.2]} scale={1.5} />
          <Rock3D position={[1.0, 0.42, -0.2]} scale={1} />
          <Cloud3D position={[-1.5, 2, -1]} scale={1.2} />
          <Cloud3D position={[1.5, 2.5, 1]} scale={0.8} />
          <Animal3D radius={1.2} speed={0.4} color="#ffffff" offset={0} />
          <Animal3D radius={1.4} speed={0.5} color="#fef08a" offset={Math.PI} />
          <Animal3D radius={0.9} speed={0.3} color="#ffedd5" offset={Math.PI / 2} />
          <Bird3D radius={2.5} speed={0.3} height={2} offset={0} />
          <Bird3D radius={2.4} speed={0.3} height={2.1} offset={0.2} />
          <Bird3D radius={2.6} speed={0.3} height={1.9} offset={0.4} />
        </PopUp3D>
      )}

      {envState === "struggling" && (
        <PopUp3D key="struggling-state">
          <Tree3D position={[-0.6, 0.4, 0.5]} color="#b45309" scale={1} />
          <Tree3D position={[0.7, 0.4, 0.6]} color="#d97706" scale={0.8} />
          <Rock3D position={[-1.2, 0.45, 0.2]} scale={1.5} />
          <Road3D />
          <Car3D radius={1.2} speed={0.8} offset={0} color="#eab308" />
          <Factory3D position={[0.2, 0.4, -0.5]} />
          <Cloud3D position={[0, 2, 0]} scale={1.5} color="#cbd5e1" speed={0.1} />
          <Smog3D count={15} scale={0.8} color="#94a3b8" />
          <Worker3D start={[0.5, 0.4, -0.2]} end={[1.5, 0.4, 0.5]} speed={1} delay={0} />
          <Worker3D start={[-0.2, 0.4, -0.8]} end={[-1.2, 0.4, -0.2]} speed={1.2} delay={2} />
        </PopUp3D>
      )}

      {envState === "damaged" && (
        <PopUp3D key="damaged-state">
          <Road3D />
          <Car3D radius={1.2} speed={1.2} offset={0} color="#ef4444" />
          <Car3D radius={1.2} speed={1.2} offset={Math.PI} color="#3b82f6" />
          <Car3D radius={1.2} speed={1.2} offset={Math.PI / 2} color="#10b981" />
          <mesh position={[-0.5, 0.45, 0.4]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.15, 4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <Factory3D position={[-0.4, 0.4, 0.4]} scale={1.2} smogColor="#475569" />
          <Factory3D position={[0.5, 0.4, -0.4]} scale={1} smogColor="#334155" />
          <Factory3D position={[-1.4, 0.4, -1.4]} scale={0.9} smogColor="#1e293b" />
          <OfficeBuilding3D position={[1.7, 0, 0.5]} height={1.8} lightColor="#ef4444" />
          <OfficeBuilding3D position={[-0.8, 0, 1.7]} height={1.4} lightColor="#ef4444" />
          <OfficeBuilding3D position={[0.4, 0, 1.8]} height={2.2} />
          <Cloud3D position={[-1, 1.8, -1]} scale={2} color="#475569" speed={0.05} />
          <Cloud3D position={[1, 2.2, 1]} scale={1.5} color="#334155" speed={0.08} />
          <Smog3D count={45} scale={1.5} color="#475569" bounds={3} />
          <Smog3D count={20} scale={1.2} color="#1e293b" bounds={2} />
          <Worker3D start={[0, 0.4, 0]} end={[1.6, 0.4, 1.6]} speed={0.5} delay={0} color="#64748b" />
        </PopUp3D>
      )}
    </group>
  );
}