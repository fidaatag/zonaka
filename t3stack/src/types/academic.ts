export type Nilai = { mapel: string; skor: number };
export type Semester = { kelas: number; semester: number; nilai: Nilai[] };
export type Sekolah = { nama: string; semester: Semester[] };
export type Jenjang = "sd" | "smp" | "sma";
export interface JenjangData { jenjang: Jenjang; sekolah: Sekolah[]; }
export type FormSchemaType = {
  jenjang: Jenjang;
  sekolah: string;
  kelas: string;
  semester: "1" | "2";
  bahasaIndonesia: number;
  matematika: number;
  ipa: number;
  bahasaInggris?: number;
};
