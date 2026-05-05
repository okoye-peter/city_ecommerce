import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import * as storeController from '../controllers/store.controller';

const router = Router()

router.use(authenticate);
router.use(authorize(Role.SELLER))

router.post('/', storeController.createStore);

export default router;