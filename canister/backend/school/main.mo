import T "./type";
import SchoolModule "./school";

actor {
  let school = SchoolModule.School();

  // Seeder: Tambah sekolah satuan
  public func addSchool(data: T.School) : async Bool {
    await school.addSchool(data);
  };

  // Seeder: Tambah banyak sekolah sekaligus
  public func bulkAddSchools(datas: [T.School]) : async Nat {
    await school.bulkAddSchools(datas);
  };

  // Ambil semua data sekolah
  public func getAllSchools() : async [T.School] {
    await school.getAllSchools();
  };

  // Ambil daftar prediksi siswa tertentu
  public func getPredictionsByStudent(studentId: Text) : async [T.PredictionRecord] {
    await school.getPredictions(studentId);
  };
  
};
