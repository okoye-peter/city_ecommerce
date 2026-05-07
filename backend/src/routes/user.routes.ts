import { authenticate } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { verifyUserIdentitySchema } from "@/validators/user.validator";
import { Router } from "express";
import * as userController from '../controllers/user.controller';


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and identity verification
 */

router.use(authenticate);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/profile', userController.getUserProfile);

/**
 * @swagger
 * /users/verify-identity:
 *   post:
 *     summary: Submit identity verification document
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyIdentityBody'
 *     responses:
 *       200:
 *         description: Identity verified successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/verify-identity', validate(verifyUserIdentitySchema), userController.verifyUserIdentity);

router.patch('/account-status', userController.toggleUserStatus);

export default router;