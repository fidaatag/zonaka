"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "./ui/card"
import { api } from "@/trpc/react"

const formSchema = z.object({
  parentName: z.string({ required_error: "Nama Wali wajib diisi" }),
  parentRelation: z.string({ required_error: "Hubungan wajib diisi" }),
  parentPhone: z.string().optional(),
  fullAddress: z.string({ required_error: "Alamat wajib diisi" }),
  postalCode: z.string({ required_error: "Kode Pos wajib diisi" }),
})

export default function FormDataOrangTua() {
  const [isEditing, setIsEditing] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: "",
      parentRelation: "",
      parentPhone: "",
      fullAddress: "",
      postalCode: "",
    },
  })

  const { data: parentData } = api.parent.getCurrentParent.useQuery()
  const updateParent = api.parent.updateCurrentParent.useMutation()

  useEffect(() => {
    if (parentData) {
      form.reset({
        parentName: parentData.parent?.name ?? "",
        parentRelation: parentData.parent?.relation ?? "",
        parentPhone: parentData.parent?.phone ?? "",
        fullAddress: parentData.parent?.address.full ?? "",
        postalCode: parentData.parent?.address.postalCode ?? "",
      })
    }
  }, [parentData])

  const handleEdit = () => {
    setIsEditing(true)
    setTimeout(() => firstInputRef.current?.focus(), 0)
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updateParent.mutateAsync(data)
      setIsEditing(false)
    } catch (err) {
      console.error("Gagal update data:", err)
    }
  }

  return (
    <Card className="p-5 w-full mx-auto">
      <h2 className="text-lg font-semibold">Data Orang Tua</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="parentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Wali</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={!isEditing} ref={firstInputRef} />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} readOnly={!isEditing} />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} readOnly={!isEditing} />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} readOnly={!isEditing} />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} readOnly={!isEditing} />
                </FormControl>
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
