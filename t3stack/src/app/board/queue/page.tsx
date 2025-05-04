'use client'

import CardListQueue from "@/components/card-list-queue"

export default function PageQueue() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4">
      {/* Komponen 2 di atas saat mobile, di kanan saat desktop */}
      <div className="order-1 md:order-2 border border-red-500 rounded-lg p-4">
        2
      </div>

      {/* Komponen 1 di bawah saat mobile, di kiri saat desktop */}
      <div className="order-2 md:order-1 rounded-lg">
        <CardListQueue />
      </div>
    </div>
  )
}