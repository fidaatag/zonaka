import { Card } from "./ui/card"
import { TabsAcademic } from "./tabs-academic"
import { dummyAcademicData } from "./data-dummy"

export default function CardAcademic() {
  return (
    <>
      <Card className="p-5 w-full mx-auto mt-40">
        <h3 className="text-lg font-semibold">Data Akademik</h3>

        <TabsAcademic />
      </Card>
    </>
  )
}
