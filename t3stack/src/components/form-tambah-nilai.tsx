// File: src/components/FormTambahNilai.tsx
'use client'

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Jenjang } from "@/types/academic";

export const formSchema = z.object({
  jenjang: z.enum(["sd", "smp", "sma"]),
  sekolah: z.string().min(1),
  kelas: z.string().min(1),
  semester: z.enum(["1", "2"]),
  bahasaIndonesia: z.coerce.number().min(0).max(100),
  matematika: z.coerce.number().min(0).max(100),
  ipa: z.coerce.number().min(0).max(100),
  bahasaInggris: z.coerce.number().min(0).max(100).optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface FormTambahNilaiProps {
  onSubmit: (data: FormSchemaType & { total: number; average: string }) => void;
}

export default function FormTambahNilai({ onSubmit }: FormTambahNilaiProps) {
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
  });

  const watchJenjang = form.watch("jenjang");
  const isSD = watchJenjang === "sd";
  const watchValues = form.watch();

  const nilaiList = [
    Number(watchValues.bahasaIndonesia),
    Number(watchValues.matematika),
    Number(watchValues.ipa),
  ];
  if (!isSD) nilaiList.push(Number(watchValues.bahasaInggris));

  const total = nilaiList.reduce((a, b) => a + b, 0);
  const average = (total / nilaiList.length).toFixed(2);

  useEffect(() => {
    if (isSD) form.setValue("bahasaInggris", 0);
  }, [isSD, form]);

  const kelasMap = {
    sd: ["4", "5", "6"],
    smp: ["7", "8", "9"],
    sma: ["10", "11", "12"],
  };

  const handleSubmitForm = (data: FormSchemaType) => {
    onSubmit({ ...data, total, average });
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
          {/* Jenjang */}
          <FormField control={form.control} name="jenjang" render={({ field }) => (
            <FormItem>
              <FormLabel>Jenjang</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
            <Input readOnly value={total} />
            <Input readOnly value={average} />
          </div>
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>
    </Card>
  );
}