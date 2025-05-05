import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Nat64 "mo:base/Nat64";
import T "./type";

module {
  public class Student() {
    private let resumes = HashMap.HashMap<Text, T.Resume>(10, Text.equal, Text.hash);

    public func submitResume(data : T.Resume, caller : Principal) : async Bool {
      if (Principal.toText(data.createdBy) != Principal.toText(caller)) {
        return false;
      };

      switch (resumes.get(data.studentId)) {
        case (?_) { return false };
        case (null) {
          resumes.put(data.studentId, data);
          return true;
        };
      };
    };

    public func getResumeById(id : Text) : async ?T.Resume {
      resumes.get(id);
    };

    public func getAllResumes() : async [T.Resume] {
      Iter.toArray(resumes.vals());
    };

    public func claimOwnership(studentId : Text, caller : Principal) : async Bool {
      switch (resumes.get(studentId)) {
        case (null) { return false };
        case (?resume) {
          if (Nat64.fromIntWrap(Time.now()) < resume.transferableAt) {
            return false;
          };

          let updated = {
            resume with owner = caller
          };

          resumes.put(studentId, updated);
          return true;
        };
      };
    };

  };
};
