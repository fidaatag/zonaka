'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from "next/navigation"
import { api } from "@/trpc/react"
import { DialogTambahSekolahSiswa } from "./dialog-tambah-sekolah-siswa"

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
              <Card key={i} className="border rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">
                    {item.school?.name || item.schoolName || "Nama sekolah tidak tersedia"}
                  </h3>
                  <Badge variant="outline">
                    {item.isCurrent ? "Active" : item.graduationYear ? "Lulus" : "Keluar"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Tahun masuk: {item.entryYear ?? "-"}</p>
                  <p>Tahun lulus / keluar: {item.graduationYear ?? "-"}</p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}


    </Card>
  )
}
