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
import { Card } from "@/components/ui/card"
import { FormTambahAnak } from "./form-tambah-anak";

export function CardDialogRiwayatChain(props: { cardTitle?: string; cardDescription?: string; version?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-5 shadow-md w-full gap-2">
          <h3 className="text-lg font-semibold leading-normal">{props.cardTitle || "Default Card Title"}</h3>
          <p className="text-sm text-gray-600 leading-normal">{props.cardDescription || "Default Card Description"}</p>
          <p className="text-xs text-gray-500 leading-normal">Version: {props.version} || "01"</p>
        </Card>
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
