import dynamic from "next/dynamic"
import VercelLogoParticles from "./Home page/vercel-logo-particles"

const HackathonSectionWrapper = dynamic(
  () => import("@/components/hackathon-section-wrapper"),
  { ssr: false }
)

const EventsSectionWrapper = dynamic(
  () => import("@/components/events-section-wrapper"),
  { ssr: false }
)

export default function Page() {
  return (
    <main className="relative" style={{ minHeight: "300vh" }}>
      <div className="h-screen sticky top-0 z-10">
        <VercelLogoParticles />
      </div>
      <div className="mt-[20vh] relative z-20">
        <HackathonSectionWrapper />
        <div className="mt-8">
          <EventsSectionWrapper />
        </div>
      </div>
    </main>
  )
}

