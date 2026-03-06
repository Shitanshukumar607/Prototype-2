"use client"

import { useEffect } from "react"

const BEAM_CSS = `
  @property --beam-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  .event-card-lit {
    box-shadow:
      0 0 0 1px rgba(168, 85, 247, 0.35),
      0 0 28px rgba(168, 85, 247, 0.18) !important;
    transition: box-shadow 0.4s ease;
  }

  .event-border-beam {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: 20;

    background: conic-gradient(
      from var(--beam-angle),
      transparent 72%,
      rgba(139, 92, 246, 0.45)  80%,
      rgba(192, 132, 252, 0.9)  84%,
      rgba(255, 255, 255, 0.95) 87%,
      rgba(232, 121, 249, 0.7)  90%,
      transparent               95%
    );

    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    padding: 2px;

    animation:
      beam-spin 1.05s linear 2,
      beam-fade 2.1s ease-out forwards;
  }

  @keyframes beam-spin {
    to { --beam-angle: 360deg; }
  }

  @keyframes beam-fade {
    0%,  68% { opacity: 1; }
    100%      { opacity: 0; }
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
