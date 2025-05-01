import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const parentRouter = createTRPCRouter({

  getCurrentParent: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;

      const parent = await ctx.db.parent.findUnique({
        where: { userId },
        include: { address: true },
      });

      if (!parent) {
        return {
          success: true,
          exists: false,
          parent: null,
        };
      }

      return {
        success: true,
        exists: true,
        message: "Data orang tua ditemukan",
        parent: {
          id: parent.id,
          name: parent.name,
          relation: parent.relations,
          phone: parent.phoneNumber,
          address: {
            full: parent.address.full,
            postalCode: parent.address.postalCode,
            latitude: parent.address.latitude,
            longitude: parent.address.longitude,
          },
        },
      };

    } catch (error) {
      return {
        success: false,
        message: "Gagal mengambil data orang tua",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),

  

  updateCurrentParent: protectedProcedure
    .input(
      z.object({
        parentName: z.string(),
        parentRelation: z.string(),
        parentPhone: z.string().optional(),
        fullAddress: z.string(),
        postalCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const updatedParent = await ctx.db.parent.update({
          where: { userId },
          data: {
            name: input.parentName,
            relations: input.parentRelation,
            phoneNumber: input.parentPhone,
            address: {
              update: {
                full: input.fullAddress,
                postalCode: input.postalCode,
              },
            },
          },
        });

        return {
          success: true,
          message: "Data orang tua berhasil diperbarui",
          parent: updatedParent,
        };
      } catch (error) {
        return {
          success: false,
          message: "Gagal memperbarui data orang tua",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    })


})
