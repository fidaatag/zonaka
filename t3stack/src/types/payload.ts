import { z } from "zod";

const AcademicRecordSchema = z.object({
  gradeId: z.string(),
  gradeLevel: z.number(),
  semester: z.number(),
  year: z.number(),
  subjects: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
    })
  ),
  total: z.number(),
  average: z.number(),
});

const GradeSchema = z.object({
  educationLevel: z.string(),
  schoolId: z.string(),
  schoolName: z.string(),
  entryYear: z.number(),
  isCurrent: z.boolean(),
  academicRecords: z.array(AcademicRecordSchema),
});

const TargetSchoolSchema = z.object({
  educationLevel: z.string(),
  nextTargetJenjang: z.string(),
  schools: z.array(
    z.object({
      targetId: z.string(),
      schoolId: z.string(),
      schoolName: z.string(),
      address: z.string(),
    })
  ),
});

export const PushQueuePayloadSchema = z.object({
  student: z.object({
    name: z.string(),
    birthDate: z.string(), // ISO format
    gender: z.enum(["MALE", "FEMALE"]),
  }),
  parent: z.object({
    name: z.string(),
    relation: z.string(),
    phone: z.string(),
    address: z.object({
      full: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      postalCode: z.string(),
    }),
  }),
  grades: z.array(GradeSchema).length(1),
  targets: z.array(TargetSchoolSchema).length(1),
});
