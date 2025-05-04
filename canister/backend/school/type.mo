import Time "mo:base/Time";
import TStudent "../student/type";

module {
  public type School = {
    id: Text;
    name: Text;
    address: Text;
    latitude: Float;
    longitude: Float;
    postalCode: Text;
    educationLevel: Text;
    academicYear: Text;

    capacityZonasi: Nat;
    avgApplicantsZonasi: Nat;

    capacityPrestasi: Nat;
    avgApplicantsPrestasi: Nat;
    minAvgScorePrestasi: Float;

    capacityAfirmasi: Nat;
    avgApplicantsAfirmasi: Nat;

    capacityPerpindahanOrtu: Nat;
    avgApplicantsPerpindahan: Nat;

    zoningRadiusKm: Float;
    createdAt: Time.Time;
  };

  public type PredictionRecord = {
    id: Text;
    studentId: Text;
    result: TStudent.PredictResult;
    predictedAt: Time.Time;
  };
}

