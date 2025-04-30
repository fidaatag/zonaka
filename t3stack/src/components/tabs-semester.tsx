// File: components/TabsSemester.tsx
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TableScore from "./table-score";
import type { Semester } from "@/types/academic";

interface TabsSemesterProps {
  semesters: Semester[];
  onActiveSemesterChange?: (semester: Semester) => void; // new (optional)
}

export default function TabsSemester({ semesters, onActiveSemesterChange }: TabsSemesterProps) {
  const tabValue = (k: number, s: number) => `kelas-${k}-sms-${s}`;

  const defaultSemester = semesters[0];
  const [activeTab, setActiveTab] = useState(
    defaultSemester ? tabValue(defaultSemester.kelas, defaultSemester.semester) : ""
  );

  useEffect(() => {
    const found = semesters.find(s => tabValue(s.kelas, s.semester) === activeTab);
    if (found && onActiveSemesterChange) {
      onActiveSemesterChange(found);
    }
  }, [activeTab, semesters, onActiveSemesterChange]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
      <TabsList className="w-fit mb-2">
        {semesters.map((sem) => (
          <TabsTrigger key={tabValue(sem.kelas, sem.semester)} value={tabValue(sem.kelas, sem.semester)}>
            Kelas {sem.kelas} - Semester {sem.semester}
          </TabsTrigger>
        ))}
      </TabsList>

      {semesters.map((sem) => (
        <TabsContent key={tabValue(sem.kelas, sem.semester)} value={tabValue(sem.kelas, sem.semester)}>
          <TableScore semester={sem} />
        </TabsContent>
      ))}
    </Tabs>
  );
}