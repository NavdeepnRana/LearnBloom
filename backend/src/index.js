import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import childrenRoutes from './routes/children.js';
import assessmentRoutes from './routes/assessments.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ message: 'MindBloom API is running', status: 'ok' });
});

// Connect to MongoDB and start
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mindbloom';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB connected: mindbloom');
    app.listen(PORT, () => {
      console.log(`🚀 MindBloom backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
