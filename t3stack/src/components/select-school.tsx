"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface SelectSchoolProps {
  jenjangtype: string; // "sd" | "smp" | "sma"
  selected: string;
  onChange: (val: string) => void;
}

export default function SelectSchool({
  jenjangtype,
  selected,
  onChange,
}: SelectSchoolProps) {
  const params = useParams();
  const studentId = params?.id as string;

  const { data: histories, isLoading } = api.student.getSchoolHistoryByStudentId.useQuery({
    id: studentId,
  });

  useEffect(() => {
    if (histories && histories.length > 0) {
      const match = histories.find(
        (s) =>
          s.educationLevel.toLowerCase() === jenjangtype.toLowerCase() &&
          s.schoolId &&
          s.schoolId.trim() !== ""
      );
      if (match) {
        onChange(match.schoolId!);
      }
    }
  }, [jenjangtype, histories]);


  const filteredHistories =
    histories?.filter(
      (s) =>
        s.educationLevel.toLowerCase() === jenjangtype.toLowerCase() &&
        s.schoolId &&
        s.schoolId.trim() !== ""
    ) ?? [];

  useEffect(() => {
    if (!selected && filteredHistories.length > 0) {
      onChange(filteredHistories[0]!.schoolId!);
    }
  }, [filteredHistories]);


  return (
    <div className="flex gap-2 items-center">
      <Label htmlFor="sekolah">Pilih Sekolah</Label>
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger id="sekolah" className="w-[220px]">
          <SelectValue placeholder="Pilih sekolah" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="-" disabled>Loading...</SelectItem>
          ) : filteredHistories.length === 0 ? (
            <SelectItem value="-" disabled>Tidak ada sekolah</SelectItem>
          ) : (
            filteredHistories.map((s) => (
              <SelectItem key={s.schoolId} value={s.schoolId!}>
                {s.school?.name ?? s.schoolName ?? "Tanpa nama"}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
