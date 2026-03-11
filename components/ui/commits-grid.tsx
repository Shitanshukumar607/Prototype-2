"use client"

import * as React from "react"
import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

type CommitsGridProps = {
  text: string
  /** When true, run the shuffle animation only on first mount. */
  animateOnMount?: boolean
}

export const CommitsGrid: React.FC<CommitsGridProps> = ({
  text,
  animateOnMount = false,
}) => {
  const cleanString = React.useCallback((str: string): string => {
    const upperStr = str.toUpperCase()

    const withoutAccents = upperStr
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    const allowedChars = Object.keys(letterPatterns)
    return withoutAccents
      .split("")
      .filter((char) => allowedChars.includes(char))
      .join("")
  }, [])

  const generateHighlightedCells = React.useCallback((value: string) => {
    const cleanedText = cleanString(value)

    const width = Math.max(cleanedText.length * 6, 6) + 1

    let currentPosition = 1 // start at 1 to leave space for the top border
    const highlightedCells: number[] = []

    cleanedText
      .toUpperCase()
      .split("")
      .forEach((char) => {
        if (letterPatterns[char]) {
          const pattern = letterPatterns[char].map((pos) => {
            const row = Math.floor(pos / 50)
            const col = pos % 50
            return (row + 1) * width + col + currentPosition
          })
          highlightedCells.push(...pattern)
        }
        currentPosition += 6
      })

    return {
      cells: highlightedCells,
      width,
      height: 9, // 7+2 for the top and bottom borders
    }
  }, [cleanString])

  const {
    cells: targetCells,
    width: gridWidth,
    height: gridHeight,
  } = React.useMemo(() => generateHighlightedCells(text), [text, generateHighlightedCells])

  const totalCells = gridWidth * gridHeight
  const [currentCells, setCurrentCells] = React.useState<number[]>([])
  const hasAnimatedRef = React.useRef(false)

  React.useEffect(() => {
    if (!totalCells) {
      setCurrentCells([])
      return
    }

    const shouldAnimate = animateOnMount && !hasAnimatedRef.current

    // For subsequent text changes, or when animation is disabled,
    // just snap directly to the new target pattern.
    if (!shouldAnimate) {
      setCurrentCells(targetCells)
      return
    }

    hasAnimatedRef.current = true

    const shuffles = 18
    let step = 0

    const interval = window.setInterval(() => {
      if (step < shuffles) {
        const randomCount = Math.max(4, Math.floor(totalCells * 0.22))
        const indices: number[] = []
        for (let i = 0; i < totalCells; i++) indices.push(i)
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[indices[i], indices[j]] = [indices[j], indices[i]]
        }
        setCurrentCells(indices.slice(0, randomCount))
        step++
      } else {
        setCurrentCells(targetCells)
        window.clearInterval(interval)
      }
    }, 70)

    return () => window.clearInterval(interval)
  }, [targetCells, totalCells, animateOnMount])

  return (
    <section
      className="w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] bg-black border border-white/10 grid p-1.5 sm:p-2 gap-[3px] sm:gap-1 rounded-full"
      style={{
        gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
        // Soft multi-hue spacey glow using brand colors
        boxShadow:
          "0 0 22px rgba(15,23,42,0.9), 0 0 34px rgba(59,130,246,0.55), 0 0 42px rgba(99,102,241,0.45), 0 0 54px rgba(147,51,234,0.4), 0 0 70px rgba(167,139,250,0.32)",
      }}
    >
      {Array.from({ length: gridWidth * gridHeight }).map((_, index) => {
        const isHighlighted = currentCells.includes(index)

        return (
          <div
            key={index}
            className={cn(
              "h-full w-full aspect-square rounded-[2px] border",
              isHighlighted
                ? "bg-emerald-400 border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.95)]"
                : "bg-black/40 border-[#1f2937]",
            )}
          />
        )
      })}
    </section>
  )
}

