'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/trpc/react"

const formSchema = z.object({
  schoolId: z.string(),
  schoolName: z.string(),
  educationLevel: z.enum(["SD", "SMP", "SMA"]),
  entryYear: z.coerce.number(),
  graduationYear: z.coerce.number().optional(),
  isCurrent: z.enum(["true", "false"]),
  notes: z.string().optional(),
})

type FormSchema = z.infer<typeof formSchema>

export function FormTambahSekolahSiswa({ onClose }: { onClose: () => void }) {
  const params = useParams()
  const studentId = params?.id as string

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolId: "",
      schoolName: "",
      educationLevel: "SD",
      entryYear: new Date().getFullYear(),
      graduationYear: undefined,
      isCurrent: "false",
      notes: "",
    },
  })

  const { data: schoolList, isLoading: isSchoolLoading } = api.school.getAllSchool.useQuery()

  const createSchoolStudent = api.student.createSchoolHistoryByStudentId.useMutation({
    onSuccess: async (res) => {
      if (res.success) {
        toast.success(res.message)
        form.reset()
        onClose()
      } else {
        toast.error(res.message)
      }
    },
    onError: (err) => {
      toast.error("Gagal mengirim data: " + err.message)
    }
  })

  const onSubmit = (values: FormSchema) => {
    createSchoolStudent.mutate({
      ...values,
      studentId,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Pilih sekolah dari daftar */}
        <FormField
          control={form.control}
          name="schoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pilih Sekolah</FormLabel>
              <Select
                onValueChange={(value) => {
                  const selectedSchool = schoolList?.find((s) => s.id === value)
                  form.setValue("schoolId", value)
                  form.setValue("schoolName", selectedSchool?.name ?? "")
                  form.setValue("educationLevel", selectedSchool?.educationLevel ?? "SD")
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sekolah" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schoolList?.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name} ({school.educationLevel})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="entryYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun Masuk</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2020" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="graduationYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun Lulus/Keluar</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isCurrent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Lulus / Keluar</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Input placeholder="Keterangan tambahan..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createSchoolStudent.status === "pending"}>
          {createSchoolStudent.status === "pending" ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
    </Form>
  )
}
