"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, Search, X, ArrowUpRight, Home, LayoutGrid, CalendarDays, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { departments } from "@/lib/events-data"

interface SearchEntry {
  label: string
  sublabel: string
  url: string
  searchText: string
  isFlagship?: boolean
}

const searchEntries: SearchEntry[] = departments.flatMap((dept) => [
  {
    label: dept.fullName || dept.name,
    sublabel: `${dept.events.length} event${dept.events.length !== 1 ? "s" : ""}`,
    url: `/events/${dept.id}`,
    searchText: `${dept.name} ${dept.fullName ?? ""} ${dept.id}`.toLowerCase(),
  },
  ...dept.events.map((event, eventIndex) => ({
    label: event.name,
    sublabel: dept.fullName || dept.name,
    url: `/events/${dept.id}#event-${eventIndex}`,
    searchText: `${event.name} ${dept.name} ${dept.fullName ?? ""} ${dept.id}`.toLowerCase(),
    isFlagship: event.type === "Flagship",
  })),
])

function normalizeSearch(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function getSearchResults(query: string): SearchEntry[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return searchEntries
    .map((entry) => {
      const labelLow = entry.label.toLowerCase()
      const labelNorm = normalizeSearch(entry.label)
      const textLow = entry.searchText
      const textNorm = normalizeSearch(entry.searchText)
      const qNorm = normalizeSearch(q)
      const tokens = q.split(/\s+/).filter(Boolean)

      let score = 0

      // Strong matches on the normalized label (handles spacing like "Robowars" vs "robo wars").
      if (labelNorm === qNorm) score += 120
      else if (labelNorm.startsWith(qNorm)) score += 100
      else if (labelNorm.includes(qNorm)) score += 80
      else if (textNorm.includes(qNorm)) score += 50

      // Token-level partial matches ("robo" + "wars" should both push Robowars up).
      for (const token of tokens) {
        const t = token.toLowerCase()
        if (!t) continue
        if (labelLow.includes(t)) score += 18
        else if (textLow.includes(t)) score += 10
      }

      // Slight boost for flagship events so marquee events rank higher when tied.
      if (entry.isFlagship) score += 5

      return { entry, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .map(({ entry }) => entry)
}

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: LayoutGrid },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/contact", label: "Contact", icon: Phone },
]

export function SiteNav() {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [pillStyle, setPillStyle] = useState<{
    left: number
    width: number
    top: number
    height: number
    opacity: number
  } | null>(null)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const searchResults = useMemo(() => getSearchResults(searchQuery), [searchQuery])
  const mobileSearchResults = useMemo(() => getSearchResults(mobileSearchQuery), [mobileSearchQuery])

  // Prefetch top-level routes so nav taps feel instant.
  useEffect(() => {
    if (typeof window === "undefined") return
    let idleId: number | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    // Use global setTimeout to avoid TS lib confusion in some environments.
    if ("requestIdleCallback" in window) {
      idleId = (window as any).requestIdleCallback(() => navItems.forEach((i) => router.prefetch(i.href)))
    } else {
      timeoutId = setTimeout(() => navItems.forEach((i) => router.prefetch(i.href)), 250)
    }

    return () => {
      if ("cancelIdleCallback" in window) {
        try {
          if (idleId != null) (window as any).cancelIdleCallback(idleId)
        } catch {}
      }
      if (timeoutId != null) clearTimeout(timeoutId)
    }
  }, [router])

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSelectedIndex(-1)
  }

  const navigateTo = (url: string) => {
    router.push(url)
    closeSearch()
  }

  useEffect(() => {
    if (isSearchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [isSearchOpen])

  useEffect(() => {
    if (isMobileSearchOpen) {
      const t = setTimeout(() => mobileSearchInputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [isMobileSearchOpen])

  // Mobile search UX: lock scroll + ESC to close + close on route change.
  useEffect(() => {
    if (!isMobileSearchOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileSearchOpen(false)
        setMobileSearchQuery("")
      }
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isMobileSearchOpen])

  useEffect(() => {
    // If navigation happens while open, close cleanly.
    setIsMobileSearchOpen(false)
    setMobileSearchQuery("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const activeIndex = navItems.findIndex(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  )

  useEffect(() => {
    const container = containerRef.current
    const activeLink = activeIndex >= 0 ? linkRefs.current[activeIndex] : null
    if (!container || !activeLink) {
      setPillStyle((prev) => (prev ? { ...prev, opacity: 0 } : null))
      return
    }

    const update = () => {
      // Don't update pill on mobile if hidden
      if (window.innerWidth < 768) return

      const cr = container.getBoundingClientRect()
      const lr = activeLink.getBoundingClientRect()
      setPillStyle({
        left: lr.left - cr.left,
        width: lr.width,
        top: lr.top - cr.top,
        height: lr.height,
        opacity: 1,
      })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(container)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [activeIndex, pathname])

  return (
    <>
      {/* Desktop Navigation (Pill) */}
      <nav
        className={cn(
          "hidden md:block fixed top-8 left-0 right-0 z-50 mx-auto md:transform md:translate-x-4",
          "max-w-[94vw]",
          "rounded-3xl",
          "border border-white/10",
          "bg-white/[0.03]",
          "shadow-lg",
          "backdrop-blur-xl",
          "hover:border-white/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3),0_0_40px_rgba(147,51,234,0.15)]"
        )}
        style={{
          width: isSearchOpen ? "16rem" : "26rem",
          transition: "width 480ms cubic-bezier(0.34,1.26,0.64,1), box-shadow 300ms ease, border-color 300ms ease",
        }}
        aria-label="Main navigation"
      >
        <span
          className="pointer-events-none absolute -left-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-white/30 blur-2xl"
          style={{ animation: "2.8s ease-in-out infinite alternate blobFloatA" }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full bg-black/10 blur-xl"
          style={{ animation: "3.4s ease-in-out infinite alternate blobFloatB" }}
          aria-hidden
        />
        <style jsx>{`
          @keyframes blobFloatA {
            from { transform: translateY(-50%) translateX(0px) scale(1); }
            to   { transform: translateY(-50%) translateX(8px) scale(1.08); }
          }
          @keyframes blobFloatB {
            from { transform: translateY(-50%) translateX(0px) scale(1); }
            to   { transform: translateY(-50%) translateX(-7px) scale(1.1); }
          }
        `}</style>

        {/* Single fixed-height container — both layers overlay each other */}
        <div className="relative h-12 overflow-hidden">

          {/* Nav layer */}
          <div
            ref={containerRef}
            className="absolute inset-0 flex items-center justify-center gap-0.5 px-2 py-1.5"
            style={{
              opacity: isSearchOpen ? 0 : 1,
              transform: isSearchOpen ? "translateX(-10px) scale(0.97)" : "translateX(0px) scale(1)",
              transition: "opacity 320ms ease, transform 380ms cubic-bezier(0.4,0,0.2,1)",
              pointerEvents: isSearchOpen ? "none" : "auto",
            }}
          >
            {/* Sliding jelly pill */}
            {pillStyle && (
              <span
                className="pointer-events-none absolute rounded-2xl"
                style={{
                  left: pillStyle.left,
                  top: pillStyle.top,
                  width: pillStyle.width,
                  height: pillStyle.height,
                  opacity: pillStyle.opacity,
                  transition:
                    "left 0.85s cubic-bezier(0.22,1,0.36,1), width 0.85s cubic-bezier(0.22,1,0.36,1), top 0.85s cubic-bezier(0.22,1,0.36,1), height 0.85s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease-out",
                }}
                aria-hidden
              />
            )}

            {/* Search icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative z-10 rounded-2xl p-2 text-white/60 hover:text-white/90 hover:bg-black/[0.06] active:bg-black/[0.08] transition-colors duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
              aria-label="Open search"
              tabIndex={isSearchOpen ? -1 : 0}
            >
              <Search size={15} />
            </button>
            <span className="shrink-0 text-white/20 text-sm leading-none select-none mx-0.5" aria-hidden>|</span>

            {navItems.map(({ href, label }, i) => {
              const isActive = activeIndex === i
              return (
                <span key={href} className="contents">
                  <Link
                    ref={(el) => { linkRefs.current[i] = el }}
                    href={href}
                    prefetch
                    tabIndex={isSearchOpen ? -1 : 0}
                    className={cn(
                      "relative z-10 rounded-2xl px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-0",
                      "text-white hover:text-white",
                      isActive && "text-white",
                      !isActive && "hover:bg-black/[0.06] active:bg-black/[0.08]"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-1/2 bottom-1.5 h-0.5 -translate-x-1/2 bg-purple-500/50 rounded-full",
                        "transition-all duration-300 ease-out origin-center",
                        isActive ? "w-[calc(100%-1rem)] opacity-100" : "w-0 opacity-0"
                      )}
                      aria-hidden
                    />
                    <span className="relative">{label}</span>
                  </Link>
                  {i < navItems.length - 1 && (
                    <span className="shrink-0 text-white/30 text-xs leading-none select-none" aria-hidden>•</span>
                  )}
                </span>
              )
            })}
          </div>

          {/* Search layer */}
          <div
            className="absolute inset-0 flex items-center gap-2 px-3"
            style={{
              opacity: isSearchOpen ? 1 : 0,
              transform: isSearchOpen ? "translateX(0px) scale(1)" : "translateX(10px) scale(0.97)",
              transition: "opacity 320ms ease, transform 380ms cubic-bezier(0.4,0,0.2,1)",
              pointerEvents: isSearchOpen ? "auto" : "none",
            }}
          >
            <Search size={15} className="shrink-0 text-white/45" aria-hidden />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedIndex(-1) }}
              onKeyDown={(e) => {
                if (e.key === "Escape") { closeSearch() }
                else if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, searchResults.length - 1)) }
                else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, -1)) }
                else if (e.key === "Enter") {
                  const target = selectedIndex >= 0 ? searchResults[selectedIndex] : searchResults[0]
                  if (target) navigateTo(target.url)
                }
              }}
              placeholder="Search events..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 outline-none min-w-0"
              autoComplete="off"
              tabIndex={isSearchOpen ? 0 : -1}
            />
            <button
              onClick={closeSearch}
              className="shrink-0 rounded-full p-1 text-white/45 hover:text-white/90 transition-colors duration-200"
              aria-label="Close search"
              tabIndex={isSearchOpen ? 0 : -1}
            >
              <X size={14} />
            </button>
          </div>

        </div>

        {/* Search results dropdown */}
        {isSearchOpen && (searchQuery.trim() !== "") && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "26rem",
              maxWidth: "94vw",
              background: "rgba(8,9,22,0.94)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 16,
              backdropFilter: "blur(24px)",
              overflow: "hidden",
              zIndex: 10,
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
          >
            {searchResults.length === 0 ? (
              <div style={{ padding: "0.9rem 1rem" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                  No results for &ldquo;{searchQuery.trim()}&rdquo;
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", marginTop: 4 }}>
                  Try a department name (e.g. CSE) or an event name.
                </div>
              </div>
            ) : (
              searchResults.map((result, i) => (
                <button
                  key={`${result.url}-${result.label}`}
                  onMouseDown={(e) => { e.preventDefault(); navigateTo(result.url) }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.65rem 1rem",
                    background: selectedIndex === i ? "rgba(255,255,255,0.07)" : "transparent",
                    borderBottom: i < searchResults.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onMouseLeave={() => setSelectedIndex(-1)}
                >
                  <Search size={13} style={{ flexShrink: 0, color: "rgba(255,255,255,0.3)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.9)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {result.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", marginTop: "1px" }}>
                      {result.sublabel}
                    </div>
                  </div>
                  {result.isFlagship && (
                    <span style={{ flexShrink: 0, fontSize: "9px", color: "rgba(168,85,247,0.8)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 4, padding: "2px 5px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Flagship
                    </span>
                  )}
                  <ArrowUpRight size={13} style={{ flexShrink: 0, color: "rgba(255,255,255,0.2)" }} />
                </button>
              ))
            )}
          </div>
        )}

      </nav>

      {/* Backdrop to close search on outside click */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeSearch}
          aria-hidden
        />
      )}

      {/* Mobile Navigation */}
      <div className="md:hidden">

        <style>{`
          @keyframes glassMenuIn {
            from { opacity: 0; transform: translate(-50%, -47%) scale(0.94); }
            to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes glassItemIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Backdrop */}
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 40,
            opacity: isMobileMenuOpen ? 1 : 0,
            pointerEvents: isMobileMenuOpen ? "auto" : "none",
            background: "rgba(2,2,12,0.35)",
            backdropFilter: isMobileMenuOpen ? "blur(6px)" : "none",
            transition: "opacity 300ms ease",
          }}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden
        />

        {/* Glass card */}
        <div
          style={{
            position: "fixed",
            top: "50%", left: "50%",
            zIndex: 50,
            width: "min(86vw, 320px)",
            animation: isMobileMenuOpen ? "glassMenuIn 0.35s cubic-bezier(0.22,1,0.36,1) both" : "none",
            opacity: isMobileMenuOpen ? 1 : 0,
            pointerEvents: isMobileMenuOpen ? "auto" : "none",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Card surface */}
          <div style={{
            borderRadius: 24,
            overflow: "hidden",
            // Slightly more opaque + subtle gradient so items stay readable over busy backgrounds.
            background: "linear-gradient(180deg, rgba(10,10,12,0.96), rgba(6,6,8,0.94))",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 26px 60px rgba(0,0,0,0.55)",
          }}>

            {/* Soft top highlight */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(120% 70% at 50% 0%, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 40%, rgba(0,0,0,0) 70%)",
              }}
            />


            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px 10px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <span style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 9, letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
              }}>
                Menu
              </span>
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(59,130,246,0.55)" }} />
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(34,211,238,0.42)" }} />
              </div>
            </div>

            {/* Nav items */}
            <nav style={{ padding: "10px 12px 10px" }}>
              {navItems.map(({ href, label, icon: Icon }, index) => {
                const isActive = activeIndex === index
                const accent = "rgba(59,130,246,0.95)"
                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 12px",
                      borderRadius: 18,
                      marginBottom: 8,
                      textDecoration: "none",
                      // Match Events card language: neutral glass cards (no per-item tint).
                      background: isActive ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.22)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      border: isActive ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive
                        ? "0 22px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), 0 0 22px rgba(59,130,246,0.10)"
                        : "0 18px 40px rgba(0,0,0,0.35)",
                      transition: "transform 160ms ease, border-color 180ms ease, box-shadow 220ms ease, background 220ms ease",
                      animation: isMobileMenuOpen
                        ? `glassItemIn 0.35s cubic-bezier(0.22,1,0.36,1) ${0.1 + index * 0.06}s both`
                        : "none",
                    }}
                  >
                    {/* Subtle active edge (single accent only) */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 18,
                        pointerEvents: "none",
                        opacity: isActive ? 1 : 0,
                        background: "linear-gradient(90deg, rgba(59,130,246,0.18), rgba(255,255,255,0) 55%)",
                        maskImage: "linear-gradient(#000, #000)",
                      }}
                    />

                    {/* Icon */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 14, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isActive
                        ? "rgba(255,255,255,0.10)"
                        : "rgba(255,255,255,0.07)",
                      border: `1px solid ${isActive ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.10)"}`,
                      boxShadow: isActive ? "0 0 0 1px rgba(255,255,255,0.05), 0 0 18px rgba(59,130,246,0.10)" : "none",
                      transition: "all 0.2s ease",
                    }}>
                      <Icon size={15} style={{
                        color: isActive ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.78)",
                        transition: "color 0.2s ease",
                      }} />
                    </div>

                    {/* Label */}
                    <span style={{
                      flex: 1,
                      fontSize: 15,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.80)",
                      letterSpacing: "0.01em",
                      transition: "color 0.2s ease",
                    }}>
                      {label}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                        background: accent,
                        boxShadow: "0 0 0 3px rgba(59,130,246,0.14), 0 0 16px rgba(59,130,246,0.18)",
                      }} aria-hidden />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              padding: "10px 18px 12px",
            }}>
              <p style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 9, letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.13)",
                textTransform: "uppercase",
              }}>
                Luminus · RNSIT · 2026
              </p>
            </div>
          </div>
        </div>

        {/* Search sheet backdrop */}
        <div
          className={cn(
            "fixed inset-0 z-40 transition-all duration-300",
            isMobileSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: isMobileSearchOpen ? "blur(4px)" : "none" }}
          onClick={() => { setIsMobileSearchOpen(false); setMobileSearchQuery("") }}
          aria-hidden
        />

        {/* Search top sheet */}
        <div
          className="fixed left-0 right-0 z-50"
          style={{
            top: 72,
            transform: isMobileSearchOpen ? "translateY(0)" : "translateY(-160%)",
            opacity: isMobileSearchOpen ? 1 : 0,
            pointerEvents: isMobileSearchOpen ? "auto" : "none",
            transition: "transform 420ms cubic-bezier(0.32,0.72,0,1), opacity 200ms ease",
          }}
        >
          <div
            className="mx-auto w-[min(92vw,420px)] rounded-3xl overflow-hidden"
            style={{
              background: "rgba(10,10,12,0.92)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(32px)",
              boxShadow: "0 18px 56px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1.5">
              <div className="h-[3px] w-9 rounded-full bg-white/20" />
            </div>

            {/* Search input */}
            <div className="mx-4 mt-2 mb-3 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Search size={16} className="text-white/35 shrink-0" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const first = mobileSearchResults[0]
                    if (first) {
                      e.preventDefault()
                      navigateTo(first.url)
                      setIsMobileSearchOpen(false)
                      setMobileSearchQuery("")
                    }
                  } else if (e.key === "Escape") {
                    e.preventDefault()
                    setIsMobileSearchOpen(false)
                    setMobileSearchQuery("")
                  }
                }}
                placeholder="Search events..."
                className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/30 outline-none"
                autoComplete="off"
              />
              {mobileSearchQuery && (
                <button onClick={() => setMobileSearchQuery("")} className="text-white/35 active:text-white transition-colors shrink-0">
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="overflow-y-auto max-h-[60svh] pb-6">
              {mobileSearchResults.map((result) => (
                <button
                  key={`${result.url}-${result.label}`}
                  onClick={() => { navigateTo(result.url); setIsMobileSearchOpen(false); setMobileSearchQuery("") }}
                  className="w-full flex items-center gap-3 px-5 py-3.5 active:bg-white/[0.04] transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <Search size={13} className="text-white/25 shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-white/90 text-sm font-medium truncate">{result.label}</div>
                    <div className="text-white/35 text-xs mt-0.5">{result.sublabel}</div>
                  </div>
                  {result.isFlagship && (
                    <span className="text-[9px] text-white/70 border border-white/20 rounded px-1.5 py-0.5 shrink-0 uppercase tracking-wider">
                      Flagship
                    </span>
                  )}
                  <ArrowUpRight size={13} className="text-white/20 shrink-0" />
                </button>
              ))}
              {mobileSearchQuery.trim() !== "" && mobileSearchResults.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <p className="text-white/60 text-sm font-medium">No results</p>
                  <p className="mt-1 text-white/30 text-xs">
                    Try a different keyword (department, event name).
                  </p>
                </div>
              )}
              {mobileSearchQuery.trim() === "" && (
                <div className="px-5 py-7 text-center">
                  <p className="text-white/30 text-xs tracking-widest uppercase">Search events</p>
                  <p className="mt-1 text-white/18 text-[11px]">
                    Type to search by event name or department.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Centered top pill — burger left, search right */}
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="pointer-events-auto flex items-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-lg px-1.5 py-1.5 gap-0.5">
            <button
              onClick={() => { setIsMobileMenuOpen((v) => !v); setIsMobileSearchOpen(false) }}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-90 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="text-white/20 text-xs leading-none select-none px-1" aria-hidden>|</span>
            <button
              onClick={() => { setIsMobileSearchOpen((v) => !v); setIsMobileMenuOpen(false) }}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-90 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-label="Search"
            >
              {isMobileSearchOpen ? <X size={16} /> : <Search size={16} />}
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
