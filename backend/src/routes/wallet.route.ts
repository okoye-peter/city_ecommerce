import { validate } from '@/middlewares/validate.middleware';
import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import * as walletController from '@/controllers/wallet.controller';
import { withdrawalSchema } from '@/validators/wallet.validator';

const router = Router()

router.use(authenticate);
router.use(authorize(Role.BUYER, Role.SELLER));

router.get('/', walletController.getUserWallet)
router.get('/transactions', walletController.walletTransactions);
router.post('/withdrawal', validate(withdrawalSchema), walletController.initiateWithdrawal);

export default router;
