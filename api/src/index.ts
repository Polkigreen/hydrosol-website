import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { bookingRouter } from './routes/bookings';
import { customerRouter } from './routes/customers';
import { subscriptionRouter } from './routes/subscriptions';
import { invoiceRouter } from './routes/invoices';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/bookings', bookingRouter);
app.use('/api/customers', customerRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/invoices', invoiceRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 