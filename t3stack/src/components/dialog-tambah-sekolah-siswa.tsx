'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormTambahAnak } from "./form-tambah-anak";
import { useState } from "react"
import { FormTambahSekolahSiswa } from "./form-tambah-sekolah-siswa";

export function DialogTambahSekolahSiswa() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="self-start md:self-auto">
          Tambah Sekolah
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-scroll lg:overflow-auto max-h-screen"
      >
        <DialogHeader>
          <DialogTitle>Tambah Sekolah SIswa</DialogTitle>
          <DialogDescription>
            Silakan isi informasi dasar sekolah siswa.
            Data ini akan digunakan untuk menambahkan sekolah ke profil siswa dalam sistem Zonaka.
          </DialogDescription>
        </DialogHeader>

        <FormTambahSekolahSiswa onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}