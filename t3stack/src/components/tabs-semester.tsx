// File: components/tabs-semester.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TableScore from "./table-score";
import { type Semester } from "@/types/academic";

interface TabsSemesterProps {
  semesters: Semester[];
}

export default function TabsSemester({ semesters }: TabsSemesterProps) {
  const tabValue = (k: number, s: number) => `kelas-${k}-sms-${s}`;
  const defaultTab = tabValue(semesters[0]?.kelas ?? 1, semesters[0]?.semester ?? 1);

  return (
    <Tabs defaultValue={defaultTab} className="mt-4">
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
