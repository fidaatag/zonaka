"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectDemo } from "./select-school"
import { DialogTambahNilai } from "./dialog-tambah-nilai"

interface TabItem {
  value: string
  label: string
  title: string
  description: string
  fields: {
    id: string
    label: string
    type?: string
    defaultValue?: string
  }[]
  buttonText: string
}

interface DynamicTabsProps {
  data: TabItem[]
}

export function DynamicTabs({ data }: DynamicTabsProps) {

  console.log("DynamicTabs data", data)

  return (
    <Tabs defaultValue={data[0]?.value} className="w-full">

      <div className="flex justify-between">
        <TabsList className="w-fit">
          {data.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <SelectDemo />
      </div>

      {data.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <Card>
            <CardHeader>
              <CardTitle>{tab.title}</CardTitle>
              <CardDescription>{tab.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">

              <Tabs defaultValue="sms-1">

                <TabsList className="w-fit">
                  <TabsTrigger key="1" value="sms-1">Semester 1</TabsTrigger>
                  <TabsTrigger key="2" value="sms-2">Semester 2</TabsTrigger>
                  <TabsTrigger key="3" value="sms-3">Semester 3</TabsTrigger>
                </TabsList>

                <TabsContent value="sms-1" className="p-2 space-y-4">
                  <section className="grid grid-cols-3">
                    <div className="flex justify-between border p-2">
                      <p className="font-semibold">Bahasa Indonesia :</p>
                      <p>80</p>
                    </div>
                    <div className="flex justify-between border p-2">
                      <p className="font-semibold">Bahasa Indonesia :</p>
                      <p>80</p>
                    </div>
                    <div className="flex justify-between border p-2">
                      <p className="font-semibold">Bahasa Indonesia :</p>
                      <p>80</p>
                    </div>
                  </section>
                  <section>
                    <p>Jumlah Nilai : 240</p>
                    <p>Rata-rata: 80</p>
                  </section>
                </TabsContent>

                <TabsContent value="sms-2">
                  <p>data nilai siswa : matematika, bahasa indonesia, ipa, bahasa inggris, dll</p>
                </TabsContent>

                <TabsContent value="sms-3">
                  <p>data nilai siswa : matematika, bahasa indonesia, ipa, bahasa inggris, dll</p>
                </TabsContent>

              </Tabs>

            </CardContent>
            <CardFooter>
              <DialogTambahNilai />
            </CardFooter>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
