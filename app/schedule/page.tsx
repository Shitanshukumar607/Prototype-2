"use client"

import React from "react"
import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"
import dynamic from "next/dynamic"
import { GlowEffect } from "@/components/ui/glow-effect"

const LuminusParticles = dynamic(
  () => import("../Home page/vercel-logo-particles").then((m) => m.default),
  { ssr: false }
)

type Event = {
  name: string
  start: string
  end: string
  color: string
  glowColor: string
}

const day1: Event[] = [
  { name: "KILL SWITCH PROTOCOL", start: "11:00", end: "15:00", color: "#eab308", glowColor: "#fbbf24" },
  { name: "ROBO WARS", start: "11:00", end: "16:30", color: "#ef4444", glowColor: "#f87171" },
  { name: "IOT NEXUS", start: "11:00", end: "16:30", color: "#22d3ee", glowColor: "#67e8f9" },
  { name: "ELECTRO QUIZ- CIRCUITRIX", start: "11:00", end: "16:30", color: "#3b82f6", glowColor: "#60a5fa" },
  { name: "CODE CONUNDRUM", start: "11:00", end: "13:00", color: "#a855f7", glowColor: "#c084fc" },
  { name: "VERSION CONTROL WARS", start: "13:30", end: "16:00", color: "#a855f7", glowColor: "#c084fc" },
  { name: "ESCAPE AND EXPLOIT", start: "11:00", end: "16:00", color: "#22c55e", glowColor: "#4ade80" },
  { name: "INNOVATRIUM", start: "11:00", end: "16:30", color: "#67e8f9", glowColor: "#a5f3fc" },
  { name: "VALORANT", start: "11:00", end: "16:30", color: "#ec4899", glowColor: "#f472b6" },
  { name: "GRAND HACKATHON", start: "12:00", end: "16:30", color: "#6366f1", glowColor: "#818cf8" },
  { name: "BRIDGE IT", start: "11:00", end: "16:30", color: "#6b7280", glowColor: "#9ca3af" }
]

