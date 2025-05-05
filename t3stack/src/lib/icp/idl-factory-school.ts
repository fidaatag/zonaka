import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface PredictResult {
  studentId: string;
  predictions: PredictResultEntry[];
}

export interface PredictResultEntry {
  note: string;
  estimatedApplicants: bigint;
  path: string;
  chancePercentage: number;
  schoolId: string;
  eligible: boolean;
  capacity: bigint;
  isTarget: boolean;
  distanceFromHomeKm: number;
  ratio: string;
  radiusKm: number;
  schoolName: string;
}

export interface PredictionRecord {
  id: string;
  result: PredictResult;
  studentId: string;
  predictedAt: Time;
}

export interface School {
  id: string;
  avgApplicantsAfirmasi: bigint;
  latitude: number;
  avgApplicantsPerpindahan: bigint;
  capacityAfirmasi: bigint;
  postalCode: string;
  name: string;
  createdAt: Time;
  avgApplicantsPrestasi: bigint;
  zoningRadiusKm: number;
  capacityPrestasi: bigint;
  academicYear: string;
  avgApplicantsZonasi: bigint;
  minAvgScorePrestasi: number;
  longitude: number;
  address: string;
  educationLevel: string;
  capacityPerpindahanOrtu: bigint;
  capacityZonasi: bigint;
}

export type Time = bigint;

export interface SchoolService {
  addSchool: ActorMethod<[School], boolean>;
  bulkAddSchools: ActorMethod<[School[]], bigint>;
  getAllSchools: ActorMethod<[], School[]>;
  getPredictionsByStudent: ActorMethod<[string], PredictionRecord[]>;
}

export const idlFactorySchool: IDL.InterfaceFactory = ({ IDL }) => {
  const School = IDL.Record({
    id: IDL.Text,
    avgApplicantsAfirmasi: IDL.Nat,
    latitude: IDL.Float64,
    avgApplicantsPerpindahan: IDL.Nat,
    capacityAfirmasi: IDL.Nat,
    postalCode: IDL.Text,
    name: IDL.Text,
    createdAt: IDL.Int, // for Time
    avgApplicantsPrestasi: IDL.Nat,
    zoningRadiusKm: IDL.Float64,
    capacityPrestasi: IDL.Nat,
    academicYear: IDL.Text,
    avgApplicantsZonasi: IDL.Nat,
    minAvgScorePrestasi: IDL.Float64,
    longitude: IDL.Float64,
    address: IDL.Text,
    educationLevel: IDL.Text,
    capacityPerpindahanOrtu: IDL.Nat,
    capacityZonasi: IDL.Nat,
  });

  const PredictResultEntry = IDL.Record({
    note: IDL.Text,
    estimatedApplicants: IDL.Nat,
    path: IDL.Text,
    chancePercentage: IDL.Float64,
    schoolId: IDL.Text,
    eligible: IDL.Bool,
    capacity: IDL.Nat,
    isTarget: IDL.Bool,
    distanceFromHomeKm: IDL.Float64,
    ratio: IDL.Text,
    radiusKm: IDL.Float64,
    schoolName: IDL.Text,
  });

  const PredictResult = IDL.Record({
    studentId: IDL.Text,
    predictions: IDL.Vec(PredictResultEntry),
  });

  const PredictionRecord = IDL.Record({
    id: IDL.Text,
    studentId: IDL.Text,
    result: PredictResult,
    predictedAt: IDL.Int,
  });

  return IDL.Service({
    addSchool: IDL.Func([School], [IDL.Bool], []),
    bulkAddSchools: IDL.Func([IDL.Vec(School)], [IDL.Nat], []),
    getAllSchools: IDL.Func([], [IDL.Vec(School)], ['query']),
    getPredictionsByStudent: IDL.Func([IDL.Text], [IDL.Vec(PredictionRecord)], ['query']),
  });
};

export const initSchool = ({ IDL }: { IDL: typeof import('@dfinity/candid').IDL }) => {
  return [];
};
