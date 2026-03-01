import Link from "next/link"
import dynamic from "next/dynamic"
import VercelLogoParticles from "./Home page/vercel-logo-particles"

const HackathonSectionWrapper = dynamic(
  () => import("@/components/hackathon-section-wrapper"),
  { ssr: false }
)

{/* Techfest tagline + CTA */ }
export default function Page() {
  return (
    <main className="relative min-h-[200vh]">
      <div className="absolute left-1/2 top-[55%] z-10 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-white/90 text-sm sm:text-base font-medium tracking-wide">
          Tech • Innovation • Community
        </p>
        <Link
          href="/events"
          className="mt-4 inline-block rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20 hover:border-white/30"
        >
          View events
        </Link>
      </div>
      <VercelLogoParticles />
      <HackathonSectionWrapper />
      <div className="relative z-10 h-[200vh]" />
    </main>
  )
}

