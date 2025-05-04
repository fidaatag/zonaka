import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { actor } from "@/lib/icp/actor";

export const cainRouter = createTRPCRouter({
  great_cain: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const resolvedActor = await actor;
      const result = resolvedActor?.greet ? await resolvedActor.greet(input.name) : "Default greeting t3-stack";

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


})