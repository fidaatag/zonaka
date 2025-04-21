import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { actor } from "@/lib/icp/actor";

export const cainRouter = createTRPCRouter({
  great_cain: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const result = actor?.greet ? await actor.greet(input.name) : "Default greeting t3-stack";
      
      console.log("Result from ICP:", result);
      return { message: result };
    }),
})