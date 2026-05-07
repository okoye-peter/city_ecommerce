import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getUploadSignature, deleteFile } from '../controllers/upload.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Cloudinary signed upload management
 */

router.use(authenticate);

/**
 * @swagger
 * /uploads/sign:
 *   get:
 *     summary: Get a signed upload signature for direct Cloudinary upload
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         required: false
 *         schema:
 *           type: string
 *           enum: [stores, products, avatars, identity]
 *           default: stores
 *         description: Cloudinary folder to upload into
 *     responses:
 *       200:
 *         description: Signed upload parameters
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UploadSignature'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/sign', getUploadSignature);

/**
 * @swagger
 * /uploads:
 *   delete:
 *     summary: Delete a file from Cloudinary
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [publicId]
 *             properties:
 *               publicId:
 *                 type: string
 *                 description: Cloudinary public ID of the file to delete
 *                 example: stores/my-store-image-xyz
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete('/', deleteFile);

export default router;
