import { Router } from 'express';
import * as bankController from '../controllers/bank.controller';
import { authenticate, authorize } from '@/middlewares/auth.middleware';
import { Role } from '@prisma/client';
import { bankAccountSchema } from '@/validators/bank.validator';
import { validate } from '@/middlewares/validate.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Banks
 *   description: Bank listing and seller bank account management
 */

router.use(authenticate);

/**
 * @swagger
 * /banks:
 *   get:
 *     summary: Get list of supported banks
 *     description: Returns all banks available for account linking (accessible to all authenticated users).
 *     tags: [Banks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Banks retrieved successfully
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
 *                         $ref: '#/components/schemas/Bank'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', bankController.getBanks);

router.use(authorize(Role.SELLER));

/**
 * @swagger
 * /banks/user-accounts:
 *   get:
 *     summary: Get the seller's saved bank accounts (Seller only)
 *     tags: [Banks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bank accounts retrieved successfully
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
 *                         $ref: '#/components/schemas/BankAccount'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/user-accounts', bankController.getUserBanks);

/**
 * @swagger
 * /banks/user-accounts:
 *   post:
 *     summary: Add a bank account (Seller only)
 *     description: |
 *       Saves a bank account to the seller's profile. Each seller can have multiple
 *       bank accounts but only one can be marked as `isSelected` at a time.
 *     tags: [Banks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankAccountBody'
 *     responses:
 *       201:
 *         description: Bank account added successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BankAccount'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post('/user-accounts', validate(bankAccountSchema), bankController.createUserBankAccount);

/**
 * @swagger
 * /banks/user-accounts/{accountBankId}:
 *   patch:
 *     summary: Update a saved bank account (Seller only)
 *     description: Update account details or mark the account as selected for withdrawals.
 *     tags: [Banks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountBankId
 *         required: true
 *         schema: { type: string }
 *         description: ID of the bank account to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankAccountBody'
 *     responses:
 *       200:
 *         description: Bank account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BankAccount'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/user-accounts/:accountBankId', validate(bankAccountSchema), bankController.updateUserBankAccount);

/**
 * @swagger
 * /banks/user-accounts/{accountBankId}:
 *   delete:
 *     summary: Remove a saved bank account (Seller only)
 *     tags: [Banks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountBankId
 *         required: true
 *         schema: { type: string }
 *         description: ID of the bank account to delete
 *     responses:
 *       200:
 *         description: Bank account removed successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/user-accounts/:accountBankId', bankController.deleteUserBankAccount);

export default router;