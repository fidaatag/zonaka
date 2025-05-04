import StudentModule "./student";
import T "./type";

actor {
  let students = StudentModule.Student();

  public shared({caller}) func submitResume(data: T.Resume): async Bool {
    await students.submitResume(data, caller)
  };

  public shared func getResumeById(id: Text): async ?T.Resume {
    await students.getResumeById(id)
  };
}
