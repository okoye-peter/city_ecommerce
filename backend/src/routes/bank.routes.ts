import { Router } from 'express';
import * as bankController from '../controllers/bank.controller';
import { authenticate } from '@/middlewares/auth.middleware';


const router = Router();

router.get('/', authenticate, bankController.getBanks);


export default router;