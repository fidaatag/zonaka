'use client'

import { api } from "@/trpc/react"
import { CardStudent, type StudentProps } from "@/components/card-student"
import Link from "next/link";

export default function PageStudent() {
  const { data, isLoading } = api.student.getAllStudentByParent.useQuery();

  console.log("DATA STUDENT", data);

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  const students: StudentProps[] = (data?.students ?? []).map(student => ({
    ...student,
    status: student.status as "Aktif" | "Lulus",
    birthDate: student.birthDate ?? "",
    educationLevel: ["SD", "SMP", "SMA", "-"].includes(student.educationLevel)
      ? (student.educationLevel as "SD" | "SMP" | "SMA" | "-")
      : "-",
  }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Daftar Anak</h1>
        <p className="text-muted-foreground text-sm">
          Berikut adalah data anak yang telah kamu daftarkan.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {students.map((student, index) => (
          <Link href={`/board/student/${student.name}`} key={index}>
            <CardStudent student={student} />
          </Link>
        ))}
      </section>
    </div>
  );
}
