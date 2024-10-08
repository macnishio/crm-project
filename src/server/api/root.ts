import { createTRPCRouter } from "./trpc";
import { accountRouter } from "./routers/account";
import { contactRouter } from "./routers/contact";
import { leadRouter } from "./routers/lead";
import { opportunityRouter } from "./routers/opportunity";
import { campaignRouter } from "./routers/campaign";

export const appRouter = createTRPCRouter({
  account: accountRouter,
  contact: contactRouter,
  lead: leadRouter,
  opportunity: opportunityRouter,
  campaign: campaignRouter,
});

// エクスポ�Eトされる型定義。これ�Eクライアント�Eで使用されます、E
export type AppRouter = typeof appRouter;
