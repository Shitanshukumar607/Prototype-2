"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  Trophy,
  Gamepad2,
  Brain,
  Lock,
  Database,
  Code2,
  Cpu,
  Zap,
  Network,
  Laptop,
  Cog,
  Building2,
  Briefcase,
  Sparkles,
} from "lucide-react"
import { departments } from "@/lib/events-data"

interface EventsSectionProps {
  scrollProgress: number
}

const DEPARTMENT_ICONS: Record<string, LucideIcon> = {
  aiml: Brain,
  cy: Lock,
  cse: Code2,
  csds: Database,
  ece: Cpu,
  eee: Zap,
  ise: Network,
  mca: Laptop,
  mech: Cog,
  civil: Building2,
  mba: Briefcase,
  gaming: Gamepad2,
  "grand-hackathon": Trophy,
}

const COLORS = [
  "#f59e0b",
  "#ef4444",
  "#a78bfa",
  "#4ade80",
  "#60a5fa",
  "#fb923c",
  "#fbbf24",
  "#f472b6",
  "#22d3ee",
  "#93c5fd",
  "#86efac",
  "#fca5a5",
  "#c4b5fd",
]

/** Returns black or white depending on which has better contrast against the given hex color. */
function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.95)"
}

const BASE_CATEGORIES = departments.map((dept, i) => ({
  id: dept.id,
  title: dept.fullName ?? dept.name,
  short: dept.id === "grand-hackathon" ? "HACKATHON" : dept.name,
  originalIndex: i,
  icon: DEPARTMENT_ICONS[dept.id] ?? Sparkles,
  color: COLORS[i % COLORS.length],
  events: dept.events.map((ev) => ({
    name: ev.name,
    flagship: ev.type === "Flagship" || ev.tag === "Grand Hackathon",
  })),
}))

// Reorder so that the Grand Hackathon hexagon appears first in the grid
const CATEGORIES = BASE_CATEGORIES
  .slice()
  .sort((a, b) => {
    const rank = (id: string) => (id === "grand-hackathon" ? 0 : 1)
    return rank(a.id) - rank(b.id)
  })
  .map((cat, displayIndex) => ({
    ...cat,
    index: String(displayIndex + 1).padStart(2, "0"),
  }))

// Total number of events in all departments (keeps the summary accurate even if events change).
const totalEvents = departments.reduce((acc, dept) => acc + dept.events.length, 0)
const flagshipCount = departments.reduce(
  (acc, dept) => acc + dept.events.filter((ev) => ev.type === "Flagship" || ev.tag === "Grand Hackathon").length,
  0
)
const minorCount = departments.reduce(
  (acc, dept) => acc + dept.events.filter((ev) => ev.type === "Minor").length,
  0
)
const gamingEvents = departments.find((dept) => dept.id === "gaming")?.events.length ?? 0

const EVENT_SUMMARY = [
  { n: String(departments.length).padStart(2, "0"), l: "CATEGORIES" },
  { n: String(totalEvents), l: "EVENTS" },
  { n: String(flagshipCount).padStart(2, "0"), l: "FLAGSHIP" },
  { n: String(minorCount).padStart(2, "0"), l: "MINOR" },
  { n: String(gamingEvents).padStart(2, "0"), l: "GAMING" },
  { n: "01", l: "GRAND HACKATHON" },
]

