import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import * as storeController from "../controllers/store.controller";

import { createStoreSchema } from "@/validators/store.validator";
import { validate } from "@/middlewares/validate.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Store management (sellers only)
 */

router.use(authenticate);
router.use(authorize(Role.SELLER));

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStoreBody'
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Forbidden — sellers only
 */
router.post("/", validate(createStoreSchema), storeController.createStore);

export default router;
