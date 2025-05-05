import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

// ====================
// TypeScript Interface
// ====================

export interface AcademicRecord {
  total: number;
  semester: number;
  subjects: SubjectGrade[];
  year: number;
  average: number;
  gradeId: string;
  gradeLevel: number;
}

export interface Address {
  latitude: number;
  full: string;
  postalCode: string;
  longitude: number;
}

export interface GradeHistory {
  entryYear: number;
  academicRecords: AcademicRecord[];
  schoolId: string;
  isCurrent: boolean;
  educationLevel: string;
  schoolName: string;
}

export interface Parent {
  relation: string;
  name: string;
  address: Address;
}

export interface Resume {
  grades: GradeHistory[];
  studentId: string;
  owner: Principal;
  createdBy: Principal;
  targets: Target[];
  transferableAt: bigint;
  student: Student;
  parent: Parent;
}

export interface Student {
  birthDate: string;
  name: string;
  gender: string;
}

export interface SubjectGrade {
  name: string;
  score: number;
}

export interface Target {
  schools: TargetSchool[];
  nextTargetJenjang: string;
  educationLevel: string;
}

export interface TargetSchool {
  schoolId: string;
  address: string;
  targetId: string;
  schoolName: string;
}

export interface StudentService {
  getResumeById: ActorMethod<[string], [] | [Resume]>;
  submitMultipleResumes: ActorMethod<[Resume[]], boolean[]>;
  submitResume: ActorMethod<[Resume], boolean>;
}

// ====================
// IDL Factory
// ====================

export const idlFactoryStudent: IDL.InterfaceFactory = ({ IDL }) => {
  const SubjectGrade = IDL.Record({
    name: IDL.Text,
    score: IDL.Float64,
  });

  const AcademicRecord = IDL.Record({
    total: IDL.Float64,
    semester: IDL.Float64,
    subjects: IDL.Vec(SubjectGrade),
    year: IDL.Float64,
    average: IDL.Float64,
    gradeId: IDL.Text,
    gradeLevel: IDL.Float64,
  });

  const Address = IDL.Record({
    latitude: IDL.Float64,
    full: IDL.Text,
    postalCode: IDL.Text,
    longitude: IDL.Float64,
  });

  const GradeHistory = IDL.Record({
    entryYear: IDL.Float64,
    academicRecords: IDL.Vec(AcademicRecord),
    schoolId: IDL.Text,
    isCurrent: IDL.Bool,
    educationLevel: IDL.Text,
    schoolName: IDL.Text,
  });

  const Parent = IDL.Record({
    relation: IDL.Text,
    name: IDL.Text,
    address: Address,
  });

  const Student = IDL.Record({
    birthDate: IDL.Text,
    name: IDL.Text,
    gender: IDL.Text,
  });

  const TargetSchool = IDL.Record({
    schoolId: IDL.Text,
    address: IDL.Text,
    targetId: IDL.Text,
    schoolName: IDL.Text,
  });

  const Target = IDL.Record({
    schools: IDL.Vec(TargetSchool),
    nextTargetJenjang: IDL.Text,
    educationLevel: IDL.Text,
  });

  const Resume = IDL.Record({
    grades: IDL.Vec(GradeHistory),
    studentId: IDL.Text,
    owner: IDL.Principal,
    createdBy: IDL.Principal,
    targets: IDL.Vec(Target),
    transferableAt: IDL.Nat64, // Nat64 tetap pakai IDL.Int
    student: Student,
    parent: Parent,
  });

  return IDL.Service({
    getResumeById: IDL.Func([IDL.Text], [IDL.Opt(Resume)], ['query']),
    submitMultipleResumes: IDL.Func([IDL.Vec(Resume)], [IDL.Vec(IDL.Bool)], []),
    submitResume: IDL.Func([Resume], [IDL.Bool], []),
  });
};

export const initStudent = ({ IDL }: { IDL: typeof import('@dfinity/candid').IDL }) => {
  return [];
};