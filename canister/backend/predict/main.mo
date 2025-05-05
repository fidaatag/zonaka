import Student "../student/student";
import Predict "./predict";
import School "../school/school";
import TStudent "../student/type";

actor {
  let student = Student.Student();
  let school = School.School();

  // getMap now works after you add it to school.mo
  let predictor = Predict.Predict(school.getMap());

  // use func (not query) since we're using await
  public func predictStudent(studentId: Text): async ?TStudent.PredictResult {
    switch (await student.getResumeById(studentId)) {
      case null return null;
      case (?resume) return ?predictor.predict(resume);
    };
  };
}
