import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";
import * as categoryController from '../controllers/category.controller';

const router = Router();

router.use(authenticate);

router.get('/', categoryController.getCategories);


export default router;
