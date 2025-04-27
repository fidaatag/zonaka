'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "./ui/card"

const formSchema = z.object({
  ayah: z.string().min(1, { message: "Nama Ayah wajib diisi" }),
  ibu: z.string().min(1, { message: "Nama Ibu wajib diisi" }),
  alamat: z.string().min(1, { message: "Alamat wajib diisi" }),
  kodePos: z.string().min(4, { message: "Kode Pos minimal 4 angka" }),
})

export default function FormDataOrangTua() {
  const [isEditing, setIsEditing] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ayah: "",
      ibu: "",
      alamat: "",
      kodePos: "",
    },
  })

  const handleEdit = () => {
    setIsEditing(true)
    setTimeout(() => firstInputRef.current?.focus(), 0)
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsEditing(false)
    console.log("Data disimpan:", data)
    // TODO: simpan ke backend atau state global
  }

  return (
    <Card className="p-5 w-full mx-auto">
      <h2 className="text-lg font-semibold">Data Orang Tua</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="ayah"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Ayah</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={!isEditing} ref={firstInputRef} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ibu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Ibu</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Lengkap</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kodePos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Pos</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={!isEditing} />
                </FormControl>
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
