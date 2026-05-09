import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import * as storeController from "../controllers/store.controller";
import { createStoreSchema, updateStoreSchema } from "@/validators/store.validator";
import { validate } from "@/middlewares/validate.middleware";

const router = Router();

router.use(authenticate);
router.use(authorize(Role.SELLER));

router.post("/", validate(createStoreSchema), storeController.createStore);
router.get("/", storeController.getUserStore);
router.patch("/", validate(updateStoreSchema), storeController.updateStore);
router.get("/stats", storeController.getStats);

export default router;
