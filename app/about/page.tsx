import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · Luminus Techfest",
  description:
    "Learn about Luminus, RNSIT’s national-level techfest — its vision, flagship hackathon Solaris X, and cross-disciplinary events that bring engineers and innovators together.",
  openGraph: {
    title: "About · Luminus Techfest",
    description:
      "Luminus Techfest at RNSIT celebrates engineering, innovation, and collaboration through hackathons, workshops, and department events.",
    images: [
      {
        url: "/og-luminus-2026.png",
        width: 1200,
        height: 630,
        alt: "Luminus Techfest 2026 hero graphic",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <main className="pt-24 px-6 mb-24">
      <div className="max-w-2xl mx-auto text-white/90">
        <h1 className="text-3xl font-semibold text-white mb-4">
          About Luminus Techfest
        </h1>
        <p className="text-lg leading-relaxed">
          Luminus Techfest brings together tech enthusiasts, innovators, and the
          community for workshops, hackathons, and talks. Stay tuned for dates
          and venue.
        </p>
      </div>
    </main>
  );
}
