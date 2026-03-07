import type { Metadata } from "next"
import dynamic from "next/dynamic"

const VercelLogoParticles = dynamic(
  () => import("./Home page/vercel-logo-particles").then((m) => m.default),
  { ssr: false }
)

const HackathonSectionWrapper = dynamic(
  () => import("@/components/hackathon-section-wrapper"),
  { ssr: false },
)

const EventsSectionWrapper = dynamic(
  () => import("@/components/events-section-wrapper"),
  { ssr: false },
)

export const metadata: Metadata = {
  title: "Luminus Techfest · Home",
  description:
    "Luminus 2026 — RNSIT’s national-level techfest featuring Solaris X Grand Hackathon, flagship department events, and a curated event grid across AI, cybersecurity, gaming, and more.",
  openGraph: {
    title: "Luminus Techfest · Home",
    description:
      "Explore Solaris X Grand Hackathon and 20+ flagship and minor events across AI, cybersecurity, data, hardware, and gaming at RNSIT Bengaluru.",
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

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <div className="min-h-[100svh] md:h-screen relative md:sticky top-0 z-10">
        <VercelLogoParticles />
      </div>
      <div className="mt-[8vh] md:mt-[20vh] relative z-20">
        <HackathonSectionWrapper />
        <div className="mt-2">
          <EventsSectionWrapper />
        </div>
      </div>
    </main>
  )
}

