import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectTodatabase from './db/db.js';

import authRouter from './routes/auth.js';
import baseRouter from './routes/base.js';
import assetRouter from './routes/asset.js';
import purchaseRoutes from './routes/purchase.js';
import inventoryRoutes from './routes/inventory.js'; 
import transferRoutes from './routes/transfer.js';
import expenditureRoutes from './routes/expenditure.js';
import userRoutes from './routes/user.js';

dotenv.config();
connectTodatabase();

const app = express();

// ✅ CORS configuration
const allowedOrigins = ['https://mams-frontend.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ✅ Handle preflight requests for all routes
app.options('*', cors());

// Middleware
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/base', baseRouter);
app.use('/api/asset', assetRouter);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/inventory', inventoryRoutes); 
app.use('/api/transfer', transferRoutes);
app.use('/api/expenditure', expenditureRoutes);
app.use('/api/user', userRoutes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT}`);
});
