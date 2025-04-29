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

export function DialogTambahNilai() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="self-start md:self-auto">
          Tambah Nilai
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-scroll lg:overflow-auto max-h-screen"
      >
        <DialogHeader>
          <DialogTitle>Tambah Anak</DialogTitle>
          <DialogDescription>
            Silakan isi informasi dasar orang tua dan anak. 
            Data ini akan digunakan untuk membuat profil anak dalam sistem Zonaka.
          </DialogDescription>

        </DialogHeader>

        <FormTambahAnak />
      </DialogContent>
    </Dialog>
  )
}
