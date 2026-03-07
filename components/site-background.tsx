"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Three.js + @react-three/fiber + GLTF are the heaviest client chunks; load only on desktop and after first paint.
const RandomObjects = dynamic(
    () => import("@/components/random-objects").then((m) => m.RandomObjects),
    { ssr: false }
);

export function SiteBackground() {
    const pathname = usePathname();
    const [fadeOpacity, setFadeOpacity] = useState(0);
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
    const [defer3D, setDefer3D] = useState(true);
    const isEventsPage = pathname?.startsWith("/events") ?? false;
    const isContactPage = pathname === "/contact";
    const hidePurpleGradient = isEventsPage || isContactPage;
    const objectsZ = isEventsPage || isContactPage ? "z-[11]" : "z-0";

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const startFade = 80;
                const endFade = 900;
                if (scrollY <= startFade) {
                    setFadeOpacity(0);
                } else if (scrollY >= endFade) {
                    setFadeOpacity(1);
                } else {
                    setFadeOpacity((scrollY - startFade) / (endFade - startFade));
                }
                ticking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const updateViewport = () => {
            if (typeof window === "undefined") return;
            setIsDesktop(window.innerWidth >= 768);
        };
        updateViewport();
        window.addEventListener("resize", updateViewport);
        return () => window.removeEventListener("resize", updateViewport);
    }, []);

    // Defer loading the heavy Three.js chunk until after first paint so main bundle stays fast.
    useEffect(() => {
        if (!defer3D) return;
        const t = requestAnimationFrame(() => {
            requestAnimationFrame(() => setDefer3D(false));
        });
        return () => cancelAnimationFrame(t);
    }, [defer3D]);

    return (
        <>
            {/* Base Global Background Color */}
            <div className="fixed inset-0 min-h-screen w-full bg-black z-[-2]" />

            {/* Top radial gradient (ambient lighting) — hidden on events and contact to avoid purple tint */}
            {!hidePurpleGradient && (
                <div
                    className="pointer-events-none fixed top-0 left-0 w-full h-[100vh] z-[-1]"
                    style={{
                        background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.35) 0%, rgba(147, 51, 234, 0.15) 50%, transparent 80%)'
                    }}
                    aria-hidden
                />
            )}

            {/* Floating 3D Objects — desktop only, after first paint to keep initial load light */}
            {isDesktop && !defer3D && <RandomObjects zIndexClass={objectsZ} />}

            {/* Scroll-triggered Black Overlay — fades in on scroll so purplish theme vanishes; particle canvas (z-10) stays on top */}
            <div
                className="pointer-events-none fixed inset-0 w-full h-[100vh] bg-black z-[2]"
                style={{ opacity: isEventsPage ? 0 : fadeOpacity }}
                aria-hidden
            />
        </>
    );
}
