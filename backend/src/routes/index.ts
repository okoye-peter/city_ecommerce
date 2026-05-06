import { Router } from 'express';
import authRoutes from './auth.routes';
import bankRoutes from './bank.routes';
import marketRoutes from './market.routes'
import storeRoutes from './store.routes'
import userRoutes from './user.routes';
import uploadRoutes from './upload.routes';
import categoryRoutes from './category.routes';


const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/banks', bankRoutes);
router.use('/markets', marketRoutes);
router.use('/categories', categoryRoutes);
router.use('/stores', storeRoutes);
router.use('/users', userRoutes);
router.use('/uploads', uploadRoutes);

export default router;
