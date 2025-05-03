'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { api } from "@/trpc/react"
import { ResumePreview } from "./resume-preview"

export function DialogQueuChainSiswa() {
  const { id } = useParams()
  const { data, isLoading } = api.student.getResumeAcademyByStudentId.useQuery({
    studentId: id as string,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="self-start md:self-auto w-full p-5">
          Masukkan ke Antrian Push Chain
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-screen max-w-3xl">
        <DialogHeader>
          <DialogTitle>Cek Data Sebelum Ke Chain</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p>Loading data...</p>
        ) : data ? (
          <ResumePreview resume={data} />
        ) : (
          <p>Gagal memuat data.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
