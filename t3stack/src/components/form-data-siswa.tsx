'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "./ui/card"
import { format, intervalToDuration, isValid, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { api } from "@/trpc/react"

const formSchema = z.object({
  name: z.string().min(1, "Wajib diisi"),
  birthDate: z.date({ required_error: "Wajib diisi" }),
  gender: z.enum(["MALE", "FEMALE"], { required_error: "Wajib dipilih" }),
})

export default function FormDataSiswa() {
  const [isEditing, setIsEditing] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const [ageDescription, setAgeDescription] = useState("")
  const params = useParams()
  const studentId = params?.id as string

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: undefined,
      gender: undefined,
    },
  })

  const { data: studentData } = api.student.getStudentCardById.useQuery({ id: studentId })
  const updateStudent = api.student.updateStudentCardById.useMutation()

  useEffect(() => {
    if (studentData) {
      form.reset({
        name: studentData.name ?? "",
        birthDate: new Date(studentData.birthDate),
        gender: studentData.gender ?? undefined,
      })
    }
  }, [studentData])

  const watchBirthDate = form.watch("birthDate")

  useEffect(() => {
    if (watchBirthDate && isValid(watchBirthDate)) {
      const duration = intervalToDuration({
        start: watchBirthDate,
        end: new Date(),
      })
      const { years = 0, months = 0, days = 0 } = duration
      setAgeDescription(`${years} tahun ${months} bulan ${days} hari`)
    } else {
      setAgeDescription("")
    }
  }, [watchBirthDate])

  const handleEdit = () => {
    setIsEditing(true)
    setTimeout(() => firstInputRef.current?.focus(), 0)
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updateStudent.mutateAsync({ id: studentId, ...data })
      setIsEditing(false)
    } catch (err) {
      console.error("Gagal update data siswa:", err)
    }
  }

  return (
    <Card className="p-5 w-full mx-auto">
      <h2 className="text-lg font-semibold">Data Anak</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap Anak</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly={!isEditing}
                    ref={(el) => {
                      field.ref(el)
                      firstInputRef.current = el
                    }}
                    placeholder="Misalnya: Ali bin Budi"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Lahir</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        disabled={!isEditing}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "dd MMMM yyyy")
                          : <span>Pilih tanggal</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Usia</FormLabel>
            <Input
              value={ageDescription}
              readOnly
              disabled
              className="cursor-default select-none text-muted-foreground"
            />
          </div>

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  disabled={!isEditing}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Laki-laki</SelectItem>
                    <SelectItem value="FEMALE">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleEdit} disabled={isEditing}>
              Edit
            </Button>
            <Button type="submit" disabled={!isEditing}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
