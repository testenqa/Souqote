import { Router } from 'express';
import authRoutes from './auth';
import jobRoutes from './jobs';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Handyman UAE API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
