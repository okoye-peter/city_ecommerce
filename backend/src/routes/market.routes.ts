
import { Router } from 'express';
import * as marketController from '../controllers/market.controller';
import { authenticate } from '@/middlewares/auth.middleware';


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Markets
 *   description: Market listing
 */

/**
 * @swagger
 * /markets:
 *   get:
 *     summary: Get list of markets
 *     tags: [Markets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of markets
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
 *                           description: { type: string, nullable: true }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', authenticate, marketController.getMarkets);


router.get('/popular', authenticate, marketController.getTopMarkets);


export default router;