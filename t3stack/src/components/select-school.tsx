import * as React from "react"
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

export function SelectSekolah() {
  const [selectedSchool, setSelectedSchool] = React.useState("sma1")

  return (
    <div className="flex gap-2 items-center">
      <Label>Pilih Sekolah</Label>
      <Select value={selectedSchool} onValueChange={setSelectedSchool}>
        <SelectTrigger className="w-[220px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sekolah</SelectLabel>
            <SelectItem value="sma1">SMA Negeri 1 Jakarta</SelectItem>
            <SelectItem value="sma2">SMA Negeri 2 Bandung</SelectItem>
            <SelectItem value="sma3">SMA Negeri 3 Surabaya</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}