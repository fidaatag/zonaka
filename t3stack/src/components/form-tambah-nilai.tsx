"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Jenjang, FormSchemaType, Semester } from "@/types/academic";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  id: z.string().optional(),
  jenjang: z.enum(["SD", "SMP", "SMA"]),
  sekolah: z.string().min(1),
  kelas: z.string().min(1),
  semester: z.enum(["1", "2"]),
  bahasaIndonesia: z.coerce.number().min(0).max(100),
  matematika: z.coerce.number().min(0).max(100),
  ipa: z.coerce.number().min(0).max(100),
  bahasaInggris: z.coerce.number().min(0).max(100).optional(),
});

interface FormTambahNilaiProps {
  onSubmit: (data: FormSchemaType & { total: number; average: number }) => void;
  editData?: Semester | null;
  sekolahAktif?: string;
  jenjangAktif?: Jenjang;
}

export default function FormTambahNilai({
  onSubmit,
  editData,
  sekolahAktif,
  jenjangAktif,
}: FormTambahNilaiProps) {
  const params = useParams();
  const studentId = params?.id as string;

  const defaultValues: FormSchemaType = editData
    ? {
      id: editData.id,
      jenjang: jenjangAktif ?? "SD",
      sekolah: sekolahAktif ?? "",
      kelas: String(editData.kelas),
      semester: String(editData.semester) as "1" | "2",
      bahasaIndonesia: editData.nilai.find(n => n.mapel === "Bahasa Indonesia")?.skor ?? 0,
      matematika: editData.nilai.find(n => n.mapel === "Matematika")?.skor ?? 0,
      ipa: editData.nilai.find(n => n.mapel === "IPA")?.skor ?? 0,
      bahasaInggris: editData.nilai.find(n => n.mapel === "Bahasa Inggris")?.skor ?? 0,
    }
    : {
      id: undefined,
      jenjang: jenjangAktif ?? "SD",
      sekolah: sekolahAktif ?? "",
      kelas: "",
      semester: "1",
      bahasaIndonesia: 0,
      matematika: 0,
      ipa: 0,
      bahasaInggris: 0,
    };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const watchJenjang = form.watch("jenjang");
  const isSD = watchJenjang === "SD";
  const watchValues = form.watch();

  const { data: schoolHistories = [] } = api.student.getSchoolHistoryByStudentId.useQuery({ id: studentId });

  const createGrade = api.student.createGradesPerSemesterByStudentId.useMutation({
    onSuccess: () => {
      toast.success("Nilai siswa berhasil ditambahkan");
      form.reset();
    },
    onError: (err) => {
      toast.error("Gagal menambahkan nilai: " + err.message);
    },
  });

  const updateGrade = api.student.updateGradesByGroupId.useMutation({
    onSuccess: () => {
      toast.success("Nilai siswa berhasil diperbarui");
      form.reset();
    },
    onError: (err) => {
      toast.error("Gagal memperbarui nilai: " + err.message);
    },
  });

  const filteredSchools = schoolHistories.filter(
    (s) => s.educationLevel.toLowerCase() === watchJenjang.toLowerCase() && s.schoolId?.trim()
  );

  useEffect(() => {
    if (isSD) form.setValue("bahasaInggris", 0);
  }, [isSD, form]);

  useEffect(() => {
    if (filteredSchools.length > 0) {
      const first = filteredSchools[0]!;
      form.setValue("sekolah", first.schoolId!);
    } else {
      form.setValue("sekolah", "");
    }

    const kelasMap = {
      SD: ["4", "5", "6"],
      SMP: ["7", "8", "9"],
      SMA: ["10", "11", "12"],
    };
    const validKelas = kelasMap[watchJenjang];
    const currentKelas = form.getValues("kelas");
    if (!validKelas.includes(currentKelas)) {
      form.setValue("kelas", validKelas[0]!);
    }
  }, [watchJenjang]);

  const nilaiList = [
    watchValues.bahasaIndonesia,
    watchValues.matematika,
    watchValues.ipa,
    ...(isSD ? [] : [watchValues.bahasaInggris ?? 0]),
  ];

  const total = nilaiList.reduce((a, b) => a + b, 0);
  const average = Number((total / nilaiList.length).toFixed(2));

  const handleSubmitForm = (data: FormSchemaType) => {
    const year = new Date().getFullYear();
    const common = {
      studentId,
      schoolId: data.sekolah,
      educationLevel: data.jenjang,
      gradeLevel: parseInt(data.kelas),
      semester: parseInt(data.semester),
      year,
    };

    const subjects = [
      { subject: "Bahasa Indonesia", score: data.bahasaIndonesia },
      { subject: "Matematika", score: data.matematika },
      { subject: "IPA", score: data.ipa },
      ...(data.jenjang !== "SD" ? [{ subject: "Bahasa Inggris", score: data.bahasaInggris ?? 0 }] : []),
    ];

    if (editData) {
      updateGrade.mutate({
        ...common,
        subjects: subjects.map((s) => {
          const existing = editData.nilai.find((n) => n.mapel === s.subject);
          return {
            gradeId: existing?.id ?? "", // harusnya selalu ada
            subject: s.subject,
            score: s.score,
          };
        }),
      });
    } else {
      createGrade.mutate({
        ...common,
        grades: subjects,
      });
    }

    onSubmit({ ...data, total, average });
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
          {/* Jenjang */}
          <FormField control={form.control} name="jenjang" render={({ field }) => (
            <FormItem>
              <FormLabel>Jenjang</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SD">SD</SelectItem>
                  <SelectItem value="SMP">SMP</SelectItem>
                  <SelectItem value="SMA">SMA</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} />

          {/* Sekolah */}
          <FormField control={form.control} name="sekolah" render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Sekolah</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Pilih sekolah" /></SelectTrigger>
                <SelectContent>
                  {filteredSchools.length === 0 ? (
                    <SelectItem value="-" disabled>Tidak ada sekolah</SelectItem>
                  ) : (
                    filteredSchools.map((s) => (
                      <SelectItem key={s.schoolId} value={s.schoolId!}>
                        {s.school?.name ?? s.schoolName ?? "Tanpa nama"}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormItem>
          )} />

          {/* Kelas */}
          <FormField control={form.control} name="kelas" render={({ field }) => {
            const kelasMap = {
              SD: ["4", "5", "6"],
              SMP: ["7", "8", "9"],
              SMA: ["10", "11", "12"],
            };
            return (
              <FormItem>
                <FormLabel>Kelas</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {kelasMap[watchJenjang].map(k => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            );
          }} />

          {/* Semester */}
          <FormField control={form.control} name="semester" render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} />

          {/* Nilai */}
          {["bahasaIndonesia", "matematika", "ipa"].map((key) => (
            <FormField key={key} control={form.control} name={key as keyof FormSchemaType} render={({ field }) => (
              <FormItem>
                <FormLabel>{key === "bahasaIndonesia" ? "Bahasa Indonesia" : key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
              </FormItem>
            )} />
          ))}
          {!isSD && (
            <FormField control={form.control} name="bahasaInggris" render={({ field }) => (
              <FormItem>
                <FormLabel>Bahasa Inggris</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
              </FormItem>
            )} />
          )}

          {/* Total & Average */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>Total</FormLabel>
              <Input readOnly value={total} />
            </div>
            <div className="space-y-2">
              <FormLabel>Rata-rata</FormLabel>
              <Input readOnly value={average} />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {editData ? "Simpan Perubahan" : "Tambah Data"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
