"use client"
import { useEffect, useState } from "react"
import LuminusParticles from "@/components/LuminusParticles"

export default function Page() {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const fadeEnd = window.innerHeight * 0.4
      setOpacity(1 - Math.min(scrollY / fadeEnd, 1))
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main style={{ position: "relative", minHeight: "300vh", background: "#000" }}>
      <LuminusParticles />

      <div
        style={{
          position: "fixed",
          bottom: "18vh",
          left: 0,
          width: "100%",
          textAlign: "center",
          zIndex: 20,
          opacity,
          pointerEvents: "none",
          padding: "0 24px",
        }}
      >
        <p style={{ color: "#cccccc", lineHeight: 1.75, maxWidth: "560px", margin: "0 auto", fontSize: "1rem" }}>
          LUMINUS is more than a tech fest — it&apos;s a convergence of the brightest
          minds, boldest ideas, and most disruptive technologies. For three days,
          our campus transforms into a launchpad for innovation.
        </p>
      </div>
    </main>
  )
}