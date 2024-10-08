import express from 'express';
import { tenantMiddleware } from './middleware/tenant';
import { errorHandler } from './middleware/error-handler';
import { authRouter } from './routes/auth';
import { customerRouter } from './routes/customer';
import { leadRouter } from './routes/lead';
import { opportunityRouter } from './routes/opportunity';

const app = express();

app.use(express.json());
app.use(tenantMiddleware);

// Routes
app.use('/auth', authRouter);
app.use('/customers', customerRouter);
app.use('/leads', leadRouter);
app.use('/opportunities', opportunityRouter);

// Error handling
app.use(errorHandler);

export default app;
