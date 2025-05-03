'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/trpc/react"
import { toast } from "sonner"

const jenjangList = ["SD", "SMP", "SMA"] as const
type Jenjang = (typeof jenjangList)[number]

export default function CardIncaranSekolah() {
  const params = useParams()
  const studentId = params?.id as string
  const [selectedJenjang, setSelectedJenjang] = useState<Jenjang>("SD")
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("")

  const { data: schoolHistory } = api.student.getSchoolHistoryByStudentId.useQuery({
    id: studentId
  })

  const { data: targetData, refetch } = api.student.getTargetSchoolByStudentId.useQuery({
    studentId
  })

  const createTarget = api.student.createTargetSchoolByStudentId.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menambahkan incaran sekolah")
      refetch()
      setSelectedSchoolId("")
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const handleSelect = (schoolId: string) => {
    setSelectedSchoolId(schoolId)
    createTarget.mutate({
      studentId,
      schoolId,
      educationLevel: selectedJenjang
    })
  }

  const filteredSchoolOptions = schoolHistory?.filter((s) => s.educationLevel === selectedJenjang) ?? []
  const filteredTargetData = targetData?.target.find((t) => t.educationLevel === selectedJenjang)?.data ?? []

  return (
    <Card className="p-5 w-full mx-auto mt-10">
      <h3 className="text-lg font-semibold mb-4">Data Incaran Sekolah</h3>

      <Tabs value={selectedJenjang} onValueChange={(val) => setSelectedJenjang(val as Jenjang)}>
        <TabsList>
          {jenjangList.map((jenjang) => (
            <TabsTrigger key={jenjang} value={jenjang}>
              {jenjang}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="my-4 max-w-sm">
          <Select value={selectedSchoolId} onValueChange={handleSelect}>
            <SelectTrigger>
              <SelectValue placeholder={`Pilih sekolah ${selectedJenjang}`} />
            </SelectTrigger>
            <SelectContent>
              {filteredSchoolOptions.map((school) => (
                <SelectItem key={school.schoolId} value={school.schoolId!}>
                  {school.school?.name ?? school.schoolName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {jenjangList.map((jenjang) => (
          <TabsContent key={jenjang} value={jenjang}>
            <div className="space-y-2">
              {jenjang === selectedJenjang && filteredTargetData.length > 0 ? (
                filteredTargetData.map((item, i) => (
                  <p key={item.targetId}>
                    {i + 1}. {item.name} - {item.address}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">Belum ada sekolah incaran</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}
