import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { createActor } from "@/lib/icp/actor";


async function main() {
  const actor = await createActor("school");
  const schools: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream('prisma/seed/school_data.csv')
      .pipe(csv())
      .on("data", (row) => {
        if (!row.schoolId || !row.schoolName) return; // skip row invalid

        schools.push({
          id: row.schoolId,
          name: row.schoolName,
          address: row.addressFull,
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude),
          postalCode: row.postalCode,
          educationLevel: row.educationLevel,
          academicYear: row.academicYear,

          capacityZonasi: Number(row.capacityZonasi),
          avgApplicantsZonasi: Number(row.avgApplicantsZonasi),

          capacityPrestasi: Number(row.capacityPrestasi),
          avgApplicantsPrestasi: Number(row.avgApplicantsPrestasi),
          minAvgScorePrestasi: parseFloat(row.minAvgScorePrestasi),

          capacityAfirmasi: Number(row.capacityAfirmasi),
          avgApplicantsAfirmasi: Number(row.avgApplicantsAfirmasi),

          capacityPerpindahanOrtu: Number(row.capacityPerpindahanOrtu),
          avgApplicantsPerpindahan: Number(row.avgApplicantsPerpindahan),

          zoningRadiusKm: parseFloat(row.zoningRadiusKm),

          createdAt: BigInt(Date.now()) // milliseconds as Time.Time
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`⏳ Mengirim ${schools.length} sekolah ke canister...`);

  try {
    await actor!.bulkAddSchools!(schools);
    console.log("✅ Data sekolah berhasil dikirim ke canister.");
  } catch (error) {
    console.error("❌ Gagal mengirim data sekolah ke canister:", error);
  }

  console.log("✅ Selesai seeding ke chain!");
}

main().catch((err) => {
  console.error("❌ Gagal:", err);
  process.exit(1);
});
