
import { Router } from 'express';
import * as marketController from '../controllers/market.controller';
import { authenticate } from '@/middlewares/auth.middleware';


const router = Router();

router.get('/', authenticate, marketController.getMarkets);


export default router;