// File: components/tabs-academic.tsx
"use client"

import { useState } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { SelectSchool } from "./select-school"
import { TabsSemester } from "./tabs-semester"
import type { JenjangData } from "./data-dummy"

interface Props {
  data: JenjangData[]
}

export function TabsAcademic({ data }: Props) {
  const jenjangList = data.map((item) => item.jenjang)
  const [selectedJenjang, setJenjang] = useState<"sd" | "smp" | "sma">(jenjangList[0] ?? "sd")

  const sekolahList =
    data.find((j) => j.jenjang === selectedJenjang)?.sekolah || []
  const [selectedSekolah, setSekolah] = useState(sekolahList[0]?.nama || "")

  const currentSekolah = sekolahList.find((s) => s.nama === selectedSekolah)

  return (
    <Tabs
      value={selectedJenjang}
      onValueChange={(val) => {
        if (val === "sd" || val === "smp" || val === "sma") {
          setJenjang(val)
        }
      }}
      className="w-full">
      <div className="flex justify-between mb-4">
        <TabsList className="w-fit">
          {jenjangList.map((jenjang) => (
            <TabsTrigger key={jenjang} value={jenjang}>
              {jenjang.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        <SelectSchool
          schools={sekolahList.map((s) => s.nama)}
          selected={selectedSekolah}
          onChange={setSekolah}
        />
      </div>

      {jenjangList.map((jenjang) => (
        <TabsContent key={jenjang} value={jenjang}>
          <Card className="p-4">
            <h4 className="font-semibold text-lg mb-2">
              {selectedSekolah}
            </h4>
            {currentSekolah ? (
              <TabsSemester semesters={currentSekolah.semester} />
            ) : (
              <p>Sekolah belum dipilih.</p>
            )}
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
