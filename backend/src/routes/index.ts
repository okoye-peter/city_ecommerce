import { Router } from 'express';
import authRoutes from './auth.routes';
import bankRoutes from './bank.routes';
import storeRoutes from './store.routes'


const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/banks', bankRoutes);
router.use('/markets', bankRoutes);
router.use('/stores', storeRoutes);

export default router;
