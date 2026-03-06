import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import { getDepartmentById } from "@/lib/events-data"

const participantSchema = z.object({
  participantNumber: z.number().int().positive(),
  name: z.string().min(1),
  collegeName: z.string().min(1),
  studentId: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(5),
})

const registrationSchema = z.object({
  departmentId: z.string().min(1),
  departmentName: z.string().min(1),
  eventKey: z.string().min(1),
  eventName: z.string().min(1),
  teamSize: z.string().min(1),
  registrationFee: z.number().nullable().optional(),
  participants: z.array(participantSchema).min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registrationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid registration payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const payload = parsed.data

    // Server-side guard: ensure the event exists and is open for registration,
    // regardless of what the client sends.
    const [eventDeptId, indexStr] = payload.eventKey.split(":")
    const eventIndex = Number.parseInt(indexStr ?? "", 10) - 1
    const sourceDept = eventDeptId ? getDepartmentById(eventDeptId) : undefined
    const sourceEvent = sourceDept && eventIndex >= 0 ? sourceDept.events[eventIndex] : undefined

    if (!sourceDept || !sourceEvent) {
      return NextResponse.json(
        { error: "Unknown event. Please refresh and try again." },
        { status: 400 },
      )
    }

    if (sourceEvent.registrationOpen === false) {
      return NextResponse.json(
        { error: "Registrations for this event are closed." },
        { status: 403 },
      )
    }

    const supabase = getSupabaseAdminClient()

    const { error } = await supabase.from("event_registrations").insert({
      department_id: payload.departmentId,
      department_name: payload.departmentName,
      event_key: payload.eventKey,
      event_name: payload.eventName,
      team_size: payload.teamSize,
      registration_fee: payload.registrationFee ?? null,
      participants: payload.participants,
      submitted_at: new Date().toISOString(),
    })

    if (error) {
      return NextResponse.json(
        { error: "Failed to save registration.", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