const letterPatterns: { [key: string]: number[] } = {
  A: [
    1, 2, 3, 50, 100, 150, 200, 250, 300, 54, 104, 154, 204, 254, 304, 151, 152,
    153,
  ],
  B: [
    0, 1, 2, 3, 4, 50, 100, 150, 151, 200, 250, 300, 301, 302, 303, 304, 54,
    104, 152, 153, 204, 254, 303,
  ],
  C: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  D: [
    0, 1, 2, 3, 50, 100, 150, 200, 250, 300, 301, 302, 54, 104, 154, 204, 254,
    303,
  ],
  E: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304, 151, 152],
  F: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 151, 152, 153],
  G: [
    0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 153, 204, 154,
    304, 254,
  ],
  H: [
    0, 50, 100, 150, 200, 250, 300, 151, 152, 153, 4, 54, 104, 154, 204, 254,
    304,
  ],
  I: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 300, 301, 302, 303, 304],
  J: [0, 1, 2, 3, 4, 52, 102, 152, 202, 250, 252, 302, 300, 301],
  K: [0, 4, 50, 100, 150, 200, 250, 300, 151, 152, 103, 54, 203, 254, 304],
  L: [0, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  M: [
    0, 50, 100, 150, 200, 250, 300, 51, 102, 53, 4, 54, 104, 154, 204, 254, 304,
  ],
  N: [
    0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 204,
    254, 304,
  ],
  Ñ: [
    0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 204,
    254, 304,
  ],
  O: [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  P: [0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153],
  Q: [
    1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 54, 104, 154, 204, 202, 253, 304,
  ],
  R: [
    0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153, 204, 254,
    304,
  ],
  S: [1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  T: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 302],
  U: [0, 50, 100, 150, 200, 250, 301, 302, 303, 4, 54, 104, 154, 204, 254],
  V: [0, 50, 100, 150, 200, 251, 302, 4, 54, 104, 154, 204, 253],
  W: [
    0, 50, 100, 150, 200, 250, 301, 152, 202, 252, 4, 54, 104, 154, 204, 254,
    303,
  ],
  X: [0, 50, 203, 254, 304, 4, 54, 152, 101, 103, 201, 250, 300],
  Y: [0, 50, 101, 152, 202, 252, 302, 4, 54, 103],
  Z: [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300, 301, 302, 303, 304],
  "0": [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  "1": [1, 52, 102, 152, 202, 252, 302, 0, 2, 300, 301, 302, 303, 304],
  "2": [0, 1, 2, 3, 54, 104, 152, 153, 201, 250, 300, 301, 302, 303, 304],
  "3": [0, 1, 2, 3, 54, 104, 152, 153, 204, 254, 300, 301, 302, 303],
  "4": [0, 50, 100, 150, 4, 54, 104, 151, 152, 153, 154, 204, 254, 304],
  "5": [0, 1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  "6": [
    1, 2, 3, 50, 100, 150, 151, 152, 153, 200, 250, 301, 302, 204, 254, 303,
  ],
  "7": [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300],
  "8": [
    1, 2, 3, 50, 100, 151, 152, 153, 200, 250, 301, 302, 303, 54, 104, 204, 254,
  ],
  "9": [1, 2, 3, 50, 100, 151, 152, 153, 154, 204, 254, 304, 54, 104],
  " ": [],
  ":": [
    52, 102, // upper dot (row 1 & 2, centered-ish)
    202, 252, // lower dot (row 4 & 5, centered-ish)
  ],
}

// Countdown wrapper for the April 8th event.
export const CommitsCountdownGrid: React.FC = () => {
  const getCountdownText = React.useCallback((): string => {
    // Event date: April 8, 2026 00:00 IST (UTC+5:30)
    const targetIstUtc = new Date(Date.UTC(2026, 3, 7, 18, 30, 0))
    const now = new Date()
    const diff = targetIstUtc.getTime() - now.getTime()

    if (diff <= 0) {
      return "LIVE"
    }

    const totalSeconds = Math.floor(diff / 1000)
    const days = Math.floor(totalSeconds / (24 * 60 * 60))
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    const dd = String(days).padStart(2, "0")
    const hh = String(hours).padStart(2, "0")
    const mm = String(minutes).padStart(2, "0")

    // Format: 02:12:34 => "days:hours:minutes"
    return `${dd}:${hh}:${mm}`
  }, [])

  const [text, setText] = React.useState<string>(() => getCountdownText())

  React.useEffect(() => {
    let intervalId: number | undefined
    let timeoutId: number | undefined

    const update = () => {
      setText(getCountdownText())
    }

    // Initial sync
    update()

    // Align updates to the start of each minute so the display changes
    // as soon as the minute flips.
    const now = new Date()
    const msToNextMinute =
      60000 - (now.getSeconds() * 1000 + now.getMilliseconds())

    timeoutId = window.setTimeout(() => {
      update()
      intervalId = window.setInterval(update, 60000)
    }, msToNextMinute)

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [getCountdownText])

  return <CommitsGrid text={text} animateOnMount />
}


