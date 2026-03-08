import type { Metadata } from "next"
import Link from "next/link"
import { departments } from "@/lib/events-data"
import LuminusParticles from "../Home page/vercel-logo-particles"
import { GlowEffect } from "@/components/ui/glow-effect"

const GRAND_HACKATHON_ID = "grand-hackathon"

export const metadata: Metadata = {
  title: "Events · Luminus Techfest",
  description:
    "Browse all Luminus Techfest events by department — including Solaris X Grand Hackathon, flagship tracks, and minor events across AI, cybersecurity, data, hardware, gaming, and more.",
  openGraph: {
    title: "Events · Luminus Techfest",
    description:
      "Pick a department and explore detailed information for every Luminus Techfest event: team size, duration, prize pool, rules, and registration.",
    images: [
      {
        url: "/og-luminus-2026.png",
        width: 1230,
        height: 630,
        alt: "Luminus Techfest 2026 hero graphic",
      },
    ],
  },
}

export default function EventsPage() {
  const grandHackathon = departments.find((d) => d.id === GRAND_HACKATHON_ID)
  const otherDepartments = departments.filter((d) => d.id !== GRAND_HACKATHON_ID)

  return (
    <main className="relative min-h-screen">
      <LuminusParticles startDispersed hideCursor={false} particleGap={4} />
      <div className="relative z-[20] pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <header className="mb-8">
            <h1 className="text-[2rem] font-semibold tracking-tight text-white sm:text-3xl">
              Events
            </h1>
            <p className="mt-1.5 text-sm text-white/50">
              Pick a department to see its events.
            </p>
          </header>

          {grandHackathon && (
            <section className="mb-8" aria-label="Main highlight">
              <Link
                href={`/events/${grandHackathon.id}`}
                className="group block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {/* Padding gives room for the glow to extend behind the card so it reads as a floating shadow */}
                <div className="relative overflow-visible py-5 px-3 sm:py-6 sm:px-4">
                  <div className="relative overflow-visible rounded-3xl transition-all duration-300">
                    <GlowEffect
                      colors={["#3b82f6", "#6366f1", "#9333ea", "#a78bfa", "#60a5fa"]}
                      mode="rotate"
                      blur="soft"
                      scale={1.03}
                      duration={14}
                      className="rounded-3xl opacity-50"
                    />
                    <div
                      className="relative overflow-hidden rounded-3xl border border-white/[0.12] bg-black backdrop-blur-2xl transition-all duration-300 group-hover:border-white"
                      style={{
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.35)",
                      }}
                    >
                    <div className="relative pl-8 pr-7 py-7 sm:pl-11 sm:py-9">
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-amber-400/70">
                        Featured
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {grandHackathon.fullName ?? grandHackathon.name}
                      </h2>
                      <p className="mt-2 text-base text-amber-200/80">
                        3 tracks · 24 hr · ₹1,20,000+ prize pool
                      </p>
                      <p className="mt-3 text-sm text-white/55 leading-relaxed max-w-xl">
                        Solaris X is a 24-hour engineering sprint focused on building scalable, real-world systems utilizing modern AI frameworks and cutting-edge development technologies. Under the theme &ldquo;Engineering the Systems of Tomorrow,&rdquo; participants will design, build, and deploy impactful solutions across three powerful tracks.
                      </p>
                      <p className="mt-3 text-sm text-white/50 transition-colors group-hover:text-white/70">
                        View details →
                      </p>
                    </div>
                  </div>
                </div>
                </div>
              </Link>
            </section>
          )}

          <section aria-label="Departments">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
              By department
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {otherDepartments.map((dept) => (
                <Link
                  key={dept.id}
                  href={`/events/${dept.id}`}
                  className="group flex flex-col rounded-3xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.06] hover:border-white/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/15"
                >
                  <p className="font-medium text-white/95 text-[14px] sm:text-[15px] tracking-tight line-clamp-2">
                    {dept.fullName ?? dept.name}
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    {dept.events.length} event{dept.events.length !== 1 ? "s" : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dept.events.map((ev) => (
                      <span
                        key={ev.name}
                        className="text-[10px] font-medium uppercase tracking-wider text-white/50"
                      >
                        {ev.tag ?? ev.type}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto pt-2 text-white/30 text-xs transition-all group-hover:text-white/50" aria-hidden>
                    View →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
