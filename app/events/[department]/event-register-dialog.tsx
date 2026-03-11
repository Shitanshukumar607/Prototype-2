"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface EventRegisterDialogProps {
  departmentId: string
  departmentName: string
  eventKey: string
  eventName: string
  teamSize: string
  registrationFee?: number
  registrationOpen?: boolean
}

const INNOVATRIUM_TRACKS = [
  "VLSI",
  "Signal Processing",
  "Communication",
  "Embedded Systems and IoT",
  "Robotics",
  "Photonics",
] as const

function parseTeamSize(teamSize: string): { min: number; max: number } {
  const cleaned = teamSize.toLowerCase().trim()

  // Patterns like "2-4", "3 - 5"
  const rangeMatch = cleaned.match(/(\d+)\s*[-–]\s*(\d+)/)
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10)
    const max = parseInt(rangeMatch[2], 10)
    if (!Number.isNaN(min) && !Number.isNaN(max) && max >= min) {
      return { min, max }
    }
  }

  // Patterns like "upto 4", "up to 4", "max 5"
  const upToMatch = cleaned.match(/(upto|up to|max)\s+(\d+)/)
  if (upToMatch) {
    const max = parseInt(upToMatch[2], 10)
    if (!Number.isNaN(max)) {
      return { min: 1, max }
    }
  }

  // Single number like "2" or "4"
  const singleMatch = cleaned.match(/(\d+)/)
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10)
    if (!Number.isNaN(n) && n > 0) {
      return { min: n, max: n }
    }
  }

  // Fallback: assume 2 members
  return { min: 2, max: 2 }
}

