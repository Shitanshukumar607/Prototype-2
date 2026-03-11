import { departments } from "./events-data"

export type ScheduleDayId = 1 | 2

type BaseScheduleItem = {
  deptId: string
  /** Must match an event name in `lib/events-data.ts` for canonical display. */
  eventName: string
  /** Optional override for the displayed name (for grouped/umbrella schedule items). */
  displayName?: string
  /** Optional override for destination URL. */
  href?: string
  start: string
  end: string
  color: string
  glowColor: string
}

export type ResolvedScheduleItem = {
  /** Stable id for deep-linking and focus highlighting on the schedule page. */
  id: string
  name: string
  start: string
  end: string
  color: string
  glowColor: string
  href?: string
}

// Times are schedule-specific; names are resolved from `events-data` to prevent drift.
const scheduleByDay: Record<ScheduleDayId, BaseScheduleItem[]> = {
  1: [
    { deptId: "csds", eventName: "Kill Switch Protocol", start: "11:00", end: "15:00", color: "#eab308", glowColor: "#fbbf24" },
    { deptId: "mech", eventName: "Robo Wars", start: "11:00", end: "16:00", color: "#ef4444", glowColor: "#f87171" },
    { deptId: "mca", eventName: "IoT Nexus", start: "11:00", end: "16:00", color: "#22d3ee", glowColor: "#67e8f9" },
    {
      deptId: "eee",
      eventName: "Electro-Quiz Circuitrix – Technical Quiz & Circuit Challenge",
      start: "11:00",
      end: "16:00",
      color: "#3b82f6",
      glowColor: "#60a5fa",
    },
    { deptId: "cse", eventName: "Code Conundrum", start: "11:00", end: "13:00", color: "#0ea5e9", glowColor: "#38bdf8" },
    { deptId: "cse", eventName: "Version Control Wars", start: "13:30", end: "16:00", color: "#0ea5e9", glowColor: "#38bdf8" },
    { deptId: "cy", eventName: "Escape & Exploit", start: "11:00", end: "16:00", color: "#22c55e", glowColor: "#4ade80" },
    { deptId: "ece", eventName: "Innovatrium", start: "11:00", end: "16:00", color: "#67e8f9", glowColor: "#a5f3fc" },
    { deptId: "gaming", eventName: "Valorant", start: "11:00", end: "16:00", color: "#f43f5e", glowColor: "#fb7185" },
    {
      deptId: "grand-hackathon",
      eventName: "MCP-Based Systems – Engineering Intelligent Systems",
      displayName: "Solaris X - Grand Hackathon",
      href: "/events/grand-hackathon",
      start: "12:00",
      end: "16:00",
      color: "#3b82f6",
      glowColor: "#60a5fa",
    },
    { deptId: "civil", eventName: "Bridge It!", start: "11:00", end: "16:00", color: "#6b7280", glowColor: "#9ca3af" },
  ],
  2: [
    {
      deptId: "grand-hackathon",
      eventName: "MCP-Based Systems – Engineering Intelligent Systems",
      displayName: "Solaris X - Grand Hackathon",
      href: "/events/grand-hackathon",
      start: "09:00",
      end: "12:30",
      color: "#3b82f6",
      glowColor: "#60a5fa",
    },
    { deptId: "csds", eventName: "Data Royale: The Last Analyst Standing", start: "09:00", end: "15:00", color: "#facc15", glowColor: "#fde047" },
    { deptId: "mech", eventName: "RC Car Racing", start: "09:00", end: "15:00", color: "#ef4444", glowColor: "#f87171" },
    { deptId: "eee", eventName: "Electraforge – The Grid Survival Challenge", start: "09:00", end: "15:00", color: "#60a5fa", glowColor: "#93c5fd" },
    { deptId: "mca", eventName: "Ideathon Arena", start: "09:00", end: "15:00", color: "#eab308", glowColor: "#fbbf24" },
    { deptId: "aiml", eventName: "Turing Test", start: "10:30", end: "12:00", color: "#fde047", glowColor: "#fef08a" },
    { deptId: "cse", eventName: "Tech Escape Quest", start: "09:00", end: "11:30", color: "#0ea5e9", glowColor: "#38bdf8" },
    { deptId: "cy", eventName: "ZeroDay Arena", start: "09:00", end: "15:00", color: "#22d3ee", glowColor: "#67e8f9" },
    { deptId: "civil", eventName: "Design. Decide. Dominate", start: "09:00", end: "15:00", color: "#9ca3af", glowColor: "#d1d5db" },
    { deptId: "ise", eventName: "Data to Dashboard: SDG Edition", start: "09:00", end: "12:00", color: "#f97316", glowColor: "#fb923c" },
    { deptId: "mba", eventName: "BizNova", start: "12:00", end: "13:00", color: "#dc2626", glowColor: "#ef4444" },
    { deptId: "ece", eventName: "Embedded Escape Room", start: "09:00", end: "12:00", color: "#22d3ee", glowColor: "#67e8f9" },
    { deptId: "ece", eventName: "Bug Buster", start: "13:30", end: "15:00", color: "#22d3ee", glowColor: "#67e8f9" },
    { deptId: "gaming", eventName: "Valorant", start: "09:00", end: "14:00", color: "#f43f5e", glowColor: "#fb7185" },
    { deptId: "gaming", eventName: "Battlegrounds Mobile India (BGMI)", start: "09:00", end: "15:00", color: "#3b82f6", glowColor: "#60a5fa" },
  ],
}

function resolveEvent(deptId: string, eventName: string) {
  const dept = departments.find((d) => d.id === deptId)
  if (!dept) return null
  const idx = dept.events.findIndex((e) => e.name === eventName)
  if (idx < 0) return null
  return { dept, idx, ev: dept.events[idx] }
}

function toIdPart(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function scheduleItemId(item: BaseScheduleItem): string {
  return `${toIdPart(item.deptId)}-${toIdPart(item.displayName ?? item.eventName)}`
}

export function getScheduleForDay(day: ScheduleDayId): ResolvedScheduleItem[] {
  return scheduleByDay[day].map((item) => {
    if (item.href) {
      return {
        id: scheduleItemId(item),
        name: item.displayName ?? item.eventName,
        start: item.start,
        end: item.end,
        color: item.color,
        glowColor: item.glowColor,
        href: item.href,
      }
    }

    const resolved = resolveEvent(item.deptId, item.eventName)
    if (!resolved) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`[schedule] Unresolved event "${item.eventName}" in dept "${item.deptId}".`)
      }
      return { id: scheduleItemId(item), name: item.displayName ?? item.eventName, start: item.start, end: item.end, color: item.color, glowColor: item.glowColor }
    }

    return {
      id: scheduleItemId(item),
      name: item.displayName ?? resolved.ev.name,
      start: item.start,
      end: item.end,
      color: item.color,
      glowColor: item.glowColor,
      href: `/events/${resolved.dept.id}#event-${resolved.idx}`,
    }
  })
}

export function getScheduleJumpForEvent(deptId: string, eventName: string): { day: ScheduleDayId; focusId: string } | null {
  const days: ScheduleDayId[] = [1, 2]
  for (const day of days) {
    const found = scheduleByDay[day].find((i) => i.deptId === deptId && i.eventName === eventName)
    if (found) return { day, focusId: scheduleItemId(found) }
  }
  return null
}

