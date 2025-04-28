import Predict "src/predict";
import Principal "mo:base/Principal";

actor {
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  public shared ({ caller }) func predict( _ : Predict.PredictInput) : async Text {
    // Nanti di sini isi logika prediksi kamu
    // Untuk sekarang, anggap return acknowledgment dulu
    let userPrincipal = Principal.toText(caller);

     return "Predict input received successfully : " # userPrincipal;
  };
};
