import Link from "next/link"
import { notFound } from "next/navigation"
import { getDepartmentById, getDepartmentIds } from "@/lib/events-data"
import DepartmentEventsPageClient from "./page-client"

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

  return <DepartmentEventsPageClient dept={dept} />
}
