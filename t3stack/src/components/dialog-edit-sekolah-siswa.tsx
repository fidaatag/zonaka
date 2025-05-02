'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useState } from "react"
import { FormEditSekolahSiswa } from "@/components/form-edit-sekolah-siswa"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/api/root"

type SchoolHistory = inferRouterOutputs<AppRouter>["student"]["getSchoolHistoryByStudentId"][number]

export function DialogEditSekolahSiswa({ data }: { data: SchoolHistory }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer border rounded-xl p-4 hover:bg-muted transition">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">
              {data.school?.name || data.schoolName || "Nama sekolah tidak tersedia"}
            </h3>
            <div>
              <span className="text-sm border px-2 py-0.5 rounded">
                {data.isCurrent ? "Active" : data.graduationYear ? "Lulus" : "Keluar"}
              </span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Tahun masuk: {data.entryYear ?? "-"}</p>
            <p>Tahun lulus / keluar: {data.graduationYear ?? "-"}</p>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Sekolah</DialogTitle>
          <DialogDescription>Ubah informasi sekolah siswa.</DialogDescription>
        </DialogHeader>

        <FormEditSekolahSiswa defaultData={data} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