export function EventRegisterDialog({
  departmentId,
  departmentName,
  eventKey,
  eventName,
  teamSize,
  registrationFee,
  registrationOpen = true,
}: EventRegisterDialogProps) {
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { min, max } = useMemo(() => parseTeamSize(teamSize), [teamSize])
  const [participantSlots, setParticipantSlots] = useState<number[]>(
    Array.from({ length: min }, (_, i) => i + 1)
  )
  const [collegeValues, setCollegeValues] = useState<Record<number, string>>({})
  const isInnovatrium = departmentId === "ece" && eventName === "Innovatrium"
  const [selectedTrack, setSelectedTrack] = useState<string>("")

  useEffect(() => {
    if (open) {
      setParticipantSlots(Array.from({ length: min }, (_, i) => i + 1))
      setCollegeValues({})
      if (isInnovatrium) setSelectedTrack("")
    }
  }, [min, open, isInnovatrium])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setErrorMessage(null)
          setIsSubmitting(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          disabled={!registrationOpen}
          className="mt-1 rounded-full bg-amber-400 text-black shadow-[0_10px_30px_rgba(251,191,36,0.28)] transition-all hover:-translate-y-0.5 hover:bg-amber-300 disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:bg-amber-400"
        >
          {registrationOpen ? "Register" : "Registrations closed"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-[#020202]/95 text-white border-0 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl p-0 overflow-hidden">
        <div className="rounded-t-3xl border-b border-white/[0.05] bg-gradient-to-r from-[#111111] via-[#080808] to-[#0f0f0f] px-6 py-5">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight">
            Register for {eventName}
            </DialogTitle>
            <DialogDescription className="text-sm text-white/65 text-left">
              {departmentName} · Team size: {teamSize}
              {registrationFee != null && (
                <> · Registration fee: ₹{registrationFee}</>
              )}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="max-h-[72vh] overflow-y-auto no-scrollbar bg-[#050505]/95 rounded-b-3xl">
          <form
            onSubmit={async (e) => {
              const form = e.currentTarget as HTMLFormElement
              if (!form.checkValidity()) {
                e.preventDefault()
                setErrorMessage("Please fill all mandatory fields marked with *.")
                form.reportValidity()
                return
              }
              e.preventDefault()
              setErrorMessage(null)

              if (isInnovatrium && !selectedTrack) {
                setErrorMessage("Please select one Innovatrium track before registering.")
                return
              }

              const formData = new FormData(form)
              const payloadParticipants: Array<{
                participantNumber: number
                name: string
                collegeName: string
                studentId: string
                email: string
                phoneNumber: string
                track?: string
              }> = []

              for (const memberIndex of participantSlots) {
                const name = String(formData.get(`name${memberIndex}`) ?? "").trim()
                const collegeName = String(formData.get(`college${memberIndex}`) ?? "").trim()
                const studentId = String(formData.get(`studentId${memberIndex}`) ?? "").trim()
                const email = String(formData.get(`email${memberIndex}`) ?? "").trim()
                const phoneNumber = String(formData.get(`phone${memberIndex}`) ?? "").trim()

                const fields = [name, collegeName, studentId, email, phoneNumber]
                const allFilled = fields.every((value) => value.length > 0)

                // Every visible slot is mandatory
                if (!allFilled) {
                  setErrorMessage(
                    `Please complete all fields for Participant ${memberIndex}.`
                  )
                  return
                }
                payloadParticipants.push({
                  participantNumber: memberIndex,
                  name,
                  collegeName,
                  studentId,
                  email,
                  phoneNumber,
                  ...(isInnovatrium ? { track: selectedTrack } : {}),
                })
              }

              if (payloadParticipants.length < min) {
                setErrorMessage(`Please add details for at least ${min} participants.`)
                return
              }

              try {
                setIsSubmitting(true)
                const response = await fetch("/api/event-registrations", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    departmentId,
                    departmentName,
                    eventKey,
                    eventName,
                    teamSize,
                    registrationFee: registrationFee ?? null,
                    participants: payloadParticipants,
                  }),
                })

                if (!response.ok) {
                  const responseBody = await response.json().catch(() => null)

                  // Try to surface a specific field error from Zod, e.g. which
                  // participant / field failed validation, instead of a generic payload error.
                  let message: string =
                    typeof responseBody?.error === "string"
                      ? responseBody.error
                      : "Unable to submit registration right now. Please try again."

                  const fieldErrors = (responseBody as any)?.details?.fieldErrors as
                    | Record<string, string[]>
                    | undefined

                  if (fieldErrors) {
                    const firstWithMessage = Object.entries(fieldErrors).find(
                      ([, msgs]) => Array.isArray(msgs) && msgs.length > 0,
                    )

                    if (firstWithMessage) {
                      const [rawPath, msgs] = firstWithMessage
                      const rawReason = msgs[0]

                      // Zod paths for participants look like "participants.1.email"
                      const match = rawPath.match(/^participants\.(\d+)\.(.+)$/)
                      if (match) {
                        const participantNumber = Number.parseInt(match[1] ?? "0", 10) + 1
                        const fieldKey = match[2]
                        const fieldLabelMap: Record<string, string> = {
                          name: "name",
                          collegeName: "college name",
                          studentId: "USN / student ID",
                          email: "email",
                          phoneNumber: "phone number",
                          track: "track",
                        }
                        const fieldLabel = fieldLabelMap[fieldKey] ?? fieldKey
                        message = `Participant ${participantNumber}: ${fieldLabel} ${rawReason}`
                      } else if (rawPath && rawReason) {
                        message = `${rawPath}: ${rawReason}`
                      }
                    }
                  }

                  setErrorMessage(message)
                  toast({
                    title: "Registration failed",
                    description: message,
                  })
                  return
                }

                form.reset()
                setCollegeValues({})
                setParticipantSlots(Array.from({ length: min }, (_, i) => i + 1))
                setOpen(false)
                toast({
                  title: "Registration submitted",
                  description: "Redirecting to payment...",
                })
                window.location.href = "https://payments.billdesk.com/bdcollect/bd/rnsiotec/6492"
              } catch {
                const message = "Unable to submit registration right now. Please try again."
                setErrorMessage(message)
                toast({
                  title: "Registration failed",
                  description: message,
                })
              } finally {
                setIsSubmitting(false)
              }
            }}
            className="space-y-5 text-sm px-6 pb-5 pt-4"
          >
            {isInnovatrium && (
              <section className="space-y-3 rounded-2xl border border-white/[0.10] bg-white/[0.02] px-4 py-4 backdrop-blur-xl">
                <header className="flex items-baseline justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/55 font-medium">
                    Innovatrium track *
                  </p>
                  <span className="text-[10px] text-white/35">
                    Choose one focused stream per team.
                  </span>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                  {INNOVATRIUM_TRACKS.map((track) => {
                    const active = selectedTrack === track
                    return (
                      <button
                        key={track}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedTrack(track)}
                        className={`
                          flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-[13px]
                          border transition-all duration-200
                          ${active
                            ? "border-amber-300/80 bg-amber-300/10 text-white shadow-[0_0_0_1px_rgba(251,191,36,0.18)]"
                            : "border-white/12 bg-black/40 text-white/75 hover:border-white/30 hover:bg-black/30"}
                        `}
                      >
                        <span className="truncate">{track}</span>
                        <span
                          className={`ml-2 h-2.5 w-2.5 rounded-full ${
                            active
                              ? "bg-amber-300 shadow-[0_0_0_4px_rgba(251,191,36,0.28)]"
                              : "bg-white/22"
                          }`}
                          aria-hidden
                        />
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {!registrationOpen && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
                Registrations for this event are currently closed.
              </div>
            )}
            <div className="space-y-3 rounded-2xl border-0 bg-gradient-to-b from-[#151515] to-[#0c0c0c] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-medium">
                Participants
              </p>
              <div className="space-y-4">
              {participantSlots.map((memberIndex) => {
              const required = true // all visible slots are mandatory; use "−" to remove optional ones
              const nameId = `name${memberIndex}`
              const collegeId = `college${memberIndex}`
              const studentId = `studentId${memberIndex}`
              const emailId = `email${memberIndex}`
              const phoneId = `phone${memberIndex}`
              const primaryCollege = (collegeValues[1] ?? "").trim()
              const memberCollege = collegeValues[memberIndex] ?? ""
              const showCollegeSuggestion =
                memberIndex > 1 && primaryCollege.length > 0 && memberCollege.trim().length === 0

              const nameLabel = `Participant name ${memberIndex}`

                return (
                  <Fragment key={`member-${memberIndex}`}>
                    <div className="relative rounded-xl bg-black/30 p-3 sm:p-4 space-y-4">
                      {memberIndex > min && participantSlots.length > min && (
                        <button
                          type="button"
                          onClick={() => {
                            setParticipantSlots((prev) => prev.filter((slot) => slot !== memberIndex))
                            setCollegeValues((prev) => {
                              const next = { ...prev }
                              delete next[memberIndex]
                              return next
                            })
                          }}
                          className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2a2a2a] text-white/90 hover:bg-[#383838] transition-colors"
                          aria-label={`Remove participant ${memberIndex}`}
                        >
                          -
                        </button>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor={nameId} className="text-sm text-white/90">
                            {nameLabel}
                            {required && <span className="ml-0.5 text-red-400">*</span>}
                          </Label>
                          <Input
                            id={nameId}
                            name={nameId}
                            required={required}
                            className="h-11 rounded-xl border-0 bg-[#30343a] text-white placeholder:text-[#aeb4bc] focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={collegeId} className="text-sm text-white/90">
                            College name
                            {required && <span className="ml-0.5 text-red-400">*</span>}
                          </Label>
                          <Input
                            id={collegeId}
                            name={collegeId}
                            required={required}
                            value={memberCollege}
                            onChange={(e) =>
                              setCollegeValues((prev) => ({
                                ...prev,
                                [memberIndex]: e.target.value,
                              }))
                            }
                            className="h-11 rounded-xl border-0 bg-[#30343a] text-white placeholder:text-[#aeb4bc] focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-offset-0"
                          />
                          {showCollegeSuggestion && (
                            <button
                              type="button"
                              onClick={() =>
                                setCollegeValues((prev) => ({
                                  ...prev,
                                  [memberIndex]: primaryCollege,
                                }))
                              }
                              className="text-xs text-amber-300/95 hover:text-amber-200 transition-colors"
                            >
                              Use same as Participant 1: {primaryCollege}
                            </button>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={studentId} className="text-sm text-white/90">
                            USN/Student ID
                            {required && <span className="ml-0.5 text-red-400">*</span>}
                          </Label>
                          <Input
                            id={studentId}
                            name={studentId}
                            required={required}
                            className="h-11 rounded-xl border-0 bg-[#30343a] text-white placeholder:text-[#aeb4bc] focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={emailId} className="text-sm text-white/90">
                            Email
                            {required && <span className="ml-0.5 text-red-400">*</span>}
                          </Label>
                          <Input
                            id={emailId}
                            name={emailId}
                            type="email"
                            autoComplete="email"
                            required={required}
                            className="h-11 rounded-xl border-0 bg-[#30343a] text-white placeholder:text-[#aeb4bc] focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor={phoneId} className="text-sm text-white/90">
                            Phone number
                            {required && <span className="ml-0.5 text-red-400">*</span>}
                          </Label>
                          <Input
                            id={phoneId}
                            name={phoneId}
                            type="tel"
                            autoComplete="tel"
                            required={required}
                            className="h-11 rounded-xl border-0 bg-[#30343a] text-white placeholder:text-[#aeb4bc] focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>
                    </div>
                  </Fragment>
                )
              })}
              {participantSlots.length < max && (
                <div className="flex justify-start pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setParticipantSlots((prev) => {
                        if (prev.length >= max) return prev
                        const used = new Set(prev)
                        const next = Array.from({ length: max }, (_, i) => i + 1).find(
                          (value) => !used.has(value)
                        )
                        if (!next) return prev
                        return [...prev, next]
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] px-3 py-1.5 text-sm text-white/90 hover:bg-[#2a2a2a] transition-colors"
                    aria-label="Add participant"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#30343a] text-white leading-none">
                      +
                    </span>
                    Add participant
                  </button>
                </div>
              )}
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
            )}

            <DialogFooter className="pt-1 border-t border-white/[0.05] mt-1 -mx-6 px-6 pb-4 pt-3 bg-gradient-to-r from-[#0b0b0b] via-[#060606] to-[#0b0b0b] rounded-b-3xl">
              <div className="flex w-full justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 rounded-full bg-amber-400 px-5 text-black font-semibold shadow-[0_10px_30px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-0.5 hover:bg-amber-300"
                >
                  {isSubmitting ? "Saving & redirecting..." : "Pay now"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

