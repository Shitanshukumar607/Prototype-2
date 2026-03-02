"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { RandomObjects } from "@/components/random-objects";

export function SiteBackground() {
    const pathname = usePathname();
    const [fadeOpacity, setFadeOpacity] = useState(0);
    const isEventsPage = pathname?.startsWith("/events") ?? false;
    const isContactPage = pathname === "/contact";
    const hidePurpleGradient = isEventsPage || isContactPage;

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

            {/* Floating 3D Objects */}
            <RandomObjects />

            {/* Scroll-triggered Black Overlay — fades in on scroll so purplish theme vanishes; particle canvas (z-10) stays on top */}
            <div
                className="pointer-events-none fixed inset-0 w-full h-[100vh] bg-black z-[2]"
                style={{ opacity: isEventsPage ? 0 : fadeOpacity }}
                aria-hidden
            />
        </>
    );
}
