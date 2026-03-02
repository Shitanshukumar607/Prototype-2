"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, Search, X } from "lucide-react"

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
          "hidden md:block fixed top-8 left-0 right-0 z-50 mx-auto w-fit max-w-[min(94vw,40rem)]",
          "rounded-3xl",
          "border border-white/10",
          "bg-white/[0.03]",
          "shadow-lg",
          "backdrop-blur-xl",
          "transition-all duration-300",
          "hover:border-white/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3),0_0_40px_rgba(147,51,234,0.15)]"
        )}
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
            from {
              transform: translateY(-50%) translateX(0px) scale(1);
            }
            to {
              transform: translateY(-50%) translateX(8px) scale(1.08);
            }
          }
          @keyframes blobFloatB {
            from {
              transform: translateY(-50%) translateX(0px) scale(1);
            }
            to {
              transform: translateY(-50%) translateX(-7px) scale(1.1);
            }
          }
        `}</style>
        <div
          ref={containerRef}
          className="relative flex h-12 items-center justify-center gap-1 px-2 py-1.5"
        >
          {/* Left search bar */}
          <label
            className="relative z-10 mr-1 flex h-8 w-44 items-center rounded-xl border border-white/15 bg-black/20 px-2.5 text-white/70 focus-within:border-white/30 focus-within:bg-black/30"
            aria-label="Search"
          >
            <Search size={14} className="shrink-0 text-white/55" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 w-full bg-transparent text-xs text-white placeholder:text-white/40 outline-none"
            />
          </label>

          {/* Single sliding jelly pill */}
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
                  "left 0.85s cubic-bezier(0.22, 1, 0.36, 1), width 0.85s cubic-bezier(0.22, 1, 0.36, 1), top 0.85s cubic-bezier(0.22, 1, 0.36, 1), height 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease-out",
              }}
              aria-hidden
            />
          )}

          {navItems.map(({ href, label }, i) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href)
            return (
              <span key={href} className="contents">
                <Link
                  ref={(el) => {
                    linkRefs.current[i] = el
                  }}
                  href={href}
                  className={cn(
                    "relative z-10 rounded-2xl px-3 py-2 text-sm font-medium transition-colors duration-200",
                    "text-white hover:text-white",
                    isActive && "text-white",
                    !isActive && "hover:bg-black/[0.06] active:bg-black/[0.08]"
                  )}
                >
                  {/* Underline for selected */}
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
                  <span
                    className="shrink-0 text-white/30 text-xs leading-none select-none"
                    aria-hidden
                  >
                    •
                  </span>
                )}
              </span>
            )
          })}
        </div>
      </nav>

      {/* Mobile Navigation (Hamburger Menu) */}
      <div className="md:hidden">
        {/* Fullscreen Menu Overlay */}
        <div
          className={cn(
            "fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-300",
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
        >
          <div className="flex flex-col items-center gap-8">
            {navItems.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-2xl font-medium tracking-wide transition-all duration-200",
                    isActive ? "text-white scale-110" : "text-white/60 hover:text-white"
                  )}
                >
                  {label}
                  {isActive && (
                    <span className="block h-1 w-full bg-purple-500/80 rounded-full mt-2 mx-auto" aria-hidden />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Floating Action Button (Hamburger Toggle) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-[0_0_20px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-transform active:scale-90"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </>
  )
}
