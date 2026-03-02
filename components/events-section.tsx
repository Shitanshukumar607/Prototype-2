"use client"

import { useState, useEffect } from "react"
import { Trophy, Gamepad2, Lock, Database, Terminal, Cog, Sparkles, Brain } from "lucide-react"

interface EventsSectionProps {
  scrollProgress: number
}

const CATEGORIES = [
  {
    id: "hackathon", title: "Grand Hackathon", short: "HACKATHON", index: "01",
    icon: Trophy, color: "#f59e0b",
    events: [{ name: "Grand Hackathon", flagship: true }],
  },
  {
    id: "gaming", title: "Gaming & Combat", short: "GAMING", index: "02",
    icon: Gamepad2, color: "#ef4444",
    events: [
      { name: "Robowars", flagship: true },
      { name: "RC Car Racing", flagship: false },
      { name: "Valorant", flagship: false },
      { name: "BGMI", flagship: false },
    ],
  },
  {
    id: "ai", title: "Artificial Intelligence", short: "AI", index: "03",
    icon: Brain, color: "#a78bfa",
    events: [
      { name: "The Turing Test", flagship: false },
      { name: "Reverse Prompt Engineering", flagship: false },
    ],
  },
  {
    id: "cyber", title: "Cybersecurity", short: "CYBER", index: "04",
    icon: Lock, color: "#4ade80",
    events: [
      { name: "Zero Day Arena", flagship: true },
      { name: "Escape & Exploit", flagship: false },
    ],
  },
  {
    id: "data", title: "Data Science", short: "DATA", index: "05",
    icon: Database, color: "#60a5fa",
    events: [
      { name: "Data Royale", flagship: true },
      { name: "Data Decoded", flagship: false },
      { name: "SDG Data Jam", flagship: false },
      { name: "Kill Switch", flagship: false },
    ],
  },
  {
    id: "coding", title: "Coding & Logic", short: "CODING", index: "06",
    icon: Terminal, color: "#fb923c",
    events: [
      { name: "Code Conundrum", flagship: false },
      { name: "Version Control Wars", flagship: false },
      { name: "Tech Escape Quest", flagship: false },
      { name: "Bug Buster", flagship: false },
    ],
  },
  {
    id: "core", title: "Core Engineering", short: "CORE", index: "07",
    icon: Cog, color: "#fbbf24",
    events: [
      { name: "Design. Decide. Dominate.", flagship: true },
      { name: "Electraforge", flagship: true },
      { name: "IoT Nexus", flagship: true },
      { name: "Innovatrium", flagship: true },
      { name: "Circuitrix", flagship: false },
      { name: "Bridge IT", flagship: false },
      { name: "Embedded Escape Room", flagship: false },
    ],
  },
  {
    id: "quiz", title: "Quiz & Ideas", short: "IDEAS", index: "08",
    icon: Sparkles, color: "#f472b6",
    events: [
      { name: "Ideathon Arena", flagship: false },
      { name: "Biznova", flagship: true },
    ],
  },
]

// Pointy-top hexagon path
function hexPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  })
  return `M${pts.join("L")}Z`
}

const GRID_POS = [
  { col: 0, row: 0 }, { col: 1, row: 0 }, { col: 2, row: 0 },
  { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 },
  { col: 0, row: 2 }, { col: 1, row: 2 },
]

function useWindowWidth() {
  const [w, setW] = useState(1200)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    fn()
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])
  return w
}

