"use client"

import dynamic from "next/dynamic"

const VercelLogoParticles = dynamic(
  () => import("./Home page/vercel-logo-particles").then((m) => m.default),
  { ssr: false }
)

const HackathonSectionWrapper = dynamic(
  () => import("@/components/hackathon-section-wrapper"),
  { ssr: false }
)

const EventsSectionWrapper = dynamic(
  () => import("@/components/events-section-wrapper"),
  { ssr: false }
)

export default function HomeClient() {
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

