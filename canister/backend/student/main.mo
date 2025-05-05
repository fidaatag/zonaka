import StudentModule "./student";
import T "./type";
import Buffer "mo:base/Buffer";

actor {
  let students = StudentModule.Student();

  public shared ({ caller }) func submitResume(data : T.Resume) : async Bool {
    await students.submitResume(data, caller);
  };

  public shared func getResumeById(id : Text) : async ?T.Resume {
    await students.getResumeById(id);
  };

  public shared ({ caller }) func submitMultipleResumes(dataList : [T.Resume]) : async [Bool] {
    let buffer = Buffer.Buffer<Bool>(dataList.size());

    for (data in dataList.vals()) {
      let result = await students.submitResume(data, caller);
      buffer.add(result);
    };

    return Buffer.toArray(buffer);
  };

};
