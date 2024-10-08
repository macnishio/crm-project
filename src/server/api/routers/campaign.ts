import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const campaignRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.campaign.findMany();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.campaign.findUnique({
        where: { id: input.id },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      budget: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.campaign.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      budget: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.campaign.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.campaign.delete({
        where: { id: input.id },
      });
    }),

  calculateROI: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const campaign = await ctx.prisma.campaign.findUnique({
        where: { id: input.id },
        include: { opportunities: true },
      });

      if (!campaign) {
        throw new Error("Campaign not found");
      }

      const totalRevenue = campaign.opportunities.reduce((sum, opp) => sum + opp.amount, 0);
      const roi = (totalRevenue - campaign.budget) / campaign.budget * 100;

      return { roi: roi.toFixed(2) + '%' };
    }),
});
