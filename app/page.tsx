import type { Metadata } from "next"
import HomeClient from "./home-client"

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
        width: 1200,
        height: 630,
        alt: "Luminus Techfest 2026 hero graphic",
      },
    ],
  },
};

export default function Page() {
  return <HomeClient />
}
