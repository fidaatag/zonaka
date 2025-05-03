"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { api } from "@/trpc/react"

type ResumePreviewProps = {
  setOpen: (open: boolean) => void
  resume: {
    parent: {
      name: string
      relation: string
      phone: string
      address: {
        full: string
        latitude: number
        longitude: number
        postalCode: string
      }
    },
    student: {
      id: string
      name: string
      gender: string
      birthDate: string
    },
    grades: {
      educationLevel: string
      schoolId: string
      schoolName: string
      entryYear: number
      isCurrent: boolean
      academicRecords: {
        gradeId: string
        gradeLevel: number
        semester: number
        year: number
        subjects: { name: string; score: number }[]
        total: number
        average: number
      }[]
    }[]
    targets: {
      educationLevel: string
      nextTargetJenjang: string
      schools: {
        targetId: string
        schoolId: string
        schoolName: string
        address: string
      }[]
    }[]
  }
}

export function ResumePreview({ resume, setOpen }: ResumePreviewProps) {
  const jenjangOrder = ["sd", "smp", "sma"]
  const jenjangList = jenjangOrder.filter((j) =>
    resume.grades.some((g) => g.educationLevel.toLowerCase() === j)
  )

  const [selectedJenjang, setSelectedJenjang] = useState(jenjangList[0] ?? "sd")

  const currentGradeData = resume.grades.find(
    (g) => g.educationLevel.toLowerCase() === selectedJenjang
  )
  const currentTarget = resume.targets.find(
    (t) => t.educationLevel.toLowerCase() === selectedJenjang
  )


  const createQueue = api.student.createQueueChainPush.useMutation({
    onSuccess: () => toast.success("Data berhasil dimasukkan ke antrian!"),
    onError: (err) => toast.error(err.message || "Gagal memvalidasi data."),
  })

  const handleSubmit = () => {
    if (!resume.student.id || !currentGradeData || !currentTarget) {
      toast.error("Data belum lengkap.");
      return;
    }

    const payload = {
      student: {
        name: resume.student.name,
        birthDate: resume.student.birthDate,
        gender: resume.student.gender.toUpperCase() as "MALE" | "FEMALE",
      },
      parent: resume.parent,
      grades: [currentGradeData],
      targets: [currentTarget],
    }

    createQueue.mutate({
      studentId: resume.student.id,
      payload,
    })

    setTimeout(() => {
      setOpen(false);
    }, 3000);

  }



  return (
    <div className="space-y-6">
      {/* Data Orang Tua */}
      <div className="grid grid-cols-2 gap-4 text-sm border p-4 rounded">
        <div>
          <h3 className="font-semibold mb-1">Data Orang Tua</h3>
          <p>Nama: {resume.parent.name}</p>
          <p>Relasi: {resume.parent.relation}</p>
          <p>Telepon: {resume.parent.phone}</p>
          <h3 className="font-semibold mb-1">Alamat</h3>
          <p>{resume.parent.address.full}</p>
          <p>Kode Pos: {resume.parent.address.postalCode}</p>
          <p>
            Koordinat: {resume.parent.address.latitude},{" "}
            {resume.parent.address.longitude}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Data Siswa</h3>
          <p>Nama: {resume.student.name}</p>
          <p>Gender: {resume.student.gender}</p>
          <p>Tanggal lahir: {resume.student.birthDate} </p>
        </div>
      </div>

      <Separator />

      {/* Tabs Jenjang */}
      <Tabs value={selectedJenjang} onValueChange={setSelectedJenjang}>
        <TabsList>
          {jenjangList.map((jenjang) => (
            <TabsTrigger key={jenjang} value={jenjang}>
              {jenjang.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        {currentGradeData && (
          <TabsContent value={selectedJenjang} className="mt-4 space-y-4">
            {/* Data Nilai */}
            <div className="text-sm border p-4 rounded space-y-2">
              <div>
                <h4 className="font-semibold">
                  Data Nilai - {selectedJenjang.toUpperCase()}
                </h4>
                <p>Sekolah: {currentGradeData.schoolName}</p>
                <p>Tahun Masuk: {currentGradeData.entryYear}</p>
                <p>Status: {currentGradeData.isCurrent ? "Aktif" : "Lulus"}</p>
              </div>

              <div className="overflow-x-auto mt-2">
                <table className="min-w-full text-center border-collapse border text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-1">Kelas</th>
                      <th className="border p-1">Semester</th>
                      <th className="border p-1">Tahun</th>
                      <th className="border p-1">Mapel</th>
                      <th className="border p-1">Total</th>
                      <th className="border p-1">Rata-rata</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentGradeData.academicRecords.map((r, idx) => (
                      <tr key={idx}>
                        <td className="border p-1">{r.gradeLevel}</td>
                        <td className="border p-1">{r.semester}</td>
                        <td className="border p-1">{r.year}</td>
                        <td className="border p-1 text-left">
                          <ul className="list-disc list-inside text-left">
                            {r.subjects.map((s, j) => (
                              <li key={j}>
                                {s.name}: {s.score}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="border p-1">{r.total}</td>
                        <td className="border p-1">{r.average}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Target Sekolah */}
            <div className="text-sm border p-4 rounded space-y-1">
              <p className="font-semibold">
                Target Sekolah - {currentTarget?.nextTargetJenjang?.toUpperCase()}
              </p>
              {currentTarget?.schools?.length ? (
                <ol className="list-decimal ml-4">
                  {currentTarget.schools.map((s) => (
                    <li key={s.schoolId}>
                      {s.schoolName} - {s.address}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground italic">Tidak ada target sekolah</p>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSubmit} disabled={createQueue.status === "pending"}>
          {createQueue.status === "pending" ? "Menyimpan..." : "Data Valid"}
        </Button>
      </div>
    </div>
  )
}