import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface SelectSchoolProps {
  schools: string[];
  selected: string;
  onChange: (val: string) => void;
}

export default function SelectSchool({ schools, selected, onChange }: SelectSchoolProps) {
  return (
    <div className="flex gap-2 items-center">
      <Label htmlFor="sekolah">Pilih Sekolah</Label>
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger id="sekolah" className="w-[220px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {schools.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
