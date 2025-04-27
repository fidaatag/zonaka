'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DialogQueuChainSiswa } from "./dialog-queue-chain-siswa"
import { CardDialogRiwayatChain } from "./dialog-card-riwayat-chain"

type HistoryItem = {
  version: string
  date: string
  desc: string
}

const dummyHistory: HistoryItem[] = [
  { version: "v1", date: "01 Jan 2024", desc: "Data dasar + SD Semester 1" },
  { version: "v2", date: "10 Juli 2024", desc: "+ SD Semester 2" },
  { version: "v3", date: "12 April 2025", desc: "+ SMP Semester 1" },
  { version: "v2", date: "10 Juli 2024", desc: "+ SD Semester 2" },
  { version: "v3", date: "12 April 2025", desc: "+ SMP Semester 1" },
  { version: "v2", date: "10 Juli 2024", desc: "+ SD Semester 2" },
  { version: "v3", date: "12 April 2025", desc: "+ SMP Semester 1" },
]

export default function ChainSiswaId() {
  return (
    <div className="w-full h-full">
      {/* Tombol untuk Masukkan ke Antrian */}
      <DialogQueuChainSiswa />

      {/* Ringkasan push terakhir */}
      <Card className="p-5 mt-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">Terakhir di-push:</p>
            <p className="text-base font-medium">12 April 2025, 14:21</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">Versi Chain:</p>
            <p className="text-base font-medium">v3</p>
          </div>
        </div>

        <Separator className="" />

        <h3 className="font-semibold">Riwayat Push</h3>

        {/* Riwayat Push */}
        <div className="space-y-4 w-full max-h-80 overflow-y-auto">
          {dummyHistory.map((item) => (
            <CardDialogRiwayatChain 
              key={item.version}
              cardTitle={item.version}
              cardDescription={item.desc}
              version={item.version}
            />
          ))}
        </div>
      </Card>


    </div>
  )
}
