// File: components/select-school.tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Props {
  schools: string[]
  selected: string
  onChange: (val: string) => void
}

export function SelectSchool({ schools, selected, onChange }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <Label htmlFor="sekolah">Pilih Sekolah</Label>
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger id="sekolah" className="w-[220px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Daftar Sekolah</SelectLabel>
            {schools.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