export default function EventsSection({ scrollProgress }: EventsSectionProps) {
  const [selected, setSelected] = useState(CATEGORIES[0].id)
  const [prevSelected, setPrevSelected] = useState(CATEGORIES[0].id)
  const [animKey, setAnimKey] = useState(0)
  const vw = useWindowWidth()
  const isMobile = vw < 768

  const sp = Math.max(0, Math.min(1, (scrollProgress - 0.1) / 0.85))

  const handleSelect = (id: string) => {
    if (id === selected) return
    setPrevSelected(selected)
    setSelected(id)
    setAnimKey(k => k + 1)
  }

  const hexR = isMobile ? Math.min(vw / 8.5, 48) : 62
  const gapX = hexR * 1.78
  const gapY = hexR * 1.54

  const centers = GRID_POS.map(({ col, row }) => ({
    x: col * gapX + hexR + (row % 2 === 1 ? gapX * 0.5 : 0),
    y: row * gapY + hexR,
  }))

  const svgW = gapX * 2 + hexR * 2
  const svgH = gapY * 2 + hexR * 2

  const selectedCat = CATEGORIES.find(c => c.id === selected)!

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: isMobile ? "52px 0 52px" : "80px 0 80px",
      background: "transparent",
    }}>
      <style>{`
        @keyframes panel-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes item-in {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes hex-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes tick-in {
          from { stroke-dashoffset: 200; }
          to   { stroke-dashoffset: 0; }
        }
        .hex-g { cursor: pointer; }
        .hex-g:hover .hex-bg { fill: rgba(255,255,255,0.1); }
        .jump-pill:hover { background: rgba(255,255,255,0.12) !important; color: rgba(255,255,255,0.9) !important; }
      `}</style>

      {/* ── TITLE ── */}
      <div style={{
        width: "100%",
        maxWidth: 1060,
        padding: isMobile ? "0 20px 36px" : "0 32px 52px",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "flex-end",
        justifyContent: "space-between",
        flexDirection: isMobile ? "column" : "row",
        gap: 16,
        borderBottom: "1px solid rgba(255,255,255,0.18)",
        marginBottom: isMobile ? 32 : 48,
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: "'Palatino Linotype', 'Book Antiqua', Georgia, serif",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 0.9,
          fontSize: "clamp(3.2rem, 8vw, 6rem)",
          color: "white",
          textShadow: "0 6px 18px rgba(0,0,0,0.5)",
        }}>
          EVENT<br />
          <span style={{ color: "rgba(255,255,255,0.5)", WebkitTextStroke: "1px rgba(255,255,255,0.45)" }}>
            GRID
          </span>
        </h2>

        <div style={{ textAlign: isMobile ? "left" : "right", flexShrink: 0 }}>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "monospace", letterSpacing: "0.2em", lineHeight: 2 }}>
            8 CATEGORIES<br />28+ EVENTS
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 36 : 56,
        alignItems: "flex-start",
        width: "100%",
        maxWidth: 1060,
        padding: isMobile ? "0 20px" : "0 32px",
      }}>

        {/* ── HEX GRID ── */}
        <div style={{
          flexShrink: 0,
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-start",
          width: isMobile ? "100%" : "auto",
          overflow: "visible",
        }}>
          <svg
            width={svgW + 20}
            height={svgH + 20}
            viewBox={`-10 -10 ${svgW + 20} ${svgH + 20}`}
            style={{ overflow: "visible", display: "block" }}
          >
            <defs>
              <filter id="f-none" />
            </defs>

            {CATEGORIES.map((cat, i) => {
              const { x, y } = centers[i]
              const active = selected === cat.id
              const revealed = sp > i / (CATEGORIES.length + 2)
              const Icon = cat.icon
              const iconSz = isMobile ? 13 : 16

              return (
                <g
                  key={cat.id}
                  className="hex-g"
                  onClick={() => handleSelect(cat.id)}
                  style={{
                    opacity: revealed ? 1 : 0,
                    animation: revealed
                      ? `hex-in 0.45s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.06}s both`
                      : "none",
                  }}
                >
                  {/* Active: filled solid hex in category color */}
                  {/* Inactive: just a thin stroke hex */}

                  {/* Hex fill */}
                  <path
                    className="hex-bg"
                    d={hexPath(x, y, hexR - 2)}
                    fill={active ? cat.color : "transparent"}
                    stroke={active ? cat.color : "rgba(255,255,255,0.62)"}
                    strokeWidth={active ? 0 : 1.5}
                    style={{ transition: "fill 0.25s ease, stroke 0.25s ease" }}
                  />

                  {/* Active index watermark */}
                  {active && (
                    <text
                      x={x - hexR * 0.55} y={y - hexR * 0.3}
                      fill="rgba(0,0,0,0.12)"
                      fontSize={hexR * 0.7}
                      fontFamily="monospace"
                      fontWeight={900}
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {cat.index}
                    </text>
                  )}

                  {/* Icon */}
                  <foreignObject
                    x={x - iconSz / 2}
                    y={y - (isMobile ? 10 : 14) - iconSz / 2}
                    width={iconSz}
                    height={iconSz}
                    style={{ pointerEvents: "none", overflow: "visible" }}
                  >
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "100%", height: "100%",
                    }}>
                      <Icon style={{
                        width: iconSz,
                        height: iconSz,
                        color: active ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.9)",
                        display: "block",
                        transition: "color 0.25s ease",
                      }} />
                    </div>
                  </foreignObject>

                  {/* Label */}
                  <text
                    x={x} y={y + (isMobile ? 13 : 17)}
                    textAnchor="middle"
                    fill={active ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.95)"}
                    fontSize={isMobile ? 6.8 : 8.5}
                    fontFamily="monospace"
                    fontWeight={700}
                    letterSpacing="0.08em"
                    style={{ pointerEvents: "none", transition: "fill 0.25s ease" }}
                  >
                    {cat.short}
                  </text>

                  {/* Count badge — top right corner of hex */}
                  <circle
                    cx={x + hexR * 0.58} cy={y - hexR * 0.58}
                    r={isMobile ? 8.5 : 10.5}
                    fill={active ? "rgba(0,0,0,0.3)" : "rgba(5,8,18,0.96)"}
                    stroke={active ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.36)"}
                    strokeWidth={1}
                    style={{ transition: "all 0.25s ease" }}
                  />
                  <text
                    x={x + hexR * 0.58} y={y - hexR * 0.58 + 4}
                    textAnchor="middle"
                    fill={active ? "rgba(0,0,0,0.82)" : "rgba(255,255,255,0.98)"}
                    fontSize={isMobile ? 7 : 8.5}
                    fontFamily="monospace"
                    fontWeight={800}
                    style={{ pointerEvents: "none", transition: "fill 0.25s ease" }}
                  >
                    {cat.events.length}
                  </text>

                  {/* Invisible full hit area */}
                  <path
                    d={hexPath(x, y, hexR + 4)}
                    fill="transparent"
                    stroke="none"
                    style={{ cursor: "pointer" }}
                  />
                </g>
              )
            })}
          </svg>
        </div>

        {/* ── EVENT PANEL ── */}
        <div style={{ flex: 1, minWidth: 0, width: "100%" }}>

          {/* Category label row */}
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 24,
            paddingBottom: 20,
            borderBottom: `2px solid ${selectedCat.color}`,
            transition: "border-color 0.3s ease",
          }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.2em",
            }}>
              {selectedCat.index}
            </span>
            <h3 style={{
              margin: 0,
              fontFamily: "'Palatino Linotype', 'Book Antiqua', Georgia, serif",
              fontWeight: 800,
              fontSize: isMobile ? 22 : 30,
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              flex: 1,
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
            }}>
              {selectedCat.title}
            </h3>
            <div style={{
              width: 36, height: 36,
              borderRadius: "50%",
              background: selectedCat.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.3s ease",
            }}>
              {(() => { const Icon = selectedCat.icon; return <Icon style={{ width: 16, height: 16, color: "rgba(0,0,0,0.7)" }} /> })()}
            </div>
          </div>

          {/* Events list */}
          <div
            key={animKey}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {selectedCat.events.map((ev, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.14)",
                  animation: `item-in 0.3s ease ${i * 0.05}s both`,
                }}
              >
                {/* Number */}
                <span style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.9)",
                  letterSpacing: "0.1em",
                  width: 20,
                  flexShrink: 0,
                  textAlign: "right",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Divider tick */}
                <div style={{
                  width: 1,
                  height: 20,
                  background: ev.flagship ? selectedCat.color : "rgba(255,255,255,0.1)",
                  flexShrink: 0,
                  transition: "background 0.3s",
                }} />

                {/* Name */}
                <span style={{
                  flex: 1,
                  fontFamily: "'Palatino Linotype', 'Book Antiqua', Georgia, serif",
                  fontSize: isMobile ? 15 : 17,
                  fontWeight: ev.flagship ? 600 : 400,
                  color: ev.flagship ? "white" : "rgba(255,255,255,0.95)",
                  letterSpacing: "0.01em",
                  textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                  transition: "color 0.3s",
                }}>
                  {ev.name}
                </span>

                {/* Flagship marker */}
                {ev.flagship && (
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: selectedCat.color,
                    flexShrink: 0,
                    transition: "background 0.3s",
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Meta row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}>
            <span style={{
              fontFamily: "monospace", fontSize: 11,
              color: "rgba(255,255,255,0.88)", letterSpacing: "0.18em",
            }}>
              {selectedCat.events.length} EVENT{selectedCat.events.length !== 1 ? "S" : ""}
            </span>
            {selectedCat.events.filter(e => e.flagship).length > 0 && (
              <span style={{
                fontFamily: "monospace", fontSize: 11,
                color: "rgba(255,255,255,0.88)", letterSpacing: "0.18em",
              }}>
                {selectedCat.events.filter(e => e.flagship).length} FLAGSHIP
              </span>
            )}
            <div style={{ flex: 1 }} />
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: selectedCat.color,
              transition: "background 0.3s",
            }} />
          </div>

          {/* ── Quick-nav ── */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 28,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.14)",
          }}>
            {CATEGORIES.map(cat => {
              const active = selected === cat.id
              return (
                <button
                  key={cat.id}
                  className="jump-pill"
                  onClick={() => handleSelect(cat.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 2,
                    border: active
                      ? `1px solid ${cat.color}`
                      : "1px solid rgba(255,255,255,0.36)",
                    background: active ? cat.color : "transparent",
                    color: active ? "rgba(0,0,0,0.78)" : "rgba(255,255,255,0.95)",
                    fontSize: 10,
                    fontFamily: "monospace",
                    letterSpacing: "0.12em",
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat.short}
                </button>
              )
            })}
          </div>

          {/* ── Stats ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            marginTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.14)",
            opacity: sp > 0.4 ? 1 : 0,
            transform: sp > 0.4 ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}>
            {[
              { n: "08", l: "CATEGORIES" },
              { n: "28+", l: "EVENTS" },
              { n: "12", l: "FLAGSHIP" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "16px 0",
                textAlign: i === 0 ? "left" : i === 2 ? "right" : "center",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.14)" : "none",
              }}>
                <div style={{
                  color: "white",
                  fontSize: isMobile ? 20 : 26,
                  fontWeight: 900,
                  fontFamily: "'Palatino Linotype', Georgia, serif",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 10px rgba(0,0,0,0.55)",
                }}>
                  {s.n}
                </div>
                <div style={{
                  color: "rgba(255,255,255,0.86)",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  marginTop: 5,
                  fontFamily: "monospace",
                }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}