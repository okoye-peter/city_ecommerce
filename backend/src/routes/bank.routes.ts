import { Router } from 'express';
import * as bankController from '../controllers/bank.controller';
import { authenticate } from '@/middlewares/auth.middleware';


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Banks
 *   description: Bank listing
 */

/**
 * @swagger
 * /banks:
 *   get:
 *     summary: Get list of supported banks
 *     tags: [Banks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of banks
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
 *                         type: object
 *                         properties:
 *                           id: { type: integer }
 *                           name: { type: string }
 *                           code: { type: string }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', authenticate, bankController.getBanks);


export default router;