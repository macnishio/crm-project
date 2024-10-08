import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const leadRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.lead.findMany();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.lead.findUnique({
        where: { id: input.id },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      status: z.string(),
      campaignId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.lead.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      status: z.string().optional(),
      campaignId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.lead.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.lead.delete({
        where: { id: input.id },
      });
    }),

  convertToContact: protectedProcedure
    .input(z.object({
      id: z.string(),
      accountId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const lead = await ctx.prisma.lead.findUnique({
        where: { id: input.id },
      });

      if (!lead) {
        throw new Error("Lead not found");
      }

      const contact = await ctx.prisma.contact.create({
        data: {
          firstName: lead.name.split(' ')[0],
          lastName: lead.name.split(' ').slice(1).join(' '),
          email: lead.email,
          accountId: input.accountId,
        },
      });

      await ctx.prisma.lead.update({
        where: { id: input.id },
        data: { contactId: contact.id },
      });

      return contact;
    }),
});
