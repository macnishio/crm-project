import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const opportunityRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.opportunity.findMany();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.opportunity.findUnique({
        where: { id: input.id },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      amount: z.number(),
      stage: z.string(),
      closeDate: z.date(),
      accountId: z.string(),
      campaignId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.opportunity.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      amount: z.number().optional(),
      stage: z.string().optional(),
      closeDate: z.date().optional(),
      accountId: z.string().optional(),
      campaignId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.opportunity.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.opportunity.delete({
        where: { id: input.id },
      });
    }),
});
