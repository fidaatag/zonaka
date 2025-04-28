// backend/src/predict.mo

module {
  public type School = {
    name : Text;
    capacity : Nat;
    quotaLeft : Nat;
    priority : [Text]; // ["nilai", "jarak", "prestasi"]
  };

  public type PredictInput = {
    averageScore : Float;
    distanceToSchoolA : Float;
    distanceToSchoolB : Float;
    distanceToSchoolC : Float;
    // (prestasi bisa ditambahkan opsional nanti)
  };
};
