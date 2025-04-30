'use client'

import { useState, useEffect } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

type Nilai = { mapel: string; skor: number }
type Semester = { kelas: number; semester: number; nilai: Nilai[] }
type Sekolah = { nama: string; semester: Semester[] }
type JenjangData = { jenjang: "sd" | "smp" | "sma"; sekolah: Sekolah[] }

const formSchema = z.object({
  jenjang: z.enum(["sd", "smp", "sma"]),
  sekolah: z.string().min(1, "Wajib diisi"),
  kelas: z.string().min(1, "Wajib diisi"),
  semester: z.enum(["1", "2"]),
  bahasaIndonesia: z.coerce.number().min(0).max(100),
  matematika: z.coerce.number().min(0).max(100),
  ipa: z.coerce.number().min(0).max(100),
  bahasaInggris: z.coerce.number().min(0).max(100).optional(),
})
type FormSchemaType = z.infer<typeof formSchema>

export function TabsAcademic() {
  const [academicData, setAcademicData] = useState<JenjangData[]>([])
  const jenjangList = ["sd", "smp", "sma"] as const
  const [selectedJenjang, setJenjang] = useState<"sd" | "smp" | "sma">("sd")
  const [selectedSekolah, setSekolah] = useState("")

  const sekolahList =
    academicData.find((j) => j.jenjang === selectedJenjang)?.sekolah || []
  const currentSekolah = sekolahList.find((s) => s.nama === selectedSekolah)

  const handleAddAcademicData = (data: FormSchemaType & { total: number; average: string }) => {
    setAcademicData((prev) => {
      const jenjangIndex = prev.findIndex(j => j.jenjang === data.jenjang)
      const newSemester: Semester = {
        kelas: parseInt(data.kelas),
        semester: parseInt(data.semester),
        nilai: [
          { mapel: "Bahasa Indonesia", skor: data.bahasaIndonesia },
          { mapel: "Matematika", skor: data.matematika },
          { mapel: "IPA", skor: data.ipa },
          ...(data.jenjang !== "sd" ? [{ mapel: "Bahasa Inggris", skor: data.bahasaInggris ?? 0 }] : [])
        ]
      }

      if (jenjangIndex === -1) {
        return [...prev, {
          jenjang: data.jenjang,
          sekolah: [{ nama: data.sekolah, semester: [newSemester] }]
        }]
      }

      const jenjang = prev[jenjangIndex]!
      const sekolahIndex = jenjang.sekolah.findIndex(s => s.nama === data.sekolah)!

      if (sekolahIndex === -1) {
        jenjang.sekolah.push({ nama: data.sekolah, semester: [newSemester] })
      } else {
        if (jenjang.sekolah[sekolahIndex]) {
          jenjang.sekolah[sekolahIndex].semester.push(newSemester)
        }
      }

      const updated = [...prev]
      updated[jenjangIndex] = jenjang
      return updated
    })

    setJenjang(data.jenjang)
    setSekolah(data.sekolah)
  }

  return (
    <Tabs value={selectedJenjang} onValueChange={(val) => setJenjang(val as any)} className="w-full">
      <div className="flex justify-between mb-4">
        <TabsList className="w-fit">
          {jenjangList.map((jenjang) => (
            <TabsTrigger key={jenjang} value={jenjang}>{jenjang.toUpperCase()}</TabsTrigger>
          ))}
        </TabsList>
        <SelectSchool
          schools={sekolahList.map(s => s.nama)}
          selected={selectedSekolah}
          onChange={setSekolah}
        />
      </div>

      {jenjangList.map((jenjang) => (
        <TabsContent key={jenjang} value={jenjang}>
          <Card className="p-4">
            <h4 className="font-semibold text-lg mb-2">{selectedSekolah || "Pilih sekolah"}</h4>
            {currentSekolah ? (
              <TabsSemester semesters={currentSekolah.semester} />
            ) : (
              <p>Belum ada data.</p>
            )}
          </Card>
        </TabsContent>
      ))}

      <DialogTambahNilai onSubmit={handleAddAcademicData} />
    </Tabs>
  )
}

