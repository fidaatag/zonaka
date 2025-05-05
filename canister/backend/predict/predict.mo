import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Order "mo:base/Order";

import TStudent "../student/type";
import TSchool "../school/type";

module {
  public class Predict(schools: HashMap.HashMap<Text, TSchool.School>) {

    private let predictions = HashMap.HashMap<Text, TSchool.PredictionRecord>(100, Text.equal, Text.hash);

    public func savePrediction(record: TSchool.PredictionRecord) {
      predictions.put(record.studentId, record);
    };

    public func getPrediction(studentId: Text): ?TSchool.PredictionRecord {
      predictions.get(studentId);
    };

    public func predict(resume: TStudent.Resume): TStudent.PredictResult {
      let studentId = resume.studentId;
      let address = resume.parent.address;
      let targets = resume.targets;

      var resultEntries: [TStudent.PredictResultEntry] = [];
      let targetIds = HashMap.HashMap<Text, ()>(10, Text.equal, Text.hash);

      // Step 1: Kumpulkan ID sekolah target
      for (target in targets.vals()) {
        for (s in target.schools.vals()) {
          targetIds.put(s.schoolId, ());
        };
      };

      // Step 2: Prediksi sekolah target (jalur Zonasi)
      for (id in targetIds.keys()) {
        switch (schools.get(id)) {
          case null {};
          case (?school) {
            let entry = createPredictionEntry(school, address, true);
            resultEntries := Array.append(resultEntries, [entry]);
          };
        };
      };

      // Step 3: Hitung sisa alternatif
      let remaining = if (resultEntries.size() >= 5) { 0 } else { Nat.sub(5, resultEntries.size()) };

      // Step 4: Rekomendasi alternatif: Zonasi → Prestasi
      var count = 0;
      label altLoop for (school in schools.vals()) {
        if (count >= remaining) break altLoop;

        switch (targetIds.get(school.id)) {
          case (?_) continue altLoop;
          case (null) {
            let zonasiEntry = createPredictionEntry(school, address, false);
            let prestasiEligible = isEligiblePrestasi(school, resume.grades);

            if (zonasiEntry.eligible) {
              resultEntries := Array.append(resultEntries, [zonasiEntry]);
              count += 1;
            } else if (prestasiEligible) {
              let prestasiEntry: TStudent.PredictResultEntry = {
                schoolName = school.name;
                schoolId = school.id;
                path = "Prestasi";
                eligible = true;
                chancePercentage = 75.0; // Dummy untuk sekarang
                ratio = "N/A";
                capacity = Float.fromInt(school.capacityPrestasi);
                estimatedApplicants = Float.fromInt(school.avgApplicantsPrestasi);
                radiusKm = 0.0;
                distanceFromHomeKm = 0.0;
                note = "Memenuhi syarat jalur prestasi.";
                isTarget = false;
              };

              resultEntries := Array.append(resultEntries, [prestasiEntry]);
              count += 1;
            };
          };
        };
      };

      // Step 5: Urutkan hasil prediksi
      let sortedEntries = Array.sort(
        resultEntries,
        func(a: TStudent.PredictResultEntry, b: TStudent.PredictResultEntry): Order.Order {
          if (a.isTarget and not b.isTarget) return #less;
          if (not a.isTarget and b.isTarget) return #greater;
          if (a.path == "Zonasi" and b.path != "Zonasi") return #less;
          if (a.path != "Zonasi" and b.path == "Zonasi") return #greater;
          if (a.distanceFromHomeKm < b.distanceFromHomeKm) return #less;
          if (a.distanceFromHomeKm > b.distanceFromHomeKm) return #greater;
          return #equal;
        }
      );

      let finalEntries = Array.take(sortedEntries, 5);

      let result: TStudent.PredictResult = {
        studentId = studentId;
        predictions = finalEntries;
      };

      let now: Time.Time = Time.now();
      let idText = studentId # "-" # Nat.toText(Int.abs(now));

      let record: TSchool.PredictionRecord = {
        id = idText;
        studentId = studentId;
        result = result;
        predictedAt = now;
      };

      savePrediction(record);
      return result;
    };

    // Jalur Zonasi
    func createPredictionEntry(
      school: TSchool.School,
      address: TStudent.Address,
      isTarget: Bool
    ): TStudent.PredictResultEntry {
      let dx = school.latitude - address.latitude;
      let dy = school.longitude - address.longitude;
      let distanceKm = Float.abs(dx) + Float.abs(dy);

      let eligible = distanceKm <= school.zoningRadiusKm;
      let capacity = school.capacityZonasi;
      let estimated = school.avgApplicantsZonasi;

      let ratio = if (capacity == 0) 999.0 else Float.fromInt(estimated) / Float.fromInt(capacity);
      let ratioRounded = Float.floor(ratio * 10.0) / 10.0;
      let ratioText = "1:" # Float.toText(ratioRounded);
      let chance = if (estimated == 0) 100.0 else Float.fromInt(capacity) / Float.fromInt(estimated) * 100.0;

      {
        schoolName = school.name;
        schoolId = school.id;
        path = "Zonasi";
        eligible = eligible;
        chancePercentage = chance;
        ratio = ratioText;
        capacity = Float.fromInt(capacity);
        estimatedApplicants = Float.fromInt(estimated);
        radiusKm = school.zoningRadiusKm;
        distanceFromHomeKm = distanceKm;
        note = if (eligible) {
          "Masuk radius zonasi dan masih tersedia daya tampung.";
        } else {
          "Di luar radius zonasi, peluang rendah.";
        };
        isTarget = isTarget;
      }
    };

    // Jalur Prestasi
    func isEligiblePrestasi(
      school: TSchool.School,
      grades: [TStudent.GradeHistory]
    ): Bool {
      var total: Float = 0.0;
      var count: Nat = 0;

      for (g in grades.vals()) {
        for (r in g.academicRecords.vals()) {
          total += r.average;
          count += 1;
        };
      };

      if (count == 0) return false;

      let avgScore = total / Float.fromInt(count);
      return avgScore >= school.minAvgScorePrestasi;
    };
  };
};
