// File: components/DialogTambahNilai.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormTambahNilai from "./form-tambah-nilai";
import type { Semester } from "@/types/academic";
import type { FormSchemaType } from "@/types/academic";

interface DialogTambahNilaiProps {
  onSubmit: (data: FormSchemaType & { total: number; average: string }) => void;
  editData?: Semester | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DialogTambahNilai({ onSubmit, editData, open, setOpen }: DialogTambahNilaiProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Nilai Semester" : "Tambah Nilai Semester"}</DialogTitle>
        </DialogHeader>
        <FormTambahNilai
          onSubmit={(data) => {
            onSubmit(data);
            setOpen(false);
          }}
          editData={editData}
        />
      </DialogContent>
    </Dialog>
  );
}
