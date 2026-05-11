import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";
import * as categoryController from '../controllers/category.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Product category listing
 */

router.use(authenticate);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all product categories
 *     description: Returns the full list of categories that can be assigned to products or stores.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', categoryController.getCategories);

export default router;
