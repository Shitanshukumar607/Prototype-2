import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Schedule · Luminus Techfest",
  description:
    "View the upcoming schedule for Luminus Techfest at RNSIT — event days, hackathon windows, and department tracks.",
  openGraph: {
    title: "Schedule · Luminus Techfest",
    description:
      "Stay updated on the Luminus Techfest timeline, including Solaris X Grand Hackathon and department events.",
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

export default function SchedulePage() {
  return (
    <main className="pt-24 px-6 mb-24">
      <div className="max-w-2xl mx-auto text-white/90">
        <h1 className="text-3xl font-semibold text-white mb-4">Schedule</h1>
        <p className="text-lg leading-relaxed mb-6">
          Dates, timings, and tracks. The full schedule will be published here.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <p className="text-white/70 text-sm">Schedule coming soon.</p>
        </div>
      </div>
    </main>
  )
}
