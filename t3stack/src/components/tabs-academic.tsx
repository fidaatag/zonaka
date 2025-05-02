"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import SelectSchool from "./select-school";
import DialogTambahNilai from "./dialog-tambah-nilai";
import TabsSemester from "./tabs-semester";
import type { Jenjang } from "@/types/academic";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";

export function TabsAcademic() {
  const jenjangList: Jenjang[] = ["SD", "SMP", "SMA"];
  const [selectedJenjang, setJenjang] = useState<Jenjang>("SD");
  const [selectedSekolah, setSekolah] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentSemester, setCurrentSemester] = useState<any | null>(null);
  const [academicData, setAcademicData] = useState<any[]>([]);

  const params = useParams();
  const studentId = params.id as string;

  const { data, isLoading } = api.student.getGradesByStudentId.useQuery({ studentId });

  useEffect(() => {
    if (!data) return;

    const result: any[] = [];

    for (const group of data.grades) {
      const { educationLevel, data: semesterData } = group;

      const sekolahMap: Record<string, { id: string; nama: string; tahunMasuk: number; semester: any[] }> = {};

      for (const entry of semesterData) {
        const { schoolId, schoolName, gradeLevel, semester, year, groupId, subjects } = entry;

        if (!sekolahMap[schoolId]) {
          sekolahMap[schoolId] = {
            id: schoolId,
            nama: schoolName,
            tahunMasuk: year,
            semester: [],
          };
        }

        sekolahMap[schoolId].semester.push({
          id: groupId,
          kelas: gradeLevel,
          semester,
          nilai: subjects.map((s: any) => ({
            id: s.gradeId,
            mapel: s.subject,
            skor: s.score,
          })),
          total: subjects.reduce((a: number, b: any) => a + b.score, 0),
          rataRata: Number((subjects.reduce((a: number, b: any) => a + b.score, 0) / subjects.length).toFixed(2)),
        });
      }

      result.push({
        jenjang: educationLevel,
        sekolah: Object.values(sekolahMap),
      });
    }

    setAcademicData(result);
  }, [data]);

  const sekolahList = academicData.find(j => j.jenjang === selectedJenjang)?.sekolah || [];
  const currentSekolah = sekolahList.find((s: { id: string; }) => s.id === selectedSekolah);

  const findSemesterById = (id: string) => {
    for (const j of academicData) {
      for (const s of j.sekolah) {
        const match = s.semester.find((sm: any) => sm.id === id);
        if (match) return match;
      }
    }
    return null;
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
          {jenjangList.map((j) => (
            <TabsTrigger key={j} value={j}>
              {j.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        <SelectSchool
          jenjangtype={selectedJenjang}
          selected={selectedSekolah}
          onChange={setSekolah}
        />
      </div>

      {jenjangList.map((j) => (
        <TabsContent key={j} value={j}>
          <Card className="p-4">
            <div className="flex justify-between items-center mb-2">
              {currentSekolah ? (
                <h4 className="font-semibold text-lg">{currentSekolah.nama}</h4>
              ) : (
                <h4 className="font-semibold text-lg">Belum ada sekolah</h4>
              )}
              <div className="flex gap-2">
                <Button onClick={handleAddNew}>Tambah Nilai</Button>
                <Button variant="outline" onClick={handleEdit} disabled={!currentSekolah}>
                  Edit Semester Ini
                </Button>
              </div>
            </div>
            {currentSekolah ? (
              <TabsSemester
                semesters={currentSekolah.semester}
                onActiveSemesterChange={setCurrentSemester}
              />
            ) : (
              <p>Belum ada data.</p>
            )}
          </Card>
        </TabsContent>
      ))}

      <DialogTambahNilai
        onSubmit={() => {}}
        editData={editingId ? findSemesterById(editingId) : null}
        open={isDialogOpen}
        setOpen={setDialogOpen}
        sekolahAktif={selectedSekolah}
        jenjangAktif={selectedJenjang}
      />
    </Tabs>
  );
}
