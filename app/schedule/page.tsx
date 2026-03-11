"use client"

import React from "react"
import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"
import dynamic from "next/dynamic"
import { GlowEffect } from "@/components/ui/glow-effect"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getScheduleForDay } from "@/lib/schedule-data"

const LuminusParticles = dynamic(
  () => import("../Home page/vercel-logo-particles").then((m) => m.default),
  { ssr: false }
)

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

/** Hex color luminance (0–1). Used to keep bar background readable for white text. */
function hexLuminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) / 255, g = ((n >> 8) & 0xff) / 255, b = (n & 0xff) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b
}

const DARK_LUMINANCE = 0.4

/** Bar background: light colors get a tint; dark colors get neutral light bg so white text is readable. */
function barBackground(color: string): string {
  if (hexLuminance(color) < DARK_LUMINANCE) return "rgba(255,255,255,0.08)"
  return `${color}18`
}

function isDarkBar(color: string): boolean {
  return hexLuminance(color) < DARK_LUMINANCE
}

function SchedulePageInner() {
  const searchParams = useSearchParams()
  const [day, setDay] = React.useState(1)
  const [focusedId, setFocusedId] = React.useState<string | null>(null)
  const events = getScheduleForDay(day === 1 ? 1 : 2)
  const startHour = day === 1 ? 11 : 9
  const endHour = day === 1 ? 16 : 15
  const timeSlots = Array.from({ length: (endHour - startHour) * 2 + 1 }, (_, i) => {
    const hour = startHour + Math.floor(i / 2)
    const minute = i % 2 === 0 ? "00" : "30"
    return `${hour}:${minute}`
  })

  React.useEffect(() => {
    const dayParam = searchParams.get("day")
    const focus = searchParams.get("focus")
    const parsedDay = dayParam === "2" ? 2 : dayParam === "1" ? 1 : null

    if (parsedDay && parsedDay !== day) setDay(parsedDay)
    setFocusedId(focus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  React.useEffect(() => {
    if (!focusedId) return
    const el = document.getElementById(`schedule-${focusedId}`)
    if (!el) return

    // Allow layout to settle before scrolling.
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      window.setTimeout(() => setFocusedId(null), 2200)
    }, 120)

    return () => window.clearTimeout(t)
  }, [focusedId, day])

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      <LuminusParticles startDispersed hideCursor={false} particleGap={4} />
      <div className="relative z-10 pt-28 pb-20 px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header — matches Events/Contact pattern */}
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40 mb-1.5">
              Timeline
            </p>
            <h1 className="text-[2rem] font-semibold tracking-tight text-white sm:text-3xl">
              Event Schedule
            </h1>
            <p className="mt-1.5 text-sm text-white/50">
              April 8–9, 2026 · Two days of events at Luminus Techfest
            </p>
          </motion.header>

          {/* Day Selector — glass pills, neutral accent when active */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="flex flex-wrap justify-start gap-3 mb-8"
          >
            <button
              onClick={() => setDay(1)}
              className={`rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300 flex items-center gap-2 border backdrop-blur-xl ${
                day === 1
                  ? "bg-white/[0.12] text-white border-white/30 shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
                  : "bg-white/[0.06] text-white/80 border-white/[0.14] hover:bg-white/[0.1] hover:text-white hover:border-white/25"
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              Day 1
            </button>
            <button
              onClick={() => setDay(2)}
              className={`rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300 flex items-center gap-2 border backdrop-blur-xl ${
                day === 2
                  ? "bg-white/[0.12] text-white border-white/30 shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
                  : "bg-white/[0.06] text-white/80 border-white/[0.14] hover:bg-white/[0.1] hover:text-white hover:border-white/25"
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              Day 2
            </button>
          </motion.div>

          {/* Timeline View */}
          <motion.div
            key={day}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Time Header - Desktop — sticky glass bar with higher contrast on dark bg */}
            <div className="hidden md:flex mb-4 sticky top-24 z-30 rounded-3xl border border-white/[0.12] bg-white/[0.04] backdrop-blur-xl py-3 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              <div className="w-56 flex-shrink-0 text-[11px] font-medium text-white/60 uppercase tracking-[0.18em]">
                Event
              </div>
              <div className="flex-1 flex">
                {timeSlots.map((time, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-xs text-white/70 border-l border-white/[0.08] first:border-l-0"
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="space-y-4">
              {events.map((event, index) => {
                const startMinutes = timeToMinutes(event.start)
                const endMinutes = timeToMinutes(event.end)
                const dayStartMinutes = startHour * 60
                const totalMinutes = (endHour - startHour) * 60
                const left = ((startMinutes - dayStartMinutes) / totalMinutes) * 100
                const width = ((endMinutes - startMinutes) / totalMinutes) * 100

                return (
                  <motion.div
                    key={event.id}
                    id={`schedule-${event.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group relative z-0"
                  >
                    {/* Focus ring (when navigated from an event) */}
                    <div
                      aria-hidden
                      className={
                        focusedId === event.id
                          ? "pointer-events-none absolute -inset-2 rounded-[28px] border border-white/15 shadow-[0_0_0_1px_rgba(59,130,246,0.22),0_0_36px_rgba(59,130,246,0.18)]"
                          : "hidden"
                      }
                    />

                    {/* Desktop View */}
                    <div className="hidden md:flex items-center">
                      {/* Event Name */}
                      <div className="w-56 flex-shrink-0 pr-4">
                        {event.href ? (
                          <Link
                            href={event.href}
                            className="text-[14px] font-medium text-white/90 hover:text-white transition-colors tracking-tight focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-md"
                          >
                            {event.name}
                          </Link>
                        ) : (
                          <p className="text-[14px] font-medium text-white/90 group-hover:text-white transition-colors tracking-tight">
                            {event.name}
                          </p>
                        )}
                      </div>

                      {/* Timeline Bar — glass + event color tint */}
                      <div className="flex-1 relative h-14">
                        <div className="relative overflow-visible" style={{ position: 'absolute', left: `${left}%`, width: `${width}%`, height: '100%' }}>
                          <div className="relative overflow-visible h-full">
                            <GlowEffect
                              colors={[event.glowColor, event.color]}
                              mode="breathe"
                              blur="soft"
                              scale={1.06}
                              duration={5}
                              className="rounded-2xl opacity-0 group-hover:opacity-35 transition-opacity duration-300"
                            />
                            {event.href ? (
                              <Link
                                href={event.href}
                                className="relative h-full rounded-2xl border border-white/[0.08] backdrop-blur-xl transition-all duration-300 group-hover:scale-[1.01] group-hover:border-white/[0.12] flex items-center px-4 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                                style={{
                                  backgroundColor: barBackground(event.color),
                                  ...(isDarkBar(event.color) && { borderLeftWidth: 4, borderLeftColor: event.color }),
                                  boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.25)",
                                }}
                              >
                                <div className="flex items-center gap-2 text-white text-xs font-medium">
                                  <Clock className="w-3.5 h-3.5 opacity-80" style={{ color: event.color }} />
                                  <span className="text-white/90">
                                    {event.start} – {event.end}
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <div
                                className="relative h-full rounded-2xl border border-white/[0.08] backdrop-blur-xl transition-all duration-300 group-hover:scale-[1.01] group-hover:border-white/[0.12] flex items-center px-4"
                                style={{
                                  backgroundColor: barBackground(event.color),
                                  ...(isDarkBar(event.color) && { borderLeftWidth: 4, borderLeftColor: event.color }),
                                  boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.25)",
                                }}
                              >
                                <div className="flex items-center gap-2 text-white text-xs font-medium">
                                  <Clock className="w-3.5 h-3.5 opacity-80" style={{ color: event.color }} />
                                  <span className="text-white/90">
                                    {event.start} – {event.end}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile View — same glass + tint as Events cards */}
                    <div className="md:hidden relative overflow-visible">
                      <div className="relative overflow-visible rounded-3xl">
                        <GlowEffect
                          colors={[event.glowColor, event.color]}
                          mode="breathe"
                          blur="soft"
                          scale={1.04}
                          duration={5}
                          className="rounded-3xl opacity-25"
                        />
                        {event.href ? (
                          <Link
                            href={event.href}
                            className="relative block rounded-3xl border border-white/[0.06] backdrop-blur-xl p-4 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                            style={{
                              backgroundColor: barBackground(event.color),
                              ...(isDarkBar(event.color) && { borderLeftWidth: 4, borderLeftColor: event.color }),
                              boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.3)",
                            }}
                          >
                            <p className="text-sm font-medium text-white/95 tracking-tight">
                              {event.name}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                              <Clock className="w-3.5 h-3.5 shrink-0 opacity-80" style={{ color: event.color }} />
                              <span>{event.start} – {event.end}</span>
                            </div>
                          </Link>
                        ) : (
                          <div
                            className="relative rounded-3xl border border-white/[0.06] backdrop-blur-xl p-4"
                            style={{
                              backgroundColor: barBackground(event.color),
                              ...(isDarkBar(event.color) && { borderLeftWidth: 4, borderLeftColor: event.color }),
                              boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.3)",
                            }}
                          >
                            <p className="text-sm font-medium text-white/95 tracking-tight">
                              {event.name}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                              <Clock className="w-3.5 h-3.5 shrink-0 opacity-80" style={{ color: event.color }} />
                              <span>{event.start} – {event.end}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function SchedulePage() {
  return (
    <React.Suspense fallback={<main className="relative min-h-screen bg-black" />}>
      <SchedulePageInner />
    </React.Suspense>
  )
}
