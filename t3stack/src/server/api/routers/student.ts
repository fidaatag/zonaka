import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { Jenjang, JenjangData } from "@/types/academic";
import { add } from "date-fns";
import { z } from "zod";

export const studentRouter = createTRPCRouter({

  // create a new student
  createStudent: protectedProcedure
    .input(
      z.object({
        fullName: z.string(),
        birthDate: z.date(),
        gender: z.enum(["MALE", "FEMALE"]),

        parentName: z.string(),
        parentRelation: z.string(),
        parentPhone: z.string().optional(),

        fullAddress: z.string(),
        postalCode: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {

        const userId = ctx.session.user.id;

        // check is parent exists
        let parent = await ctx.db.parent.findUnique({
          where: { userId: userId }
        })

        let addressId: string;

        // if not exists, create new parent + address
        if (!parent) {

          const newAddress = await ctx.db.address.create({
            data: {
              full: input.fullAddress,
              postalCode: input.postalCode,
              latitude: input.latitude,
              longitude: input.longitude,
            }
          })

          console.log("ADDRESS CREATED:", newAddress)

          parent = await ctx.db.parent.create({
            data: {
              userId: userId,
              name: input.parentName,
              relations: input.parentRelation,
              phoneNumber: input.parentPhone ?? "-",
              addressId: newAddress.id,
            },
          });

          console.log("PARENT CREATED:", parent)

          if (!parent) {
            throw new Error("Gagal membuat parent")
          }

          addressId = newAddress.id;

          // if exists, use address parent for the new student
        } else {
          addressId = parent.addressId
        }

        // create new student
        const student = await ctx.db.student.create({
          data: {
            name: input.fullName,
            birthDate: input.birthDate,
            addressId: addressId,
            parentId: parent.id,
            gender: input.gender
          },
        });

        console.log("STUDENT CREATED:", student)

        return {
          success: true,
          message: "Siswa berhasil ditambahkan",
        }

      } catch (error) {
        return {
          success: false,
          message: "Gagal menambahkan siswa",
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }),


  // get all students by user as parent
  getAllStudentByParent: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.session.user.id;

        // check is parent has students
        const parent = await ctx.db.parent.findUnique({
          where: { userId: userId },
          include: { students: true }
        })

        if (!parent) {
          return {
            success: true,
            message: "Tidak ada siswa yang terdaftar",
            students: [],
          }
        }

        // get all students by parent
        const students = await ctx.db.student.findMany({
          where: { parentId: parent.id },
          include: {
            schoolHistory: {
              where: { isCurrent: true },
              include: {
                school: {
                  include: {
                    address: true,
                  },
                },
              },
            },
          }
        });

        const studentList = students.map((student) => {
          const currentSchool = student.schoolHistory[0];

          return {
            id: student.id,
            name: student.name,
            birthDate: student.birthDate.toISOString().split("T")[0], // format ke 'YYYY-MM-DD'
            educationLevel: currentSchool?.educationLevel ?? "-",
            school: {
              name: currentSchool?.school?.name ?? currentSchool?.schoolName ?? "-",
              address: currentSchool?.school?.address?.full ?? "-",
            },
            status: currentSchool?.isCurrent ? "Aktif" : "Lulus", // atau logic lain
            imageUrl: student.photoUrl ?? "https://avatar.iran.liara.run/public/20",
          }
        });

        return {
          success: true,
          message: "Data siswa ditemukan",
          students: studentList,
        }

      } catch (error) {
        return {
          success: false,
          message: "Gagal mengambil data siswa",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),


  // get student for card by id
  getStudentCardById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.student.findUnique({
        where: { id: input.id },
        select: {
          name: true,
          birthDate: true,
          gender: true,
        },
      })
    }),


  // update student for card by id
  updateStudentCardById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Wajib diisi"),
        birthDate: z.date({ required_error: "Wajib diisi" }),
        gender: z.enum(["MALE", "FEMALE"], { required_error: "Wajib dipilih" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return await ctx.db.student.update({
        where: { id },
        data,
      })
    }),


  // get school history by StudentId
  getSchoolHistoryByStudentId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.schoolHistory.findMany({
        where: { studentId: input.id },
        select: {
          id: true,
          schoolId: true,
          school: true,
          schoolName: true,
          educationLevel: true,
          entryYear: true,
          graduationYear: true,
          isCurrent: true,
          notes: true
        }
      })
    }),


  // create school history by StudentId
  createSchoolHistoryByStudentId: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        schoolId: z.string(),
        schoolName: z.string(),
        educationLevel: z.enum(["SD", "SMP", "SMA"]),
        entryYear: z.number(),
        graduationYear: z.number().optional(),
        isCurrent: z.string(),
        notes: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.schoolHistory.create({
          data: {
            studentId: input.studentId,
            schoolId: input.schoolId,
            schoolName: input.schoolName,
            educationLevel: input.educationLevel,
            entryYear: input.entryYear,
            graduationYear: input.graduationYear ?? 0,
            isCurrent: input.isCurrent === "true",
            notes: input.notes ?? "",
          }
        })

        return {
          success: true,
          message: "Sekolah siswa berhasil ditambahkan",
        }

      } catch (error) {
        return {
          success: false,
          message: "Gagal menambahkan sekolah siswa",
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }),

  // update school history by StudentId
  updateSchoolHistoryByStudentId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        studentId: z.string(),
        schoolId: z.string(),
        schoolName: z.string(),
        educationLevel: z.enum(["SD", "SMP", "SMA"]),
        entryYear: z.number(),
        graduationYear: z.number().optional(),
        isCurrent: z.string(),
        notes: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.schoolHistory.update({
          where: { id: input.id },
          data: {
            studentId: input.studentId,
            schoolId: input.schoolId,
            schoolName: input.schoolName,
            educationLevel: input.educationLevel,
            entryYear: input.entryYear,
            graduationYear: input.graduationYear ?? 0,
            isCurrent: input.isCurrent === "true",
            notes: input.notes ?? "",
          }
        })

        return {
          success: true,
          message: "Sekolah siswa berhasil diupdate",
        }

      } catch (error) {
        return {
          success: false,
          message: "Gagal menambahkan sekolah siswa",
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }),


  // create grades by semester
  createGradesPerSemesterByStudentId: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        schoolId: z.string(),
        educationLevel: z.enum(["SD", "SMP", "SMA"]),
        year: z.number(),
        semester: z.number(),
        gradeLevel: z.number(),

        // harusnya ini array aja
        grades: z.array(
          z.object({
            subject: z.string(),
            score: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        studentId,
        schoolId,
        educationLevel,
        year,
        semester,
        gradeLevel,
        grades,
      } = input;

      try {
        const result = await ctx.db.grade.createMany({
          data: grades.map((g) => ({
            studentId,
            schoolId,
            educationLevel,
            year,
            semester,
            gradeLevel,
            subject: g.subject,
            score: g.score,
          })),
        });

        return {
          success: true,
          message: "Berhasil menambahkan data nilai siswa",
          count: result.count,
        };
      } catch (error) {
        return {
          success: false,
          message: "Gagal menambahkan data nilai siswa",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),


  // get grades by student
  getGradesByStudentId: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const grades = await ctx.db.grade.findMany({
        where: { studentId: input.studentId },
        include: { school: true },
        orderBy: [
          { educationLevel: "asc" },
          { gradeLevel: "asc" },
          { semester: "asc" },
          { subject: "asc" },
        ],
      });

      type GradeGroup = {
        groupId: string;
        schoolId: string;
        schoolName: string
        gradeLevel: number;
        semester: number;
        year: number;
        subjects: {
          gradeId: string;
          subject: string;
          score: number;
        }[];
      };

      const groupedByEduLevel: {
        educationLevel: "SD" | "SMP" | "SMA";
        data: GradeGroup[];
      }[] = [];

      const levelMap = new Map<"SD" | "SMP" | "SMA", Map<string, GradeGroup>>();

      for (const grade of grades) {
        const level = grade.educationLevel as "SD" | "SMP" | "SMA";
        const groupKey = `${grade.schoolId}-${grade.gradeLevel}-${grade.semester}`;

        if (!levelMap.has(level)) {
          levelMap.set(level, new Map());
        }

        const groupMap = levelMap.get(level)!;

        if (!groupMap.has(groupKey)) {
          groupMap.set(groupKey, {
            groupId: grade.id, // ambil ID pertama yang ditemukan
            schoolId: grade.schoolId,
            schoolName: grade.school.name,
            gradeLevel: grade.gradeLevel,
            semester: grade.semester,
            year: grade.year,
            subjects: [],
          });
        }

        const group = groupMap.get(groupKey)!;
        group.subjects.push({
          gradeId: grade.id,
          subject: grade.subject,
          score: grade.score,
        });
      }

      for (const [level, groupMap] of levelMap.entries()) {
        groupedByEduLevel.push({
          educationLevel: level,
          data: Array.from(groupMap.values()),
        });
      }

      return { grades: groupedByEduLevel };
    }),




})