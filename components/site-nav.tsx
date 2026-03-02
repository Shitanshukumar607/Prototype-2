"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, Search, X, ArrowUpRight } from "lucide-react"
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

function getSearchResults(query: string): SearchEntry[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return searchEntries
    .map((entry) => {
      const labelLow = entry.label.toLowerCase()
      let score = 0
      if (labelLow === q) score = 100
      else if (labelLow.startsWith(q)) score = 80
      else if (labelLow.includes(q)) score = 60
      else if (entry.searchText.includes(q)) score = 30
      return { entry, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)
    .map(({ entry }) => entry)
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/schedule", label: "Schedule" },
  { href: "/contact", label: "Contact" },
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

  const searchResults = getSearchResults(searchQuery)

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
          "hidden md:block fixed top-8 left-0 right-0 z-50 mx-auto",
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
              className="relative z-10 rounded-2xl p-2 text-white/60 hover:text-white/90 hover:bg-black/[0.06] active:bg-black/[0.08] transition-colors duration-200"
              aria-label="Open search"
              tabIndex={isSearchOpen ? -1 : 0}
            >
              <Search size={15} />
            </button>
            <span className="shrink-0 text-white/20 text-sm leading-none select-none mx-0.5" aria-hidden>|</span>

            {navItems.map(({ href, label }, i) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
              return (
                <span key={href} className="contents">
                  <Link
                    ref={(el) => { linkRefs.current[i] = el }}
                    href={href}
                    tabIndex={isSearchOpen ? -1 : 0}
                    className={cn(
                      "relative z-10 rounded-2xl px-3 py-2 text-sm font-medium transition-colors duration-200",
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
        {isSearchOpen && searchResults.length > 0 && (
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
            {searchResults.map((result, i) => (
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
            ))}
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

        {/* Bottom sheet backdrop */}
        <div
          className={cn(
            "fixed inset-0 z-40 transition-all duration-300",
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: isMobileMenuOpen ? "blur(4px)" : "none" }}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden
        />

        {/* Bottom sheet */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            transform: isMobileMenuOpen ? "translateY(0)" : "translateY(105%)",
            transition: "transform 420ms cubic-bezier(0.32,0.72,0,1)",
          }}
        >
          <div
            className="rounded-t-3xl overflow-hidden"
            style={{
              background: "rgba(6,7,18,0.92)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(32px)",
              boxShadow: "0 -16px 48px rgba(0,0,0,0.6), 0 -1px 0 rgba(168,85,247,0.08)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3.5 pb-2">
              <div className="h-[3px] w-9 rounded-full bg-white/20" />
            </div>

            {/* Nav links */}
            <div className="px-4 pb-8 pt-2 flex flex-col gap-1">
              {navItems.map(({ href, label }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] font-medium transition-colors duration-150",
                      isActive
                        ? "text-white"
                        : "text-white/45 active:bg-white/[0.05]"
                    )}
                    style={isActive ? { background: "rgba(168,85,247,0.09)" } : {}}
                  >
                    <span>{label}</span>
                    {isActive && (
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ background: "rgba(192,132,252,0.9)", boxShadow: "0 0 6px rgba(168,85,247,0.6)" }}
                        aria-hidden
                      />
                    )}
                  </Link>
                )
              })}
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

        {/* Search bottom sheet */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            transform: isMobileSearchOpen ? "translateY(0)" : "translateY(105%)",
            transition: "transform 420ms cubic-bezier(0.32,0.72,0,1)",
          }}
        >
          <div
            className="rounded-t-3xl overflow-hidden"
            style={{
              background: "rgba(6,7,18,0.92)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(32px)",
              boxShadow: "0 -16px 48px rgba(0,0,0,0.6), 0 -1px 0 rgba(168,85,247,0.08)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3.5 pb-2">
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
            <div className="overflow-y-auto max-h-[55vh] pb-8">
              {getSearchResults(mobileSearchQuery).map((result) => (
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
                    <span className="text-[9px] text-purple-400/80 border border-purple-400/30 rounded px-1.5 py-0.5 shrink-0 uppercase tracking-wider">Flagship</span>
                  )}
                  <ArrowUpRight size={13} className="text-white/20 shrink-0" />
                </button>
              ))}
              {mobileSearchQuery.trim() !== "" && getSearchResults(mobileSearchQuery).length === 0 && (
                <p className="text-white/30 text-sm text-center py-8">No results for &ldquo;{mobileSearchQuery}&rdquo;</p>
              )}
              {mobileSearchQuery.trim() === "" && (
                <p className="text-white/20 text-xs text-center py-6 tracking-widest uppercase">Type to search events</p>
              )}
            </div>
          </div>
        </div>

        {/* Centered top pill — burger left, search right */}
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="pointer-events-auto flex items-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-lg px-1.5 py-1.5 gap-0.5">
            <button
              onClick={() => { setIsMobileMenuOpen((v) => !v); setIsMobileSearchOpen(false) }}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-90"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="text-white/20 text-xs leading-none select-none px-1" aria-hidden>|</span>
            <button
              onClick={() => { setIsMobileSearchOpen((v) => !v); setIsMobileMenuOpen(false) }}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-90"
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
