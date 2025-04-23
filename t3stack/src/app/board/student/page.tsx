'use client'

import { CardStudent, type StudentProps, } from "@/components/card-student"
import Link from "next/link";

export default function PageStudent() {
  const dummyStudents: StudentProps[] = [
    {
      name: "Aisyah Putri",
      birthDate: "2015-05-12",
      educationLevel: "SD",
      status: "Aktif",
      imageUrl: "https://avatar.iran.liara.run/public/20",
      school: {
        name: "SD Negeri 1 Harapan Bangsa",
      },
    },
    {
      name: "Fajar Ramadhan",
      birthDate: "2011-09-08",
      educationLevel: "SMP",
      status: "Aktif",
      imageUrl: "https://avatar.iran.liara.run/public/20",
      school: {
        name: "SMP Islam Terpadu Cahaya",
      },
    },
    {
      name: "Indah Permata",
      birthDate: "2007-03-20",
      educationLevel: "SMA",
      status: "Lulus",
      imageUrl: "https://avatar.iran.liara.run/public/20",
      school: {
        name: "SMA Negeri 3 Nusantara",
      },
    },
    {
      name: "Sekar Ayu Perdana Honda",
      birthDate: "2007-03-20",
      educationLevel: "SMP",
      status: "Lulus",
      imageUrl: "https://avatar.iran.liara.run/public/20",
      school: {
        name: "SMA Negeri 3 Nusantara",
      },
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Daftar Anak</h1>
        <p className="text-muted-foreground text-sm">
          Berikut adalah data anak yang telah kamu daftarkan.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dummyStudents.map((student, index) => (
          <Link
            href={`/board/student/123`}
            key={index}
          >
            <CardStudent key={index} student={student} />
          </Link>
        ))}
      </section>
    </div>
  )
}
