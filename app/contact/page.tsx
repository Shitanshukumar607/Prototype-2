"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const LuminusParticles = dynamic(
  () => import("../Home page/vercel-logo-particles").then((m) => m.default),
  { ssr: false }
)

const FAQ_ITEMS = [
  {
    q: "Will attendance be given?",
    a: "Attendance will be given to all participants.",
  },
  {
    q: "How do I register for events?",
    a: "Visit the Events page and click the Register button on the event card you want to join.",
  },
  {
    q: "Who can participate?",
    a: "Eligibility varies by event. Most events are open to college students; some are open to all. Check individual event cards on the Events page for details.",
  },
  {
    q: "Is there a registration fee?",
    a: "Registration fees, if applicable, are listed on each event card.",
  },
  {
    q: "How can I get in touch with the organisers?",
    a: "Use the contact details above. For event-specific queries, please mention the event name.",
  },
  {
    q: "At what time will the events start?",
    a: "Timings will be announced by the respective event coordinators closer to the date.",
  },
  {
    q: "Will certificates be given?",
    a: "Yes, e-certificates will be issued to all participants.",
  },
  {
    q: "Will students be given ID cards?",
    a: "Grand Hackathon participants will receive ID cards. All other participants will receive a QR code that serves as their entry ticket.",
  },
]

export default function ContactPage() {
  return (
    <main className="relative min-h-screen">
      <LuminusParticles startDispersed hideCursor={false} particleGap={4} />
      <div className="relative z-[20] pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">

          <header className="mb-10">
            <h1 className="text-[2rem] font-semibold tracking-tight text-white sm:text-3xl">
              Contact
            </h1>
            <p className="mt-1.5 text-sm text-white/50">
              Get in touch with the Luminus Techfest team.
            </p>
          </header>

          {/* Contact details */}
          <section className="mb-12" aria-label="Contact details">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-2xl overflow-hidden">
              <div className="px-6 py-6 sm:px-8 sm:py-7">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40 mb-4">
                  Reach us
                </h2>
                <ul className="space-y-5 text-white/90">
                  <li>
                    <span className="text-white/45 text-xs uppercase tracking-widest block mb-1">Helpdesk</span>
                    <a
                      href="mailto:helpdesk.luminus@gmail.com"
                      className="text-white hover:text-white/80 underline underline-offset-2 transition-colors"
                    >
                      helpdesk.luminus@gmail.com
                    </a>
                  </li>
                  <li>
                    <span className="text-white/45 text-xs uppercase tracking-widest block mb-1">General enquiries</span>
                    <a
                      href="mailto:events@luminus.in"
                      className="text-white hover:text-white/80 underline underline-offset-2 transition-colors"
                    >
                      events@luminus.in
                    </a>
                  </li>
                  <li>
                    <span className="text-white/45 text-xs uppercase tracking-widest block mb-1">Venue</span>
                    <a
                      href="https://maps.app.goo.gl/L7cb1NMmTcFtfPR2A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-white underline underline-offset-2 transition-colors leading-relaxed"
                    >
                      RNS Institute of Technology, Dr. Vishnuvardhan Road,
                      R R Nagar Post, Channasandra, Bengaluru – 560 098
                    </a>
                  </li>
                </ul>
                <p className="mt-6 text-sm text-white/45">
                  For event-specific queries, visit the{" "}
                  <Link href="/events" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">
                    Events
                  </Link>{" "}
                  page and use the Register button on the relevant event card.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section aria-label="Frequently asked questions">
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
                    <AccordionTrigger className="text-left text-white/90 hover:text-white py-4 hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/55 text-sm pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* Footer note */}
          <p className="mt-10 text-center text-[11px] text-white/30 uppercase tracking-widest">
            For any other questions, please contact the Events team.
          </p>

        </div>
      </div>
    </main>
  )
}
