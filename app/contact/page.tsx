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
    q: "Who can participate in Luminus?",
    a: "Students from engineering colleges across India, including undergraduate (B.E./B.Tech) and MCA students, are eligible to participate.",
  },
  {
    q: "How do I register for events?",
    a: "Participants can register through the official Luminus website by selecting the desired event and completing the registration process.",
  },
  {
    q: "Are registration fees refundable?",
    a: "No. Once the registration is completed and the payment is made, the fee is non-refundable under any circumstances.",
  },
  {
    q: "Can students participate in multiple events?",
    a: "Yes, participants can register for multiple events as long as the event timings do not clash.",
  },
  {
    q: "Is there a limit on team size?",
    a: "Yes, the team size varies depending on the event. The allowed team size will be mentioned in the event description.",
  },
  {
    q: "Will accommodation be provided for outstation participants?",
    a: "Participants are advised to arrange their own accommodation unless otherwise specified by the organisers.",
  },
  {
    q: "What should participants bring for the events?",
    a: "Participants should bring a valid college ID and any materials required for the event (such as laptops for coding or hackathon events).",
  },
  {
    q: "How can I contact the organisers or receive event updates?",
    a: "Participants can contact the organisers through the contact details provided on the Luminus website. Important information such as event venues, reporting times, and updates will also be communicated through official channels before the fest.",
  },
  {
    q: "Can participants from different colleges form a team or add members on the day of the event?",
    a: "Participants from different colleges may form a team unless the event rules specify otherwise. However, only the registered participants listed in the official registration sheet will be allowed to participate, and additional members cannot be added on the day of the event.",
  },
  {
    q: "What should I do if my event timings clash with another event I registered for?",
    a: "Participants are responsible for ensuring their registered events do not have timing conflicts. The organisers may not be able to accommodate schedule changes.",
  },
  {
    q: "Do participants need to bring their own laptops or equipment?",
    a: "Yes, participants should bring their own laptops or any required equipment unless the event description specifies otherwise.",
  },
  {
    q: "What happens if a participant arrives late to the event?",
    a: "Late entry may be allowed at the discretion of the event coordinators, provided the event has not progressed significantly.",
  },
  {
    q: "Is prior knowledge required to participate in the events?",
    a: "Some events may require basic technical knowledge or skills. Participants are advised to review the event description and rules before registering.",
  },
  {
    q: "Will there be food or refreshment arrangements during the fest?",
    a: "Food and refreshments may be available on campus through designated stalls or the college cafeteria.",
  },
  {
    q: "What should participants do if they face issues during the event?",
    a: "Participants should immediately contact the event coordinators or approach the help desk for assistance.",
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
              Reach the Luminus Techfest organising team at RNSIT.
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
