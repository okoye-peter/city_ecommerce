import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { productSchema } from "@/validators/product.validator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product catalogue — read access for all authenticated users, write access for Sellers only
 */

router.use(authenticate);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a paginated list of products
 *     description: Returns products across all stores. Filter by store or search by name.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Filter by product name (case-insensitive, partial match)
 *       - in: query
 *         name: storeId
 *         schema: { type: string }
 *         description: Filter to a specific store's products
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *         description: Sort order by createdAt
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                         $ref: '#/components/schemas/Product'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", productController.getPaginatedProducts);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get a single product's details
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:productId", productController.getProductDetails);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a product (Seller only)
 *     description: Creates a product under the authenticated seller's store.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductBody'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post("/", authorize(Role.SELLER), validate(productSchema), productController.createProduct);

/**
 * @swagger
 * /products/{productId}:
 *   patch:
 *     summary: Update a product (Seller only)
 *     description: Partially updates a product. Only the owning seller can update their products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductBody'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch("/:productId", authorize(Role.SELLER), validate(productSchema.partial()), productController.updateProduct);

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Delete a product (Seller only)
 *     description: Only the owning seller can delete their product.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:productId", authorize(Role.SELLER), productController.deleteProduct);

router.get("/popular", authorize(Role.BUYER), productController.getFeaturedProducts);

export default router;
