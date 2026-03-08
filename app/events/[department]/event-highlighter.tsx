"use client"

import { useEffect } from "react"

const BEAM_CSS = `
  .event-card-lit {
    position: relative;
    box-shadow:
      0 0 0 1px rgba(168, 85, 247, 0.35),
      0 0 26px rgba(168, 85, 247, 0.24) !important;
    transition: box-shadow 0.4s ease;
  }

  .event-border-beam {
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    pointer-events: none;
    z-index: 20;
    border: 1px solid rgba(216, 180, 254, 0.7);
    box-shadow:
      0 0 24px rgba(139, 92, 246, 0.6),
      0 0 40px rgba(196, 181, 253, 0.45);
    opacity: 0;
    animation: soft-glow 1.8s ease-out 2 alternate forwards;
  }

  @keyframes soft-glow {
    0% {
      opacity: 0;
      transform: scale(0.97);
    }
    20% {
      opacity: 1;
      transform: scale(1);
    }
    70% {
      opacity: 0.7;
      transform: scale(1.01);
    }
    100% {
      opacity: 0;
      transform: scale(1.02);
    }
  }
`

export function EventHighlighter() {
  useEffect(() => {
    // Inject styles client-side only to avoid SSR/hydration mismatch
    const styleEl = document.createElement("style")
    styleEl.id = "event-beam-styles"
    if (!document.getElementById("event-beam-styles")) {
      styleEl.textContent = BEAM_CSS
      document.head.appendChild(styleEl)
    }

    const hash = window.location.hash
    if (!hash.startsWith("#event-")) return

    const el = document.getElementById(hash.slice(1))
    if (!el) return

    el.scrollIntoView({ behavior: "smooth", block: "center" })

    const startTimer = setTimeout(() => {
      el.classList.add("event-card-lit")
      el.style.position = "relative"

      const beam = document.createElement("span")
      beam.className = "event-border-beam"
      el.appendChild(beam)

      const cleanupTimer = setTimeout(() => {
        beam.remove()
        el.classList.remove("event-card-lit")
        el.style.position = ""
      }, 2250)

      return () => clearTimeout(cleanupTimer)
    }, 450)

    return () => clearTimeout(startTimer)
  }, [])

  return null
}