const day2: Event[] = [
  { name: "GRAND HACKATHON", start: "09:00", end: "12:30", color: "#6366f1", glowColor: "#818cf8" },
  { name: "DATA ROYALE", start: "09:00", end: "15:30", color: "#facc15", glowColor: "#fde047" },
  { name: "RC CAR RACING", start: "09:00", end: "15:30", color: "#ef4444", glowColor: "#f87171" },
  { name: "ELECTRAFORGE", start: "09:00", end: "15:30", color: "#60a5fa", glowColor: "#93c5fd" },
  { name: "IDEATHON ARENA", start: "09:00", end: "15:30", color: "#eab308", glowColor: "#fbbf24" },
  { name: "TURING TEST", start: "10:30", end: "12:00", color: "#fde047", glowColor: "#fef08a" },
  { name: "TECH ESCAPE QUEST", start: "09:00", end: "11:30", color: "#a855f7", glowColor: "#c084fc" },
  { name: "ZERO DAY ARENA", start: "09:00", end: "15:30", color: "#22d3ee", glowColor: "#67e8f9" },
  { name: "DESIGN, DECIDE, DOMINATE", start: "09:00", end: "15:30", color: "#9ca3af", glowColor: "#d1d5db" },
  { name: "SDG: DATA TO DASHBOARD", start: "09:00", end: "12:00", color: "#f97316", glowColor: "#fb923c" },
  { name: "BIZNOVA", start: "12:00", end: "13:00", color: "#dc2626", glowColor: "#ef4444" },
  { name: "EMBEDDED ESCAPE ROOM", start: "09:00", end: "12:00", color: "#22d3ee", glowColor: "#67e8f9" },
  { name: "BUG BUSTER", start: "13:30", end: "15:30", color: "#22d3ee", glowColor: "#67e8f9" },
  { name: "VALORANT", start: "09:00", end: "14:00", color: "#ec4899", glowColor: "#f472b6" },
  { name: "BGMI", start: "09:00", end: "15:30", color: "#818cf8", glowColor: "#a5b4fc" }
]

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export default function SchedulePage() {
  const [day, setDay] = React.useState(1)
  const events = day === 1 ? day1 : day2
  const startHour = day === 1 ? 11 : 9
  const endHour = day === 1 ? 17 : 16
  const timeSlots = Array.from({ length: (endHour - startHour) * 2 + 1 }, (_, i) => {
    const hour = startHour + Math.floor(i / 2)
    const minute = i % 2 === 0 ? "00" : "30"
    return `${hour}:${minute}`
  })

  return (
    <main className="relative min-h-screen">
      <LuminusParticles startDispersed hideCursor={false} particleGap={4} />
      
      <div className="relative z-[20] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-[2rem] font-semibold tracking-tight text-white sm:text-3xl mb-2">
              Event Schedule
            </h1>
            
          </motion.div>

          {/* Day Selector */}
          <div className="flex justify-start gap-3 mb-8">
            <button
              onClick={() => setDay(1)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                day === 1
                  ? "bg-white/10 text-white border border-white/20 backdrop-blur-xl"
                  : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Day 1
            </button>
            <button
              onClick={() => setDay(2)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                day === 2
                  ? "bg-white/10 text-white border border-white/20 backdrop-blur-xl"
                  : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Day 2
            </button>
          </div>

          {/* Timeline View */}
          <motion.div
            key={day}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Time Header - Desktop */}
            <div className="hidden md:flex mb-4 sticky top-20 z-10 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl py-3 px-4">
              <div className="w-56 flex-shrink-0 text-xs font-medium text-white/50 uppercase tracking-wider">
                Event Name
              </div>
              <div className="flex-1 flex">
                {timeSlots.map((time, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-xs text-white/40 border-l border-white/10 first:border-l-0"
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
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group"
                  >
                    {/* Desktop View */}
                    <div className="hidden md:flex items-center">
                      {/* Event Name */}
                      <div className="w-56 flex-shrink-0 pr-4">
                        <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors tracking-tight">
                          {event.name}
                        </p>
                      </div>

                      {/* Timeline Bar */}
                      <div className="flex-1 relative h-14">
                        <div className="relative overflow-visible" style={{ position: 'absolute', left: `${left}%`, width: `${width}%`, height: '100%' }}>
                          <div className="relative overflow-visible h-full">
                            <GlowEffect
                              colors={[event.glowColor, event.color]}
                              mode="breathe"
                              blur="soft"
                              scale={1.08}
                              duration={5}
                              className="rounded-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                            />
                            <div
                              className="relative h-full rounded-xl border backdrop-blur-md transition-all duration-300 group-hover:scale-[1.02] flex items-center px-4"
                              style={{
                                backgroundColor: `${event.color}20`,
                                borderColor: `${event.color}40`,
                                boxShadow: `0 0 0 1px ${event.color}10, 0 4px 12px rgba(0,0,0,0.3)`
                              }}
                            >
                              <div className="flex items-center gap-2 text-white text-xs font-medium">
                                <Clock className="w-3.5 h-3.5" style={{ color: event.color }} />
                                <span className="text-white/90">
                                  {event.start} - {event.end}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden relative overflow-visible p-1">
                      <div className="relative overflow-visible">
                        <GlowEffect
                          colors={[event.glowColor, event.color]}
                          mode="breathe"
                          blur="soft"
                          scale={1.05}
                          duration={5}
                          className="rounded-2xl opacity-30"
                        />
                        <div
                          className="relative rounded-2xl border backdrop-blur-md p-4"
                          style={{
                            backgroundColor: `${event.color}15`,
                            borderColor: `${event.color}30`,
                            boxShadow: `0 0 0 1px ${event.color}10, 0 4px 16px rgba(0,0,0,0.25)`
                          }}
                        >
                          <p className="text-sm font-medium text-white/95 mb-2 tracking-tight">
                            {event.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-white/70">
                            <Clock className="w-3.5 h-3.5" style={{ color: event.color }} />
                            <span>
                              {event.start} - {event.end}
                            </span>
                          </div>
                        </div>
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
  )
}
