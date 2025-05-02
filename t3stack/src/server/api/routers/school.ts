import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const schoolRouter = createTRPCRouter({

  // get list existing school
  getAllSchool: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.school.findMany({
      select: {
        id: true,
        name: true,
        educationLevel: true,
        address: true,
      }
    })
  }),

});