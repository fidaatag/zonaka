import fs from 'fs'
import csv from 'csv-parser'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const schools: any[] = []

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream('prisma/seed/school_data.csv')
      .pipe(csv())
      .on('data', (row) => {
        schools.push(row)
      })
      .on('end', resolve)
      .on('error', reject)
  })

  for (const row of schools) {
    await prisma.user.create({
      data: {
        id: row.userId,
        name: row.userName,
        email: row.userEmail,
        role: "SCHOOL",
      },
    })

    await prisma.address.create({
      data: {
        id: row.addressId,
        full: row.addressFull,
        postalCode: row.postalCode,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
      },
    })

    await prisma.school.create({
      data: {
        id: row.schoolId,
        name: row.schoolName,
        educationLevel: row.educationLevel, // enum validation di Prisma
        userId: row.userId,
        addressId: row.addressId,
      },
    })

    await prisma.schoolPPDBInfo.create({
      data: {
        id: row.ppdbInfoId,
        schoolId: row.schoolId,
        educationLevel: row.educationLevel,
        academicYear: row.academicYear,
        capacityZonasi: Number(row.capacityZonasi),
        avgApplicantsZonasi: Number(row.avgApplicantsZonasi),
        capacityPrestasi: Number(row.capacityPrestasi),
        avgApplicantsPrestasi: Number(row.avgApplicantsPrestasi),
        capacityAfirmasi: Number(row.capacityAfirmasi),
        avgApplicantsAfirmasi: Number(row.avgApplicantsAfirmasi),
        capacityPerpindahanOrtu: Number(row.capacityPerpindahanOrtu),
        avgApplicantsPerpindahan: Number(row.avgApplicantsPerpindahan),
        zoningRadiusKm: Number(row.zoningRadiusKm),
        minAvgScorePrestasi: Number(row.minAvgScorePrestasi),
      },
    })
  }

  console.log("✅ Seeder selesai!")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())
