"use client"

import Link from "next/link"
import LuminusParticles from "../Home page/vercel-logo-particles"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_ITEMS = [
  {
    q: "When and where is Luminus Techfest held?",
    a: "Luminus Techfest is held at RNSIT, Bengaluru. Check the Schedule page for exact dates and venue details for each event.",
  },
  {
    q: "How do I register for events?",
    a: "Visit the Events page and use the Register button on the specific event card you want to join.",
  },
  {
    q: "Who can participate?",
    a: "Participation rules vary by event. Most events are open to college students; some are open to all. Check the event details on the Events page for eligibility.",
  },
  {
    q: "Is there a registration fee?",
    a: "Registration details and any fees (if applicable) are mentioned per event on its card.",
  },
  {
    q: "How can I get in touch with the organisers?",
    a: "Use the contact details below or reach out via the email/phone provided. For event-specific queries, mention the event name in your message.",
  },
]

export default function ContactPage() {
  return (
    <main className="relative min-h-screen">
      <LuminusParticles startDispersed hideCursor={false} particleGap={4} />
      <div className="relative z-10 pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <header className="mb-10">
            <h1 className="text-[2rem] font-semibold tracking-tight text-white sm:text-3xl">
              Contact
            </h1>
            <p className="mt-1.5 text-sm text-white/50">
              Get in touch with the Luminus Techfest team.
            </p>
          </header>

          <section className="mb-12" aria-label="Contact details">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-2xl overflow-hidden">
              <div className="px-6 py-6 sm:px-8 sm:py-7">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40 mb-4">
                  Reach us
                </h2>
                <ul className="space-y-4 text-white/90">
                  <li>
                    <span className="text-white/50 text-sm block mb-0.5">Email</span>
                    <a
                      href="mailto:luminus@rnsit.ac.in"
                      className="text-white hover:text-white/90 underline underline-offset-2"
                    >
                      luminus@rnsit.ac.in
                    </a>
                  </li>
                  <li>
                    <span className="text-white/50 text-sm block mb-0.5">General enquiries</span>
                    <a
                      href="mailto:events@luminus.in"
                      className="text-white hover:text-white/90 underline underline-offset-2"
                    >
                      events@luminus.in
                    </a>
                  </li>
                  <li>
                    <span className="text-white/50 text-sm block mb-0.5">Venue</span>
                    <p className="text-white/90">RNSIT, Bengaluru</p>
                  </li>
                </ul>
                <p className="mt-6 text-sm text-white/50">
                  For event-specific queries, visit the{" "}
                  <Link href="/events" className="text-white/80 hover:text-white underline underline-offset-2">
                    Events
                  </Link>{" "}
                  page and use the Register button on the relevant event card.
                </p>
              </div>
            </div>
          </section>

          <section aria-label="FAQ">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40 mb-4">
              Frequently asked questions
            </h2>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-2xl overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border-white/10 px-5 sm:px-6 last:border-b-0"
                  >
                    <AccordionTrigger className="text-left text-white/95 hover:text-white py-4 hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 text-sm pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
