'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

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

export function FormTambahNilai() {
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

  if (!isSD) {
    nilaiList.push(Number(watchValues.bahasaInggris))
  }

  const total = nilaiList.reduce((a, b) => a + b, 0)
  const average = (total / nilaiList.length).toFixed(2)


  useEffect(() => {
    if (isSD) {
      form.setValue("bahasaInggris", 0)
    }
  }, [watchJenjang, form])

  const kelasMap: Record<FormSchemaType["jenjang"], string[]> = {
    sd: ["4", "5", "6"],
    smp: ["7", "8", "9"],
    sma: ["10", "11", "12"],
  }

  const onSubmit = (data: FormSchemaType) => {
    console.log({
      ...data,
      total,
      average,
    })
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Form Tambah Nilai</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Jenjang */}
          <FormField
            control={form.control}
            name="jenjang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenjang</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenjang" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sd">SD</SelectItem>
                    <SelectItem value="smp">SMP</SelectItem>
                    <SelectItem value="sma">SMA</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sekolah */}
          <FormField
            control={form.control}
            name="sekolah"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Sekolah</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: SDN 1 Bandung" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Kelas */}
          <FormField
            control={form.control}
            name="kelas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kelas</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {kelasMap[watchJenjang].map((kelas) => (
                      <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Semester */}
          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Pilih semester" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nilai Pelajaran */}
          <FormField
            control={form.control}
            name="bahasaIndonesia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bahasa Indonesia</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="matematika"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matematika</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ipa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IPA</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isSD && (
            <FormField
              control={form.control}
              name="bahasaInggris"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bahasa Inggris</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Output */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel>Total</FormLabel>
              <Input value={total} readOnly className="bg-gray-100" />
            </div>
            <div>
              <FormLabel>Rata-rata</FormLabel>
              <Input value={average} readOnly className="bg-gray-100" />
            </div>
          </div>

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>
    </Card>
  )
}