// Pointy-top hexagon path
function hexPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  })
  return `M${pts.join("L")}Z`
}

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

  const hexR = isMobile ? Math.min(vw / 6.5, 56) : 62
  const gapX = hexR * 1.78
  const gapY = hexR * 1.54
  const hexCols = isMobile ? 2 : 4

  const centers = CATEGORIES.map((_, i) => {
    const row = Math.floor(i / hexCols)
    const col = i % hexCols
    return {
      x: col * gapX + hexR + (row % 2 === 1 ? gapX * 0.5 : 0),
      y: row * gapY + hexR,
    }
  })

  const rows = Math.max(1, Math.ceil(CATEGORIES.length / hexCols))
  const svgW = (hexCols - 1) * gapX + hexR * 2 + gapX * 0.5
  const svgH = (rows - 1) * gapY + hexR * 2

  const selectedCat = CATEGORIES.find(c => c.id === selected)!

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: isMobile ? "18px 0 32px" : "44px 0 72px",
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
        /* Desktop: full effect with blur */
        @keyframes hex-in {
          0%   { opacity: 0; transform: scale(0.55) translateY(16px); filter: blur(3px); }
          65%  { opacity: 1; filter: blur(0px); }
          82%  { transform: scale(1.05) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }
        /* Mobile: lightweight, no blur — only opacity + scale for GPU friendliness */
        @keyframes hex-in-mobile {
          0%   { opacity: 0; transform: scale(0.6) translateY(10px); }
          75%  { transform: scale(1.04) translateY(-1px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes hex-glow-pulse {
          0%   { opacity: 0; }
          35%  { opacity: 0.5; }
          100% { opacity: 0; }
        }
        @keyframes tick-in {
          from { stroke-dashoffset: 200; }
          to   { stroke-dashoffset: 0; }
        }
        .hex-g { cursor: pointer; will-change: transform, opacity; }
        .hex-g:not(.is-active):hover .hex-bg { fill: rgba(255,255,255,0.08); }
        .hex-g:not(.is-active):hover .hex-stroke { stroke: rgba(255,255,255,0.9) !important; }
        .jump-pill:hover { background: rgba(255,255,255,0.12) !important; color: rgba(255,255,255,0.9) !important; }
        a:hover .view-pill { background: rgba(255,255,255,0.13) !important; color: rgba(255,255,255,0.9) !important; border-color: rgba(255,255,255,0.22) !important; }
      `}</style>

      {/* ── TITLE ── */}
      <div style={{
        width: "100%",
        maxWidth: 1060,
        padding: isMobile ? "0 20px 24px" : "0 32px 44px",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "flex-end",
        justifyContent: "space-between",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 12 : 16,
        borderBottom: "1px solid rgba(255,255,255,0.18)",
        marginBottom: isMobile ? 20 : 40,
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: "'Palatino Linotype', 'Book Antiqua', Georgia, serif",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 0.9,
          fontSize: isMobile ? "clamp(2.1rem, 10vw, 4rem)" : "clamp(3.2rem, 8vw, 6rem)",
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
            {String(departments.length).padStart(2, "0")} CATEGORIES<br />{totalEvents} EVENTS
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 24 : 52,
        alignItems: "flex-start",
        justifyContent: "center",
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
          overflowX: isMobile ? "auto" : "visible",
          overflowY: "visible",
        }}>
          <svg
            width={isMobile ? "100%" : svgW + 20}
            height={svgH + 20}
            viewBox={`-10 -10 ${svgW + 20} ${svgH + 20}`}
            style={{ overflow: "visible", display: "block", minWidth: isMobile ? svgW + 20 : undefined }}
          >
            <defs>
              <filter id="f-none" />
            </defs>

            {(() => {
              // Compute once outside the per-hex loop
              const sectionVisible = sp > 0.05
              // Correct perimeter: regular hexagon side = circumradius, so P = 6r
              const hexPerimeter = Math.round(6 * (hexR - 2))
              // Slightly faster stagger on mobile (fewer pixels to travel, smaller screen)
              const staggerStep = isMobile ? 0.1 : 0.13
              // Animation name — no blur/filter on mobile for GPU performance
              const hexAnim = isMobile ? "hex-in-mobile" : "hex-in"

              return CATEGORIES.map((cat, i) => {
              const { x, y } = centers[i]
              const active = selected === cat.id
              const Icon = cat.icon
              const iconSz = isMobile ? Math.round(hexR * 0.32) : 16
              const delay = sectionVisible ? `${i * staggerStep}s` : "0s"

              return (
                <g
                  key={cat.id}
                  className={`hex-g ${active ? "is-active" : ""}`}
                  onClick={() => handleSelect(cat.id)}
                  style={{
                    opacity: sectionVisible ? 1 : 0,
                    animation: sectionVisible
                      ? `${hexAnim} 0.5s cubic-bezier(0.34,1.28,0.64,1) ${delay} both`
                      : "none",
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Glow pulse on reveal — desktop only (filter is expensive on mobile) */}
                  {sectionVisible && !active && !isMobile && (
                    <path
                      d={hexPath(x, y, hexR + 4)}
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={5}
                      style={{
                        pointerEvents: "none",
                        animation: `hex-glow-pulse 0.8s ease ${delay} both`,
                        filter: "blur(3px)",
                      }}
                    />
                  )}

                  {/* Hex fill */}
                  <path
                    className="hex-bg"
                    d={hexPath(x, y, hexR - 2)}
                    fill={active ? cat.color : "transparent"}
                    stroke="none"
                    style={{ transition: "fill 0.3s ease" }}
                  />

                  {/* Hex border — stroke draws on via dashoffset transition */}
                  <path
                    className="hex-stroke"
                    d={hexPath(x, y, hexR - 2)}
                    fill="none"
                    stroke={active ? cat.color : "rgba(255,255,255,0.62)"}
                    strokeWidth={active ? 2 : 1.5}
                    strokeDasharray={active ? undefined : hexPerimeter}
                    strokeDashoffset={active ? undefined : (sectionVisible ? 0 : hexPerimeter)}
                    strokeLinecap="round"
                    style={{
                      transition: active
                        ? "stroke 0.3s ease, stroke-width 0.3s ease"
                        : `stroke 0.3s ease, stroke-width 0.3s ease, stroke-dashoffset 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}`,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Active index watermark */}
                  {active && (
                    <text
                      x={x - hexR * 0.55} y={y - hexR * 0.3}
                      fill={contrastColor(cat.color) === "rgba(0,0,0,0.9)" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)"}
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
                    y={y - (isMobile ? hexR * 0.25 : 14) - iconSz / 2}
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
                        color: active ? contrastColor(cat.color) : "rgba(255,255,255,0.9)",
                        display: "block",
                        transition: "color 0.25s ease",
                      }} />
                    </div>
                  </foreignObject>

                  {/* Label */}
                  <text
                    x={x} y={y + (isMobile ? hexR * 0.325 : 17)}
                    textAnchor="middle"
                    fill={active ? contrastColor(cat.color) : "rgba(255,255,255,0.95)"}
                    fontSize={isMobile ? hexR * 0.17 : 8.5}
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
                    r={isMobile ? hexR * 0.21 : 10.5}
                    fill={active ? "rgba(0,0,0,0.55)" : "rgba(5,8,18,0.96)"}
                    stroke={active ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.36)"}
                    strokeWidth={1}
                    style={{ transition: "all 0.25s ease" }}
                  />
                  <text
                    x={x + hexR * 0.58} y={y - hexR * 0.58 + 4}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.98)"
                    fontSize={isMobile ? hexR * 0.175 : 8.5}
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
            })
            })()} 
          </svg>
        </div>

        {/* ── EVENT PANEL ── */}
        <div style={{ flex: isMobile ? 1 : "0 1 520px", minWidth: 0, width: "100%", maxWidth: isMobile ? "100%" : 520 }}>

          {/* Category label row */}
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: isMobile ? 16 : 22,
            paddingBottom: isMobile ? 12 : 18,
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
              <Link
                key={i}
                href={`/events/${selectedCat.id}#event-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 12 : 16,
                  padding: isMobile ? "10px 0" : "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.14)",
                  animation: `item-in 0.3s ease ${i * 0.05}s both`,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
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

                {/* View pill */}
                <span
                  className="view-pill"
                  style={{
                    flexShrink: 0,
                    fontSize: 10,
                    fontFamily: "monospace",
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.95)",
                    background: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    borderRadius: 999,
                    padding: "5px 13px",
                    whiteSpace: "nowrap",
                    transition: "background 0.2s, color 0.2s, border-color 0.2s",
                  }}
                >
                  View →
                </span>
              </Link>
            ))}
          </div>

          {/* Meta row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 14 : 24,
            marginTop: isMobile ? 12 : 18,
            paddingTop: isMobile ? 10 : 14,
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}>
            <span style={{
              fontFamily: "monospace", fontSize: 12,
              color: "rgba(255,255,255,0.98)", letterSpacing: "0.16em",
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}>
              {selectedCat.events.length} EVENT{selectedCat.events.length !== 1 ? "S" : ""}
            </span>
            {selectedCat.events.filter(e => e.flagship).length > 0 && (
              <span style={{
                fontFamily: "monospace", fontSize: 12,
                color: "rgba(255,255,255,0.98)", letterSpacing: "0.16em",
                textShadow: "0 1px 8px rgba(0,0,0,0.6)",
              }}>
                {selectedCat.events.filter(e => e.flagship).length} FLAGSHIP
              </span>
            )}
            <div style={{ flex: 1 }} />
            <div style={{
              width: 9, height: 9, borderRadius: "50%",
              background: selectedCat.color,
              boxShadow: `0 0 10px ${selectedCat.color}`,
              transition: "background 0.3s",
            }} />
          </div>

          {/* ── Quick-nav ── */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginTop: isMobile ? 16 : 24,
            paddingTop: isMobile ? 12 : 16,
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
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            marginTop: isMobile ? 14 : 20,
            borderTop: "1px solid rgba(255,255,255,0.14)",
            opacity: sp > 0.4 ? 1 : 0,
            transform: sp > 0.4 ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}>
            {EVENT_SUMMARY.map((s, i) => (
              <div key={i} style={{
                padding: isMobile ? "12px 0" : "16px 0",
                textAlign: "center",
                borderRight: isMobile
                  ? i % 2 === 0
                    ? "1px solid rgba(255,255,255,0.14)"
                    : "none"
                  : i % 3 !== 2
                    ? "1px solid rgba(255,255,255,0.14)"
                    : "none",
                borderBottom: i < EVENT_SUMMARY.length - (isMobile ? 2 : 3)
                  ? "1px solid rgba(255,255,255,0.14)"
                  : "none",
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