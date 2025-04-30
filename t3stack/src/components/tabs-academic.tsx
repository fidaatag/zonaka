
'use client'

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import SelectSchool from "./select-school";
import DialogTambahNilai from "./dialog-tambah-nilai";
import TabsSemester from "./tabs-semester";
import type { JenjangData, Jenjang, Semester, FormSchemaType } from "@/types/academic";

export function TabsAcademic() {
  const [academicData, setAcademicData] = useState<JenjangData[]>([]);
  const jenjangList: Jenjang[] = ["sd", "smp", "sma"];
  const [selectedJenjang, setJenjang] = useState<Jenjang>("sd");
  const [selectedSekolah, setSekolah] = useState("");

  const sekolahList = academicData.find(j => j.jenjang === selectedJenjang)?.sekolah || [];
  const currentSekolah = sekolahList.find(s => s.nama === selectedSekolah);

  const handleAddAcademicData = (
    data: FormSchemaType & { total: number; average: string }
  ) => {
    setAcademicData((prev) => {
      const jenjangIndex = prev.findIndex((j) => j.jenjang === data.jenjang);
      const newSemester: Semester = {
        kelas: parseInt(data.kelas),
        semester: parseInt(data.semester),
        nilai: [
          { mapel: "Bahasa Indonesia", skor: data.bahasaIndonesia },
          { mapel: "Matematika", skor: data.matematika },
          { mapel: "IPA", skor: data.ipa },
          ...(data.jenjang !== "sd"
            ? [{ mapel: "Bahasa Inggris", skor: data.bahasaInggris ?? 0 }]
            : []),
        ],
      };

      // Jika jenjang belum ada, tambahkan
      if (jenjangIndex === -1) {
        return [
          ...prev,
          {
            jenjang: data.jenjang,
            sekolah: [{ nama: data.sekolah, semester: [newSemester] }],
          },
        ];
      }

      const jenjang = prev[jenjangIndex]!;
      const sekolahIndex = jenjang.sekolah.findIndex(
        (s) => s.nama === data.sekolah
      );

      // Jika sekolah belum ada, tambahkan
      if (sekolahIndex === -1) {
        jenjang.sekolah.push({ nama: data.sekolah, semester: [newSemester] });
      } else {
        const semesterList = jenjang.sekolah[sekolahIndex]!.semester;
        const existingIndex = semesterList.findIndex(
          (s) =>
            s.kelas === newSemester.kelas &&
            s.semester === newSemester.semester
        );

        if (existingIndex !== -1) {
          // Replace jika sudah ada
          semesterList[existingIndex] = newSemester;
        } else {
          // Push jika belum ada
          semesterList.push(newSemester);
        }
      }

      const updated = [...prev];
      updated[jenjangIndex] = jenjang;
      return updated;
    });

    setJenjang(data.jenjang);
    setSekolah(data.sekolah);
  };


  return (
    <Tabs value={selectedJenjang} onValueChange={(val) => setJenjang(val as Jenjang)} className="w-full">
      <div className="flex justify-between mb-4">
        <TabsList className="w-fit">
          {jenjangList.map(j => <TabsTrigger key={j} value={j}>{j.toUpperCase()}</TabsTrigger>)}
        </TabsList>
        <SelectSchool schools={sekolahList.map(s => s.nama)} selected={selectedSekolah} onChange={setSekolah} />
      </div>

      {jenjangList.map(j => (
        <TabsContent key={j} value={j}>
          <Card className="p-4">
            <h4 className="font-semibold text-lg mb-2">{selectedSekolah || "Pilih sekolah"}</h4>
            {currentSekolah ? <TabsSemester semesters={currentSekolah.semester} /> : <p>Belum ada data.</p>}
          </Card>
        </TabsContent>
      ))}

      <DialogTambahNilai onSubmit={handleAddAcademicData} />
    </Tabs>
  );
}
