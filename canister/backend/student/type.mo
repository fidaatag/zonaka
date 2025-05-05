module {

  // bio of parent and student
  public type Address = {
    full : Text;
    latitude : Float;
    longitude : Float;
    postalCode : Text;
  };

  public type Parent = {
    name : Text;
    address : Address;
    relation : Text;
  };

  public type Student = {
    name : Text;
    gender : Text;
    birthDate : Text;
  };

  // data of academic student
  public type GradeHistory = {
    educationLevel : Text;
    schoolId : Text;
    schoolName : Text;
    entryYear : Float;
    isCurrent : Bool;
    academicRecords : [AcademicRecord];
  };

  public type AcademicRecord = {
    gradeId : Text; // ?? ini id nya apa ?
    semester : Float;
    year : Float;
    gradeLevel : Float;
    total : Float;
    average : Float;
    subjects : [SubjectGrade];
  };

  public type SubjectGrade = {
    name : Text;
    score : Float;
  };

  // data of target next school -- this school will use for reference of prediction
  public type Target = {
    educationLevel : Text;
    nextTargetJenjang : Text;
    schools : [TargetSchool];
  };

  public type TargetSchool = {
    targetId : Text;
    schoolId : Text;
    schoolName : Text;
    address : Text;
  };

  // type resume that receive cain form app
  public type Resume = {
    studentId : Text;
    createdBy : Principal;
    owner : Principal;
    transferableAt : Nat64; // timestamp untuk transfer hak milik
    parent : Parent;
    student : Student;
    grades : [GradeHistory];
    targets : [Target];
  };

  // type result each predict
  public type PredictResultEntry = {
    schoolName : Text;
    schoolId : Text;
    path : Text; // Jalur terbaik: Zonasi / Prestasi / dst
    eligible : Bool;
    chancePercentage : Float;
    ratio : Text;
    note : Text;
    radiusKm : Float;
    distanceFromHomeKm : Float;
    capacity : Float;
    estimatedApplicants : Float;
    isTarget : Bool; // true = user input, false = rekomendasi tambahan
  };

  public type PredictResult = {
    studentId : Text;
    predictions : [PredictResultEntry]; // Selalu 5 item
  };

};
