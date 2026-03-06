import Link from "next/link"
import { notFound } from "next/navigation"
import { getDepartmentById, getDepartmentIds } from "@/lib/events-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import LuminusParticles from "../../Home page/vercel-logo-particles"
import { EventCardRules } from "./event-card-rules"
import { EventRegisterDialog } from "./event-register-dialog"
import { ContactList } from "./contact-list"
import { EventHighlighter } from "./event-highlighter"

interface PageProps {
  params: Promise<{ department: string }>
}

export async function generateStaticParams() {
  return getDepartmentIds().map((id) => ({ department: id }))
}

export default async function DepartmentEventsPage({ params }: PageProps) {
  const { department: slug } = await params
  const dept = getDepartmentById(slug)
  if (!dept) notFound()

  const eventsForDisplay = dept.events
    .map((ev, originalIndex) => ({ ev, originalIndex }))
    .sort((a, b) => {
      const rank = (e: (typeof a)["ev"]) =>
        e.tag === "Grand Hackathon" || e.type === "Flagship" ? 0 : 1
      return rank(a.ev) - rank(b.ev)
    })

  return (
    <main className="relative min-h-screen">
      <EventHighlighter />
      <LuminusParticles startDispersed hideCursor={false} particleGap={4} />
      <div className="relative z-[20] pt-24 px-6 pb-24">
        <div className="max-w-3xl mx-auto text-white/90">
        <Link
          href="/events"
          className="text-sm text-white/70 hover:text-white mb-6 inline-block"
        >
          ← All events
        </Link>
        <h1 className="text-3xl font-semibold text-white mb-2">
          {dept.fullName ?? dept.name}
        </h1>
        <p className="text-white/70 mb-10">
          {dept.events.length} event{dept.events.length !== 1 ? "s" : ""} in this department.
        </p>
        <div className="space-y-6">
          {eventsForDisplay.map(({ ev, originalIndex }, displayIndex) => {
            const primaryContact = ev.contacts?.[0]
            return (
              <Card
                key={ev.name}
                id={`event-${originalIndex}`}
                className="rounded-2xl border-white/10 bg-white/5 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden"
              >
                <CardHeader className="pb-3 px-6 pt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-xl text-white tracking-tight">
                      {ev.name}
                    </CardTitle>
                    <Badge
                      variant={ev.type === "Flagship" ? "default" : "secondary"}
                      className={
                        ev.type === "Flagship"
                          ? "rounded-full bg-amber-500/20 text-amber-300 border-amber-500/40 px-2.5 py-0.5"
                          : "rounded-full bg-white/10 text-white/80 border-white/20 px-2.5 py-0.5"
                      }
                    >
                      {ev.tag ?? ev.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60 pt-2">
                    {ev.date && <span>Date: {ev.date}</span>}
                    <span>Team: {ev.teamSize}</span>
                    <span>Duration: {ev.duration}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4 text-sm">
                  {ev.description && (
                    <p className="text-white/80 leading-relaxed">{ev.description}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/80">
                    {ev.registrationFee != null && (
                      <p><span className="text-white/50">Registration fee:</span> ₹{ev.registrationFee}</p>
                    )}
                    {dept.id !== "grand-hackathon" && (
                      <p className="flex items-center gap-2">
                        <span className="text-white/50">Prize pool:</span>
                        <span
                          className="font-semibold tracking-tight"
                          style={{
                            color: ev.type === "Flagship" ? "rgba(251,191,36,0.95)" : "rgba(147,197,253,0.95)",
                            textShadow: ev.type === "Flagship"
                              ? "0 0 18px rgba(251,191,36,0.35)"
                              : "0 0 14px rgba(147,197,253,0.25)",
                          }}
                        >
                          ₹{ev.prize.toLocaleString("en-IN")}{ev.type === "Flagship" ? "+" : ""}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="pt-1">
                    <EventRegisterDialog
                      departmentId={dept.id}
                      departmentName={dept.fullName ?? dept.name}
                      eventKey={`${dept.id}:${originalIndex + 1}`}
                      eventName={ev.name}
                      teamSize={ev.teamSize}
                      registrationFee={ev.registrationFee}
                    />
                  </div>
                  {ev.rules && <EventCardRules rules={ev.rules} />}
                  {ev.contacts && ev.contacts.length > 0 && (
                    <div>
                      <h4 className="text-white/90 font-medium mb-2">Contact</h4>
                      <ContactList contacts={ev.contacts} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
        </div>
      </div>
    </main>
  )
}
