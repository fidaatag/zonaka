'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, intervalToDuration, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { Card } from "./ui/card"

const formSchema = z.object({
  childName: z.string().min(1, "Wajib diisi"),
  birthDate: z.date({ required_error: "Wajib diisi" }),
  gender: z.enum(["male", "female"], { required_error: "Wajib dipilih" }),
})

export default function FormDataSiswa() {
  const [isEditing, setIsEditing] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const [ageDescription, setAgeDescription] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childName: "",
      birthDate: undefined,
      gender: undefined,
    },
  })

  const watchBirthDate = form.watch("birthDate")

  useEffect(() => {
    if (watchBirthDate && isValid(watchBirthDate)) {
      const duration = intervalToDuration({
        start: new Date(watchBirthDate),
        end: new Date(),
      })

      const { years, months, days } = duration
      setAgeDescription(`${years} tahun ${months} bulan ${days} hari`)
    } else {
      setAgeDescription("")
    }
  }, [watchBirthDate])

  const handleEdit = () => {
    setIsEditing(true)
    setTimeout(() => firstInputRef.current?.focus(), 0)
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsEditing(false)
    console.log("Data Anak:", { ...data, usia: ageDescription })
  }

  return (
    <Card className="p-5 w-full mx-auto">
      <h2 className="text-lg font-semibold">Data Anak</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="childName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap Anak</FormLabel>
                <FormControl>
                  <Input
                    {...field}
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleEdit}
              disabled={isEditing}
            >
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
