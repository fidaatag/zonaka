// File: components/table-score.tsx
import type { Semester } from "@/types/academic";

interface TableScoreProps {
  semester: Semester;
}

export default function TableScore({ semester }: TableScoreProps) {
  const total = semester.nilai.reduce((acc, n) => acc + n.skor, 0);
  const avg = semester.nilai.length ? (total / semester.nilai.length).toFixed(2) : "0.00";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {semester.nilai.map((item, idx) => (
          <div key={idx} className="flex justify-between border p-2 rounded">
            <p className="font-medium">{item.mapel}</p>
            <p>{item.skor}</p>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t text-sm text-muted-foreground">
        <p>Total Nilai: {total}</p>
        <p>Rata-rata: {avg}</p>
      </div>
    </div>
  );
}