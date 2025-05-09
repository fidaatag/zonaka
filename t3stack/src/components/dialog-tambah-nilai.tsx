// File: components/DialogTambahNilai.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormTambahNilai from "./form-tambah-nilai";
import type { Semester, Jenjang, FormSchemaType } from "@/types/academic";

interface DialogTambahNilaiProps {
  onSubmit: (data: FormSchemaType & { total: number; average: number }) => void;
  onSuccess?: () => void; // ✅ tambahan
  editData?: Semester | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  sekolahAktif?: string;
  jenjangAktif?: Jenjang;
}

export default function DialogTambahNilai({
  onSubmit,
  onSuccess,
  editData,
  open,
  setOpen,
  sekolahAktif,
  jenjangAktif,
}: DialogTambahNilaiProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Nilai Semester" : "Tambah Nilai Semester"}
          </DialogTitle>
        </DialogHeader>
        <FormTambahNilai
          onSubmit={(data) => {
            onSubmit(data);
            setOpen(false);
          }}
          onSuccess={onSuccess} 
          editData={editData}
          sekolahAktif={sekolahAktif}
          jenjangAktif={jenjangAktif}
        />
      </DialogContent>
    </Dialog>
  );
}
