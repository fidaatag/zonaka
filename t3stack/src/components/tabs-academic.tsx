// File: components/TabsAcademic.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import SelectSchool from "./select-school";
import DialogTambahNilai from "./dialog-tambah-nilai";
import TabsSemester from "./tabs-semester";
import type { JenjangData, Jenjang, Semester, FormSchemaType } from "@/types/academic";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

export function TabsAcademic() {
  const [academicData, setAcademicData] = useState<JenjangData[]>([]);
  const jenjangList: Jenjang[] = ["sd", "smp", "sma"];
  const [selectedJenjang, setJenjang] = useState<Jenjang>("sd");
  const [selectedSekolah, setSekolah] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);

  const sekolahList = academicData.find(j => j.jenjang === selectedJenjang)?.sekolah || [];
  const currentSekolah = sekolahList.find(s => s.nama === selectedSekolah);

  const findSemesterById = (id: string): Semester | null => {
    for (const j of academicData) {
      for (const s of j.sekolah) {
        const match = s.semester.find((sm) => sm.id === id);
        if (match) return match;
      }
    }
    return null;
  };

  const handleAddAcademicData = (
    data: FormSchemaType & { total: number; average: number }
  ) => {
    const newSemester: Semester = {
      id: data.id ?? uuidv4(),
      kelas: parseInt(data.kelas),
      semester: parseInt(data.semester) as 1 | 2,
      nilai: [
        { id: uuidv4(), mapel: "Bahasa Indonesia", skor: data.bahasaIndonesia },
        { id: uuidv4(), mapel: "Matematika", skor: data.matematika },
        { id: uuidv4(), mapel: "IPA", skor: data.ipa },
        ...(data.jenjang !== "sd"
          ? [{ id: uuidv4(), mapel: "Bahasa Inggris", skor: data.bahasaInggris ?? 0 }]
          : []),
      ],
      total: data.total,
      rataRata: data.average,
    };

    setAcademicData((prev) => {
      const jenjangIndex = prev.findIndex((j) => j.jenjang === data.jenjang);
      let newJenjangData = [...prev];

      if (jenjangIndex === -1) {
        return [
          ...prev,
          {
            id: uuidv4(),
            jenjang: data.jenjang,
            sekolah: [
              {
                id: uuidv4(),
                nama: data.sekolah,
                tahunMasuk: new Date().getFullYear(),
                semester: [newSemester],
              },
            ],
          },
        ];
      }

      const jenjang = newJenjangData[jenjangIndex]!;
      const sekolahIndex = jenjang.sekolah.findIndex((s) => s.nama === data.sekolah);

      if (sekolahIndex === -1) {
        jenjang.sekolah.push({
          id: uuidv4(),
          nama: data.sekolah,
          tahunMasuk: new Date().getFullYear(),
          semester: [newSemester],
        });
      } else {
        const semesterList = jenjang.sekolah[sekolahIndex]!.semester;
        const existingIndex = semesterList.findIndex((s) => s.id === newSemester.id);

        if (existingIndex !== -1) {
          semesterList[existingIndex] = newSemester;
        } else {
          semesterList.push(newSemester);
        }
      }

      newJenjangData[jenjangIndex] = jenjang;
      return [...newJenjangData];
    });

    setJenjang(data.jenjang);
    setSekolah(data.sekolah);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEdit = () => {
    if (currentSemester) {
      setEditingId(currentSemester.id);
      setDialogOpen(true);
    }
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
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-lg">{selectedSekolah || "Pilih sekolah"}</h4>
              <div className="flex gap-2">
                <Button onClick={handleAddNew}>Tambah Nilai</Button>
                <Button variant="outline" onClick={handleEdit}>Edit Semester Ini</Button>
              </div>
            </div>
            {currentSekolah ? (
              <TabsSemester semesters={currentSekolah.semester} onActiveSemesterChange={setCurrentSemester} />
            ) : (
              <p>Belum ada data.</p>
            )}
          </Card>
        </TabsContent>
      ))}

      <DialogTambahNilai
        onSubmit={handleAddAcademicData}
        editData={editingId ? findSemesterById(editingId) : null}
        open={isDialogOpen}
        setOpen={setDialogOpen}
        sekolahAktif={selectedSekolah}
        jenjangAktif={selectedJenjang}
      />
    </Tabs>
  );
}