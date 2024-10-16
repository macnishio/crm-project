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

// ćØćÆć¹ććEććććåå®ē¾©ććććEćÆć©ć¤ć¢ć³ćåEć§ä½æēØććć¾ććE
export type AppRouter = typeof appRouter;
