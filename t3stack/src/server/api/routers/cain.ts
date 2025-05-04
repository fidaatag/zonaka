import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
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
});