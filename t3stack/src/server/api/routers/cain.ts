import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { createActor } from "@/lib/icp/actor"; // 👈 ganti ke versi universal

export const cainRouter = createTRPCRouter({
  great_cain: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const actor = await createActor(); // langsung aja
      const result = await actor!.greet!(input.name);
      console.log("Result from ICP:", result);
      return { message: result };
    }),


  // get all queue by parent
  getAllQueuesByParent: protectedProcedure
    .query(async ({ ctx }) => {
      // 1. Ambil semua studentId milik parent login
      const userId = ctx.session.user.id

      const parent = await ctx.db.parent.findUnique({
        where: { userId: userId },
      })

      const students = await ctx.db.student.findMany({
        where: {
          parentId: parent?.id,
        },
        select: { id: true },
      });

      const studentIds = students.map((s) => s.id);

      // 2. Ambil semua antrian milik siswa-siswa tersebut
      const queue = await ctx.db.queuePushChain.findMany({
        where: {
          studentId: { in: studentIds },
        },
        orderBy: { createdAt: "desc" },
        include: {
          student: true,
        },
      });

      return {
        success: true,
        message: "Berhasil mengambil data antrian siswa",
        queue: queue
      }
    }),

  // mark succes resume was send
  markBulkPushResultByStudentIds: protectedProcedure
    .input(z.object({
      studentIds: z.array(z.string()),
      results: z.array(z.boolean()),
    }))
    .mutation(async ({ input, ctx }) => {
      const updates = await Promise.all(
        input.studentIds.map((studentId, index) =>
          ctx.db.queuePushChain.updateMany({
            where: { studentId },
            data: {
              status: input.results[index] ? "pushed" : "failed",
              processedAt: new Date(),
            },
          })
        )
      );
      return {
        success: true,
        message: "Data berhasil di kirim ke cain",
        data: updates
      }
    }),


})