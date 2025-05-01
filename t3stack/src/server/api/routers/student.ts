import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
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
    })
})