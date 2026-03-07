// @ts-nocheck
"use client";
import { AmbientLight, DirectionalLight } from "three";
import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Clone, Preload } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATHS = [
    "/moon_rock_03_4k.gltf",
    "/scene.gltf",
    "/rocket.gltf",
];

const MODEL_CONFIGS: Record<string, { baseScale: number }> = {
    "/moon_rock_03_4k.gltf": { baseScale: 1 },
    "/scene.gltf": { baseScale: 0.015 },
    "/rocket.gltf": { baseScale: 0.0008 }
    // significantly reduce scale for this model
};

function FloatingModel({ modelPath, startPos, scale, speed, direction }: { modelPath: string, startPos: [number, number, number], scale: number, speed: number, direction: [number, number, number] }) {
    const { scene } = useGLTF(modelPath);
    const ref = useRef<THREE.Group>(null);

    // Initial random rotation setup
    useEffect(() => {
        if (ref.current) {
            ref.current.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            ref.current.position.set(...startPos);
        }
    }, [startPos]);

    useFrame((state, delta) => {
        if (!ref.current) return;
        // Move in the random direction
        ref.current.position.x += direction[0] * speed * delta;
        ref.current.position.y += direction[1] * speed * delta;
        ref.current.position.z += direction[2] * speed * delta;

        // Slow rotation 
        ref.current.rotation.x += 0.2 * delta;
        ref.current.rotation.y += 0.3 * delta;

        // Wrap around logic if it goes too far off-screen
        if (ref.current.position.x > 25) ref.current.position.x = -25;
        if (ref.current.position.x < -25) ref.current.position.x = 25;
        if (ref.current.position.y > 20) ref.current.position.y = -20;
        if (ref.current.position.y < -20) ref.current.position.y = 20;
    });

    return (
        <group ref={ref} scale={scale}>
            <Clone object={scene} />
        </group>
    );
}

// Pre-load all GLTF files
MODEL_PATHS.forEach((path) => useGLTF.preload(path));

export function RandomObjects({ zIndexClass = "z-0" }: { zIndexClass?: string }) {
    const [objects, setObjects] = useState<{ id: number; modelPath: string; startPos: [number, number, number]; scale: number; speed: number; direction: [number, number, number] }[]>([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const onVisibilityChange = () => setVisible(!document.hidden);
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    }, []);

    useEffect(() => {
        const width = typeof window !== "undefined" ? window.innerWidth : 1024;
        const isMobile = width < 768;
        // Do not render any 3D objects on mobile devices
        const count = isMobile ? 0 : 12;
        // Generate random objects after mount to avoid hydration mismatch
        const newObjects = Array.from({ length: count }).map((_, i) => {
            // Start objects outside the visible screen (edges are around +/- 25 for x, +/- 20 for y)
            const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
            let startX = 0;
            let startY = 0;
            const startZ = (Math.random() - 0.5) * 5;

            if (edge === 0) { // top
                startX = (Math.random() - 0.5) * 50;
                startY = 20 + Math.random() * 5;
            } else if (edge === 1) { // right
                startX = 25 + Math.random() * 5;
                startY = (Math.random() - 0.5) * 40;
            } else if (edge === 2) { // bottom
                startX = (Math.random() - 0.5) * 50;
                startY = -20 - Math.random() * 5;
            } else { // left
                startX = -25 - Math.random() * 5;
                startY = (Math.random() - 0.5) * 40;
            }

            // Make the direction point generally towards the screen center
            // Center is (0,0), so direction vector from (startX, startY) is (-startX, -startY)
            // Add some randomness to it
            const targetX = (Math.random() - 0.5) * 30; // Random target on screen
            const targetY = (Math.random() - 0.5) * 20;
            let dirX = targetX - startX;
            let dirY = targetY - startY;
            let dirZ = (Math.random() - 0.5) * 0.5;

            // Normalize direction vector
            const length = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

            // Randomly select a model path with weighted probability (more moon rocks, fewer rockets)
            const weights = [0.6, 0.3, 0.1]; // moon_rock, scene, rocket
            const randomValue = Math.random();
            let modelIndex = 0;
            if (randomValue < weights[0]) {
                modelIndex = 0;
            } else if (randomValue < weights[0] + weights[1]) {
                modelIndex = 1;
            } else {
                modelIndex = 2;
            }
            const randomModelPath = MODEL_PATHS[modelIndex];
            const config = MODEL_CONFIGS[randomModelPath] || { baseScale: 1 };

            return {
                id: i,
                modelPath: randomModelPath,
                startPos: [startX, startY, startZ] as [number, number, number],
                scale: (Math.random() * 10 + 5) * config.baseScale * (typeof window !== "undefined" && window.innerWidth < 768 ? 0.6 : 1), // Responsive scale
                speed: Math.random() * 2 + 0.5, // 0.5 to 2.5 units per second
                direction: [dirX / length, dirY / length, dirZ / length] as [number, number, number]
            };
        });
        setObjects(newObjects);
    }, []);

    if (objects.length === 0 || !visible) return null;

    return (
        <div
            className={`fixed inset-0 pointer-events-none ${zIndexClass} overflow-hidden`}
            aria-hidden
        >
            {/* Optimized Canvas: lower DPR, performance scaling, and pause when tab is hidden */}
            <Canvas
                camera={{ position: [0, 0, 15], fov: 45 }}
                frameloop={visible ? "always" : "demand"}
                dpr={[1, 1.2]}
                performance={{ min: 0.5 }}
                gl={{ powerPreference: "high-performance" }}
            >
                <ambientLight intensity={0} />
                <directionalLight position={[0, 10, 0]} intensity={1} />
                <directionalLight position={[-10, -10, -5]} intensity={3} color="#0055FF" />

                <Suspense fallback={null}>
                    {objects.map((obj) => (
                        <FloatingModel
                            key={obj.id}
                            modelPath={obj.modelPath}
                            startPos={obj.startPos}
                            scale={obj.scale}
                            speed={obj.speed}
                            direction={obj.direction}
                        />
                    ))}
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
