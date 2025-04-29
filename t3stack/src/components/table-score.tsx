// File: components/table-score.tsx
import type { Semester } from "./data-dummy"

interface Props {
  semester: Semester
}

export function TableScore({ semester }: Props) {
  const total = semester.nilai.reduce((sum, item) => sum + item.skor, 0)
  const rataRata = semester.nilai.length ? total / semester.nilai.length : 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {semester.nilai.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between border p-2 rounded"
          >
            <p className="font-medium">{item.mapel}</p>
            <p>{item.skor}</p>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t text-sm text-muted-foreground">
        <p>Total Nilai: {total}</p>
        <p>Rata-rata: {rataRata.toFixed(2)}</p>
      </div>
    </div>
  )
}