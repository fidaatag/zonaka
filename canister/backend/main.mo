// src/main.mo

import Predict "src/predict";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Float "mo:base/Float";

actor {
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  stable let schools : [Predict.School] = [
    {
      name = "Sekolah A";
      capacity = 100;
      quotaLeft = 1;
      priority = ["nilai", "jarak"];
    },
    {
      name = "Sekolah B";
      capacity = 50;
      quotaLeft = 3;
      priority = ["jarak", "nilai", "prestasi"];
    },
    {
      name = "Sekolah C";
      capacity = 80;
      quotaLeft = 2;
      priority = ["jarak", "nilai"];
    },
  ];

  // 🛠 FUNCTION findBestSchool
  func findBestSchool(input : Predict.PredictInput) : Text {
    var bestSchoolName = "";
    var bestScore = -1.0;

    let distances = [
      input.distanceToSchoolA,
      input.distanceToSchoolB,
      input.distanceToSchoolC,
    ];

    for (i in Iter.range(0, Array.size(schools) - 1)) {
      let school = schools[i];
      var score = 0.0;

      for (priority in school.priority.vals()) {
        switch (priority) {
          case ("nilai") {
            score += input.averageScore / 100.0;
          };
          case ("jarak") {
            let distance = distances[i];
            if (distance > 0) {
              score += 1.0 / distance;
            };
          };
          case ("prestasi") {
            score += 0.0; // Belum ada prestasi
          };
          case (_) {};
        };
      };

      score += Float.fromInt(school.quotaLeft) * 0.01;

      if (score > bestScore) {
        bestScore := score;
        bestSchoolName := school.name;
      };
    };

    return bestSchoolName;
  };

  // 🛠 FUNCTION predict
  public shared ({ caller }) func predict(input : Predict.PredictInput) : async Text {
    let userPrincipal = Principal.toText(caller);

    let recommendedSchool = findBestSchool(input);

    return "Halo " # userPrincipal # ", rekomendasi sekolahmu adalah: " # recommendedSchool;
  };

};
