export interface Score {
  id: string;
  mapel: string;
  skor: number;
}

export interface Semester {
  id: string;
  kelas: number;
  semester: 1 | 2;
  nilai: Score[];
  total: number;
  rataRata: number;
}

export interface School {
  id: string;
  nama: string;
  tahunMasuk: number;
  semester: Semester[];
}

export type Jenjang = "sd" | "smp" | "sma";

export interface JenjangData {
  id: string;
  jenjang: Jenjang;
  sekolah: School[];
}

export type FormSchemaType = {
  id?: string; // <- ID untuk edit
  jenjang: Jenjang;
  sekolah: string;
  kelas: string;
  semester: "1" | "2";
  bahasaIndonesia: number;
  matematika: number;
  ipa: number;
  bahasaInggris?: number;
};
