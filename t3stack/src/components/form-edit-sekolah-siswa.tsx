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
import { toast } from "sonner"
import { api } from "@/trpc/react"
import { useParams } from "next/navigation"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/api/root"

const formSchema = z.object({
  id: z.string(),
  schoolId: z.string(),
  schoolName: z.string(),
  educationLevel: z.enum(["SD", "SMP", "SMA"]),
  entryYear: z.coerce.number(),
  graduationYear: z.coerce.number().optional(),
  isCurrent: z.enum(["true", "false"]),
  notes: z.string().optional(),
})

type FormSchema = z.infer<typeof formSchema>
type SchoolHistory = inferRouterOutputs<AppRouter>["student"]["getSchoolHistoryByStudentId"][number]

export function FormEditSekolahSiswa({
  defaultData,
  onClose,
}: {
  defaultData: SchoolHistory
  onClose: () => void
}) {
  const params = useParams()
  const studentId = params?.id as string

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: defaultData.id,
      schoolId: defaultData.schoolId ?? undefined,
      schoolName: defaultData.school?.name || defaultData.schoolName || "",
      educationLevel: defaultData.educationLevel,
      entryYear: defaultData.entryYear,
      graduationYear: defaultData.graduationYear ?? undefined,
      isCurrent: defaultData.isCurrent ? "true" : "false",
      notes: defaultData.notes || "",
    },
  })

  const { data: schoolList } = api.school.getAllSchool.useQuery()

  const mutation = api.student.updateSchoolHistoryByStudentId.useMutation({
    onSuccess: async (res) => {
      if (res.success) {
        toast.success(res.message)
        onClose()
      } else {
        toast.error(res.message)
      }
    },
    onError: (err) => {
      toast.error("Gagal update: " + err.message)
    },
  })

  const onSubmit = (values: FormSchema) => {
    mutation.mutate({
      ...values,
      studentId,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="schoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pilih Sekolah</FormLabel>
              <Select
                onValueChange={(value) => {
                  const selected = schoolList?.find((s) => s.id === value)
                  form.setValue("schoolId", value)
                  form.setValue("schoolName", selected?.name || "")
                  form.setValue("educationLevel", selected?.educationLevel || "SD")
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
                <Input type="number" {...field} />
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
                <Input type="number" {...field} />
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
              <Select onValueChange={field.onChange} value={field.value}>
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
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.status === "pending"}>
          {mutation.status === "pending" ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        
      </form>
    </Form>
  )
}
