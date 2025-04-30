export type Nilai = {
  mapel: string
  skor: number
}

export type Semester = {
  kelas: number
  semester: number
  nilai: Nilai[]
  total: number
  rataRata: number
}

export type Sekolah = {
  nama: string
  tahunMasuk: number
  semester: Semester[]
}

export type JenjangData = {
  jenjang: "sd" | "smp" | "sma"
  sekolah: Sekolah[]
}


export const dummyAcademicData: JenjangData[] = [
  {
    jenjang: "sd",
    sekolah: [
      {
        nama: "SDN 1 Blitar",
        tahunMasuk: 2018,
        semester: [
          {
            kelas: 4,
            semester: 1,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 80 },
              { mapel: "Matematika", skor: 75 },
              { mapel: "IPA", skor: 78 },
            ],
            total: 233,
            rataRata: 77.67,
          },
          {
            kelas: 4,
            semester: 2,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 82 },
              { mapel: "Matematika", skor: 80 },
              { mapel: "IPA", skor: 79 },
            ],
            total: 241,
            rataRata: 80.33,
          },
          {
            kelas: 5,
            semester: 1,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 84 },
              { mapel: "Matematika", skor: 78 },
              { mapel: "IPA", skor: 81 },
            ],
            total: 243,
            rataRata: 81,
          },
          {
            kelas: 5,
            semester: 2,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 83 },
              { mapel: "Matematika", skor: 82 },
              { mapel: "IPA", skor: 80 },
            ],
            total: 245,
            rataRata: 81.67,
          },
          {
            kelas: 6,
            semester: 1,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 85 },
              { mapel: "Matematika", skor: 84 },
              { mapel: "IPA", skor: 83 },
            ],
            total: 252,
            rataRata: 84,
          },
          {
            kelas: 6,
            semester: 2,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 86 },
              { mapel: "Matematika", skor: 85 },
              { mapel: "IPA", skor: 84 },
            ],
            total: 255,
            rataRata: 85,
          },
        ],
      },
    ],
  },
  {
    jenjang: "smp",
    sekolah: [
      {
        nama: "SMP Negeri 1 Jakarta",
        tahunMasuk: 2021,
        semester: [
          {
            kelas: 7,
            semester: 1,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 78 },
              { mapel: "Matematika", skor: 80 },
              { mapel: "IPA", skor: 76 },
              { mapel: "Bahasa Inggris", skor: 82 },
            ],
            total: 316,
            rataRata: 79,
          },
          {
            kelas: 7,
            semester: 2,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 80 },
              { mapel: "Matematika", skor: 82 },
              { mapel: "IPA", skor: 78 },
              { mapel: "Bahasa Inggris", skor: 84 },
            ],
            total: 324,
            rataRata: 81,
          },
          {
            kelas: 8,
            semester: 1,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 82 },
              { mapel: "Matematika", skor: 83 },
              { mapel: "IPA", skor: 79 },
              { mapel: "Bahasa Inggris", skor: 85 },
            ],
            total: 329,
            rataRata: 82.25,
          },
          {
            kelas: 8,
            semester: 2,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 83 },
              { mapel: "Matematika", skor: 84 },
              { mapel: "IPA", skor: 80 },
              { mapel: "Bahasa Inggris", skor: 86 },
            ],
            total: 333,
            rataRata: 83.25,
          },
          {
            kelas: 9,
            semester: 1,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 85 },
              { mapel: "Matematika", skor: 85 },
              { mapel: "IPA", skor: 82 },
              { mapel: "Bahasa Inggris", skor: 87 },
            ],
            total: 339,
            rataRata: 84.75,
          },
          {
            kelas: 9,
            semester: 2,
            nilai: [
              { mapel: "Bahasa Indonesia", skor: 86 },
              { mapel: "Matematika", skor: 86 },
              { mapel: "IPA", skor: 84 },
              { mapel: "Bahasa Inggris", skor: 88 },
            ],
            total: 344,
            rataRata: 86,
          },
        ],
      },
    ],
  },
]
