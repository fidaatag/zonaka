// File: components/tabs-semester.tsx
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { TableScore } from "./table-score"

import type { Semester } from "./data-dummy"

interface Props {
  semesters: Semester[]
}

export function TabsSemester({ semesters }: Props) {
  const tabValue = (kelas: number, semester: number) => `kelas-${kelas}-sms-${semester}`
  const defaultTab = tabValue(semesters[0]!.kelas, semesters[0]!.semester)

  return (
    <Tabs defaultValue={defaultTab} className="mt-4">
      <TabsList className="w-fit mb-2">
        {semesters.map((sms) => (
          <TabsTrigger
            key={tabValue(sms.kelas, sms.semester)}
            value={tabValue(sms.kelas, sms.semester)}
          >
            Kelas {sms.kelas} - Semester {sms.semester}
          </TabsTrigger>
        ))}
      </TabsList>

      {semesters.map((sms) => (
        <TabsContent
          key={tabValue(sms.kelas, sms.semester)}
          value={tabValue(sms.kelas, sms.semester)}
        >
          <TableScore semester={sms} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
