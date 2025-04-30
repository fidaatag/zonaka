"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { api } from "@/trpc/react"
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const formSchema = z.object({
  parentName: z.string(),
  parentRelation: z.string(),
  parentPhone: z.string().optional(),
  fullAddress: z.string(),
  postalCode: z.string(),
  childName: z.string().min(1, "Wajib diisi"),
  birthDate: z.date({ required_error: "Wajib diisi" }),
  gender: z.enum(["MALE", "FEMALE"], { required_error: "Wajib dipilih" }),
})

export interface FormTambahAnakProps {
  onClose?: () => void
}

export function FormTambahAnak({ onClose }: FormTambahAnakProps) {
  const [isParentExists, setIsParentExists] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: "",
      parentRelation: "",
      parentPhone: "",
      fullAddress: "",
      postalCode: "",
      childName: "",
      birthDate: new Date(),
      gender: undefined,
    },
  })

  const parentQuery = api.parent.getCurrentParent.useQuery()

  useEffect(() => {
    if (parentQuery.isSuccess && parentQuery.data.exists && parentQuery.data.parent) {
      const res = parentQuery.data
      setIsParentExists(true)
      form.setValue("parentName", res.parent.name)
      form.setValue("parentRelation", res.parent.relation)
      form.setValue("parentPhone", res.parent.phone || "")
      form.setValue("fullAddress", res.parent.address.full)
      form.setValue("postalCode", res.parent.address.postalCode)
    }
  }, [parentQuery.isSuccess, parentQuery.data, form])

  const createStudent = api.student.createStudent.useMutation({
    onSuccess: () => {
      toast.success("Siswa berhasil ditambahkan")
      form.reset()
      onClose?.()
    },
    onError: (err) => {
      toast.error("Gagal menambahkan siswa: " + err.message)
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createStudent.mutate({
      fullName: data.childName,
      birthDate: data.birthDate,
      gender: data.gender,
      parentName: data.parentName,
      parentRelation: data.parentRelation,
      parentPhone: data.parentPhone,
      fullAddress: data.fullAddress,
      postalCode: data.postalCode,
      latitude: -6.2, // dummy (nanti ganti pakai geocoding)
      longitude: 106.8,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ORANG TUA */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Data Orang Tua</h3>

          <FormField
            control={form.control}
            name="parentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Wali</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isParentExists} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentRelation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hubungan</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isParentExists} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. HP Wali</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isParentExists} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Lengkap</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isParentExists} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Pos</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isParentExists} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* ANAK */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Data Anak</h3>

          <FormField
            control={form.control}
            name="childName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Anak</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "dd MMMM yyyy") : <span>Pilih tanggal</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <SelectItem value="MALE">Laki-laki</SelectItem>
                    <SelectItem value="FEMALE">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-2 text-right">
          <Button type="submit" disabled={createStudent.status === "pending"}>
            {createStudent.status === "pending" ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
