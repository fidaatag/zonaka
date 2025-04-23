import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, QrCode } from "lucide-react"
import { parseISO, format } from "date-fns"
import { differenceInYears } from "date-fns"
import { id as idLocale } from "date-fns/locale"

export interface StudentProps {
  name: string
  birthDate: string
  educationLevel: 'SD' | 'SMP' | 'SMA'
  school: {
    name: string
    address?: string
  }
  status: 'Aktif' | 'Lulus'
  imageUrl: string
}

export interface StudentCardProps {
  student: StudentProps
}

const colorMap = {
  SD: "bg-red-800",
  SMP: "bg-blue-800",
  SMA: "bg-gray-700",
}

export function CardStudent({ student }: StudentCardProps) {
  const birthDate = parseISO(student.birthDate)
  const age = differenceInYears(new Date(), birthDate)

  return (
    <Card className="p-0 flex flex-col h-full w-full max-w-lg overflow-hidden border-2 hover:shadow-md transition-all">

      <CardHeader className={`${colorMap[student.educationLevel]} text-white p-4 flex flex-row items-center justify-between`}>
        <div>
          <h3 className="text-lg font-bold">STUDENT ID CARD</h3>
          <p className="text-sm opacity-90">{student.school.name}</p>
        </div>
        <div className="w-12 h-12 relative">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </CardHeader>


      <CardContent className="flex-1 p-4 flex gap-4">
        <div className="w-20 h-20 relative rounded-md overflow-hidden border">
          <Image
            src={student.imageUrl || "/placeholder.svg?height=128&width=128"}
            alt={student.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center text-sm space-y-1">
          <p className="font-medium text-base">{student.name}</p>
          <p>Tgl Lahir: {format(birthDate, "dd MMMM yyyy", { locale: idLocale })}</p>
          <p>Umur: {age} tahun</p>
          <div className="flex gap-1 mt-1">
            <Badge variant="outline">{student.educationLevel}</Badge>
            <Badge variant={student.status === "Aktif" ? "default" : "secondary"}>
              {student.status}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex justify-between items-center bg-muted">
        <p className="text-xs text-muted-foreground italic">Zonaka ID Card</p>
        <QrCode className="w-5 h-5 text-muted-foreground" />
      </CardFooter>
    </Card>
  )
}