function DialogTambahNilai({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (data: any) => {
    onSubmit(data)
    setOpen(false) // Close dialog after submit
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="self-start">Tambah Nilai</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Tambah Nilai</DialogTitle>
          <DialogDescription>Masukkan data nilai dan info sekolah</DialogDescription>
        </DialogHeader>
        <FormTambahNilai onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}


function FormTambahNilai({ onSubmit }: { onSubmit: (data: FormSchemaType & { total: number, average: string }) => void }) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenjang: "sd",
      sekolah: "",
      kelas: "",
      semester: "1",
      bahasaIndonesia: 0,
      matematika: 0,
      ipa: 0,
      bahasaInggris: 0,
    },
  })

  const watchJenjang = form.watch("jenjang")
  const isSD = watchJenjang === "sd"
  const watchValues = form.watch()

  const nilaiList = [
    Number(watchValues.bahasaIndonesia),
    Number(watchValues.matematika),
    Number(watchValues.ipa),
  ]
  if (!isSD) nilaiList.push(Number(watchValues.bahasaInggris))

  const total = nilaiList.reduce((a, b) => a + b, 0)
  const average = (total / nilaiList.length).toFixed(2)

  useEffect(() => {
    if (isSD) form.setValue("bahasaInggris", 0)
  }, [isSD, form])

  const kelasMap = {
    sd: ["4", "5", "6"],
    smp: ["7", "8", "9"],
    sma: ["10", "11", "12"],
  }

  const handleSubmit = (data: FormSchemaType) => {
    onSubmit({ ...data, total, average })
  }

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField control={form.control} name="jenjang" render={({ field }) => (
            <FormItem>
              <FormLabel>Jenjang</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="sd">SD</SelectItem>
                  <SelectItem value="smp">SMP</SelectItem>
                  <SelectItem value="sma">SMA</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} />
          <FormField control={form.control} name="sekolah" render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Sekolah</FormLabel>
              <FormControl><Input {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="kelas" render={({ field }) => (
            <FormItem>
              <FormLabel>Kelas</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {kelasMap[watchJenjang].map(k => (
                    <SelectItem key={k} value={k}>{k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )} />
          <FormField control={form.control} name="semester" render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} />
          <FormField control={form.control} name="bahasaIndonesia" render={({ field }) => (
            <FormItem>
              <FormLabel>Bahasa Indonesia</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="matematika" render={({ field }) => (
            <FormItem>
              <FormLabel>Matematika</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="ipa" render={({ field }) => (
            <FormItem>
              <FormLabel>IPA</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
            </FormItem>
          )} />
          {!isSD && (
            <FormField control={form.control} name="bahasaInggris" render={({ field }) => (
              <FormItem>
                <FormLabel>Bahasa Inggris</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
              </FormItem>
            )} />
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><FormLabel>Total</FormLabel><Input value={total} readOnly className="bg-gray-100" /></div>
            <div><FormLabel>Rata-rata</FormLabel><Input value={average} readOnly className="bg-gray-100" /></div>
          </div>
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>
    </Card>
  )
}

function TabsSemester({ semesters }: { semesters: Semester[] }) {
  const tabValue = (kelas: number, semester: number) => `kelas-${kelas}-sms-${semester}`
  const defaultTab = tabValue(semesters[0]?.kelas ?? 1, semesters[0]?.semester ?? 1)

  return (
    <Tabs defaultValue={defaultTab} className="mt-4">
      <TabsList className="w-fit mb-2">
        {semesters.map((s) => (
          <TabsTrigger key={tabValue(s.kelas, s.semester)} value={tabValue(s.kelas, s.semester)}>
            Kelas {s.kelas} - Semester {s.semester}
          </TabsTrigger>
        ))}
      </TabsList>
      {semesters.map((s) => (
        <TabsContent key={tabValue(s.kelas, s.semester)} value={tabValue(s.kelas, s.semester)}>
          <TableScore semester={s} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

function TableScore({ semester }: { semester: Semester }) {
  const total = semester.nilai.reduce((sum, n) => sum + n.skor, 0)
  const avg = semester.nilai.length ? (total / semester.nilai.length).toFixed(2) : "0.00"

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {semester.nilai.map((item, idx) => (
          <div key={idx} className="flex justify-between border p-2 rounded">
            <p className="font-medium">{item.mapel}</p>
            <p>{item.skor}</p>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t text-sm text-muted-foreground">
        <p>Total Nilai: {total}</p>
        <p>Rata-rata: {avg}</p>
      </div>
    </div>
  )
}

function SelectSchool({ schools, selected, onChange }: { schools: string[], selected: string, onChange: (val: string) => void }) {
  return (
    <div className="flex gap-2 items-center">
      <Label htmlFor="sekolah">Pilih Sekolah</Label>
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger id="sekolah" className="w-[220px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          {schools.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
