'use client'

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from "next/navigation"
import { api } from "@/trpc/react"
import { DialogTambahSekolahSiswa } from "./dialog-tambah-sekolah-siswa"
import { DialogEditSekolahSiswa } from "./dialog-edit-sekolah-siswa"

export default function CardSchool() {
  const params = useParams()
  const studentId = params?.id as string

  const { data, isLoading } = api.student.getSchoolHistoryByStudentId.useQuery({ id: studentId })

  if (isLoading) return <p>Loading...</p>

  return (
    <Card className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Data Sekolah</h2>
        <DialogTambahSekolahSiswa />
      </div>

      {!data || data.length === 0 ? (
        <p className="text-center text-muted-foreground">Siswa belum memiliki data sekolah</p>
      ) : (
        <ScrollArea className="h-96 pr-2">
          <div className="space-y-4">
            {data.map((item, i) => (
              <DialogEditSekolahSiswa key={i} data={item} />
            ))}
          </div>
        </ScrollArea>
      )}


    </Card>
  )
}
