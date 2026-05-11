import { Router } from 'express';
import * as bankController from '../controllers/bank.controller';
import { authenticate, authorize } from '@/middlewares/auth.middleware';
import { Role } from '@prisma/client';
import { bankAccountSchema } from '@/validators/bank.validator';
import { validate } from '@/middlewares/validate.middleware';


const router = Router();

router.use(authenticate);

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
router.get('/', bankController.getBanks);


router.use(authorize(Role.SELLER));

router.get('/user-accounts', bankController.getUserBanks);
router.post('/user-accounts', validate(bankAccountSchema), bankController.createUserBankAccount);
router.patch('/user-accounts/:accountBankId', validate(bankAccountSchema), bankController.updateUserBankAccount);
router.delete('/user-accounts/:accountBankId', bankController.deleteUserBankAccount);



export default router;