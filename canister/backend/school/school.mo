import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";
import T "./type";
import TStudent "../student/type";

module {
  public class School() {
    private let schools = HashMap.HashMap<Text, T.School>(100, Text.equal, Text.hash);
    private let predictionRecords = HashMap.HashMap<Text, [T.PredictionRecord]>(100, Text.equal, Text.hash);

    // Tambahkan sekolah satuan
    public func addSchool(data: T.School) : async Bool {
      if (schools.get(data.id) != null) {
        return false;
      };
      schools.put(data.id, data);
      return true;
    };

    // Tambahkan banyak sekolah (misal dari seeder)
    public func bulkAddSchools(datas: [T.School]) : async Nat {
      var count: Nat = 0;
      for (data in datas.vals()) {
        if (schools.get(data.id) == null) {
          schools.put(data.id, data);
          count += 1;
        };
      };
      return count;
    };

    // Ambil semua sekolah
    public func getAllSchools() : async [T.School] {
      Iter.toArray(schools.vals());
    };

    // Simpan hasil prediksi siswa
    public func savePrediction(studentId: Text, result: TStudent.PredictResult) : async Bool {
      let history = switch (predictionRecords.get(studentId)) {
        case (?arr) arr;
        case null [];
      };

      let newEntry: T.PredictionRecord = {
        id = studentId # "-" # debug_show(Time.now());
        studentId = studentId;
        result = result;
        predictedAt = Time.now();
      };

      predictionRecords.put(studentId, Array.append(history, [newEntry]));
      return true;
    };

    // Ambil seluruh riwayat prediksi untuk siswa
    public func getPredictions(studentId: Text) : async [T.PredictionRecord] {
      switch (predictionRecords.get(studentId)) {
        case (?arr) arr;
        case null [];
      }
    };
  };
}