import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';

// Route imports
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import timerRoutes from './routes/timer.routes';
import dashboardRoutes from './routes/dashboard.routes';
import analyticsRoutes from './routes/analytics.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const allowedClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    if (
      origin === allowedClientUrl || 
      origin.startsWith('http://localhost') || 
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timer', timerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TaskFlow API is running' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' }
  });
});

// Error handling
app.use(errorHandler);

export default app;
