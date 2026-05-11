import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import * as storeController from "../controllers/store.controller";
import { createStoreSchema, updateStoreSchema } from "@/validators/store.validator";
import { validate } from "@/middlewares/validate.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Seller store management (Seller only)
 */

router.use(authenticate);
router.use(authorize(Role.SELLER));

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create a new store
 *     description: |
 *       Creates a store for the authenticated seller. Runs inside a single
 *       database transaction that also:
 *       - Creates the seller wallet
 *       - Saves the initial bank account
 *       - Optionally seeds initial products
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Store'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post("/", validate(createStoreSchema), storeController.createStore);

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Get the authenticated seller's store
 *     description: Returns the seller's store including associated categories and market info.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Store'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/", storeController.getUserStore);

/**
 * @swagger
 * /stores:
 *   patch:
 *     summary: Update the authenticated seller's store
 *     description: All fields are optional — only provided fields are updated.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStoreBody'
 *     responses:
 *       200:
 *         description: Store updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Store'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch("/", validate(updateStoreSchema), storeController.updateStore);

/**
 * @swagger
 * /stores/stats:
 *   get:
 *     summary: Get store dashboard statistics
 *     description: |
 *       Returns a summary of the seller's store performance, including:
 *       - Total orders by status
 *       - Revenue totals
 *       - Recent orders
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalOrders:     { type: integer }
 *                         pendingOrders:   { type: integer }
 *                         deliveredOrders: { type: integer }
 *                         totalRevenue:    { type: number }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/stats", storeController.getStats);

export default router;
