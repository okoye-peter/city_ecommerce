import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import * as walletController from '@/controllers/wallet.controller';
import { validate } from '@/middlewares/validate.middleware';
import { withdrawalSchema } from '@/validators/wallet.validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Wallets
 *   description: Wallet balance and transaction management (Sellers & Buyers)
 */

router.use(authenticate);
router.use(authorize(Role.BUYER, Role.SELLER));

/**
 * @swagger
 * /wallets:
 *   get:
 *     summary: Get the authenticated user's wallet
 *     description: |
 *       - **Sellers** receive `availableBalance` (ready to withdraw) and `escrowBalance` (held pending 72-hour release).
 *       - **Buyers** receive `creditBalance` (store credit from refunds on declined orders).
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/SellerWallet'
 *                         - $ref: '#/components/schemas/BuyerWallet'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', walletController.getUserWallet);

/**
 * @swagger
 * /wallets/transactions:
 *   get:
 *     summary: Get paginated wallet transaction history
 *     description: |
 *       Returns transactions for the authenticated user's wallet.
 *       - Seller transaction types: `ESCROW_CREDIT`, `ESCROW_RELEASE`, `WITHDRAWAL`
 *       - Buyer transaction types: `PURCHASE_DEDUCTION`, `REFUND`
 *       - Withdrawal transactions include a `status` field and linked `userBank`.
 *     tags: [Wallets]
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
 *         name: from
 *         schema: { type: string, format: date-time }
 *         description: Filter transactions from this date (ISO 8601)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *         description: Filter transactions up to this date (ISO 8601)
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
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
 *                         $ref: '#/components/schemas/SellerTransaction'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/transactions', walletController.walletTransactions);

/**
 * @swagger
 * /wallets/withdrawal:
 *   post:
 *     summary: Initiate a withdrawal to a saved bank account
 *     description: |
 *       Deducts `amount` from the seller's `availableBalance` and records a
 *       `WITHDRAWAL` transaction (status `COMPLETED`). The seller must have
 *       sufficient available balance and a valid saved bank account.
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WithdrawalBody'
 *     responses:
 *       200:
 *         description: Withdrawal processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SellerTransaction'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/withdrawal', validate(withdrawalSchema), walletController.initiateWithdrawal);

export default router;
