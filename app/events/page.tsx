import Link from "next/link"
import { departments } from "@/lib/events-data"
import LuminusParticles from "../Home page/vercel-logo-particles"

const GRAND_HACKATHON_ID = "grand-hackathon"

export default function EventsPage() {
  const grandHackathon = departments.find((d) => d.id === GRAND_HACKATHON_ID)
  const otherDepartments = departments.filter((d) => d.id !== GRAND_HACKATHON_ID)

  return (
    <main className="relative min-h-screen">
      <LuminusParticles startDispersed hideCursor={false} particleGap={4} />
      <div className="relative z-10 pt-24 pb-20">
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
                <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-2xl transition-all duration-300 hover:bg-white/[0.09] hover:border-white/[0.12]">
                  <svg
                    viewBox="0 0 12 100"
                    preserveAspectRatio="none"
                    className="absolute left-0 top-0 h-full w-3 text-amber-400/70"
                    aria-hidden
                  >
                    <path
                      d="M 0 0 Q 6 5 0 10 Q 6 15 0 20 Q 6 25 0 30 Q 6 35 0 40 Q 6 45 0 50 Q 6 55 0 60 Q 6 65 0 70 Q 6 75 0 80 Q 6 85 0 90 Q 6 95 0 100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <div className="relative pl-7 pr-6 py-5 sm:pl-9 sm:py-6">
                    <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-amber-400/60">
                      Featured
                    </p>
                    <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                      {grandHackathon.fullName ?? grandHackathon.name}
                    </h2>
                    <p className="mt-1 text-sm text-amber-200/80">
                      3 tracks · 24 hr · ₹1,20,000 prize pool
                    </p>
                    <p className="mt-2 text-[13px] text-white/50 transition-colors group-hover:text-white/70">
                      View details →
                    </p>
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
