import express from "express";
import {
  createWithdrawTransaction,
  getMyWithdrawTransactions,
  getMyWithdrawTransaction,
  getAllWithdrawTransactions,
  getWithdrawTransactionById,
  updateWithdrawTransactionStatus,
  getWithdrawStatistics,
} from "../controllers/withdrawTransaction";
import {
  protectFrontend,
  protectDashboard,
  restrictTo,
} from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Withdraw Transactions
 *   description: Withdraw transaction management for users and admins
 */

/**
 * @swagger
 * /api/withdraw-transactions:
 *   post:
 *     summary: Create a new withdraw transaction (Frontend User)
 *     tags: [Withdraw Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - withdrawMethodId
 *               - amount
 *             properties:
 *               withdrawMethodId:
 *                 type: string
 *                 description: ID of the withdraw method
 *                 example: "65abc123def456..."
 *               amount:
 *                 type: number
 *                 description: Withdrawal amount (must be within min/max limits)
 *                 example: 1000
 *               userInputData:
 *                 type: object
 *                 description: Additional user input data (account number, etc.)
 *                 example: { "account_number": "01712345678", "account_name": "John Doe" }
 *     responses:
 *       201:
 *         description: Withdraw transaction created successfully
 *       400:
 *         description: Invalid input, insufficient balance, or amount out of limits
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Withdraw method not found
 *       500:
 *         description: Server error
 */
router.post("/", protectFrontend, createWithdrawTransaction);

/**
 * @swagger
 * /api/withdraw-transactions/my-transactions:
 *   get:
 *     summary: Get user's own withdraw transactions (Frontend User)
 *     tags: [Withdraw Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, cancelled]
 *         description: Filter by transaction status
 *     responses:
 *       200:
 *         description: List of user's withdraw transactions
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/my-transactions", protectFrontend, getMyWithdrawTransactions);

/**
 * @swagger
 * /api/withdraw-transactions/{id}:
 *   get:
 *     summary: Get single withdraw transaction (Frontend User - own only)
 *     tags: [Withdraw Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.get("/:id", protectFrontend, getMyWithdrawTransaction);

/**
 * @swagger
 * /api/withdraw-transactions/admin/all:
 *   get:
 *     summary: Get all withdraw transactions (Admin only)
 *     tags: [Withdraw Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, cancelled]
 *         description: Filter by transaction status
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: withdrawMethodId
 *         schema:
 *           type: string
 *         description: Filter by withdraw method ID
 *     responses:
 *       200:
 *         description: List of all withdraw transactions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.get(
  "/admin/all",
  protectDashboard,
  restrictTo("admin"),
  getAllWithdrawTransactions
);

/**
 * @swagger
 * /api/withdraw-transactions/admin/statistics:
 *   get:
 *     summary: Get withdraw transaction statistics (Admin only)
 *     tags: [Withdraw Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     totalPending:
 *                       type: number
 *                     totalApproved:
 *                       type: number
 *                     totalCancelled:
 *                       type: number
 *                     totalWithdrawnAmount:
 *                       type: number
 *                     totalFeesCollected:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.get(
  "/admin/statistics",
  protectDashboard,
  restrictTo("admin"),
  getWithdrawStatistics
);

/**
 * @swagger
 * /api/withdraw-transactions/admin/{id}:
 *   get:
 *     summary: Get single withdraw transaction (Admin only)
 *     tags: [Withdraw Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.get(
  "/admin/:id",
  protectDashboard,
  restrictTo("admin"),
  getWithdrawTransactionById
);

/**
 * @swagger
 * /api/withdraw-transactions/admin/{id}:
 *   put:
 *     summary: Update withdraw transaction status - Approve or Cancel (Admin only)
 *     tags: [Withdraw Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, cancelled]
 *                 description: New status (approved deducts balance from user)
 *                 example: "approved"
 *               adminNote:
 *                 type: string
 *                 description: Admin's note about the transaction
 *                 example: "Payment sent successfully"
 *     responses:
 *       200:
 *         description: Transaction status updated successfully (balance deducted if approved)
 *       400:
 *         description: Invalid status, transaction already processed, or insufficient balance
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Transaction or user not found
 *       500:
 *         description: Server error
 */
router.put(
  "/admin/:id",
  protectDashboard,
  restrictTo("admin"),
  updateWithdrawTransactionStatus
);

export default router;
