'use client'

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormTambahNilai from "./form-tambah-nilai";

interface DialogTambahNilaiProps {
  onSubmit: (data: any) => void;
}

export default function DialogTambahNilai({ onSubmit }: DialogTambahNilaiProps) {
  const [open, setOpen] = useState(false);
  const handleSubmit = (data: any) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah Nilai</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Tambah Nilai</DialogTitle>
          <DialogDescription>Masukkan nilai dan info sekolah</DialogDescription>
        </DialogHeader>
        <FormTambahNilai onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}