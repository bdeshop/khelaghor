import express from "express";
import {
  createDepositTransaction,
  getMyDepositTransactions,
  getMyDepositTransaction,
  getAllDepositTransactions,
  getDepositTransactionById,
  updateDepositTransactionStatus,
  getDepositStatistics,
} from "../controllers/depositTransaction";
import {
  protectFrontend,
  protectDashboard,
  restrictTo,
} from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Deposit Transactions
 *   description: Deposit transaction management for users and admins
 */

/**
 * @swagger
 * /api/deposit-transactions:
 *   post:
 *     summary: Create a new deposit transaction (Frontend User)
 *     tags: [Deposit Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - depositMethodId
 *               - transactionId
 *               - amount
 *             properties:
 *               depositMethodId:
 *                 type: string
 *                 description: ID of the deposit method
 *                 example: "65abc123def456..."
 *               transactionId:
 *                 type: string
 *                 description: Unique transaction ID from payment gateway
 *                 example: "BKH123456789"
 *               amount:
 *                 type: number
 *                 description: Deposit amount (must be greater than 0)
 *                 example: 1000
 *               userInputData:
 *                 type: object
 *                 description: Additional user input data based on deposit method
 *                 example: { "sender_number": "01798765432" }
 *     responses:
 *       201:
 *         description: Deposit transaction created successfully
 *       400:
 *         description: Invalid input or duplicate transaction ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Deposit method not found
 *       500:
 *         description: Server error
 */
router.post("/", protectFrontend, createDepositTransaction);

/**
 * @swagger
 * /api/deposit-transactions/my-transactions:
 *   get:
 *     summary: Get user's own deposit transactions (Frontend User)
 *     tags: [Deposit Transactions]
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
 *         description: List of user's deposit transactions
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/my-transactions", protectFrontend, getMyDepositTransactions);

/**
 * @swagger
 * /api/deposit-transactions/{id}:
 *   get:
 *     summary: Get single deposit transaction (Frontend User - own only)
 *     tags: [Deposit Transactions]
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
router.get("/:id", protectFrontend, getMyDepositTransaction);

/**
 * @swagger
 * /api/deposit-transactions/admin/all:
 *   get:
 *     summary: Get all deposit transactions (Admin only)
 *     tags: [Deposit Transactions]
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
 *         name: depositMethodId
 *         schema:
 *           type: string
 *         description: Filter by deposit method ID
 *     responses:
 *       200:
 *         description: List of all deposit transactions
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
  getAllDepositTransactions
);

/**
 * @swagger
 * /api/deposit-transactions/admin/statistics:
 *   get:
 *     summary: Get deposit transaction statistics (Admin only)
 *     tags: [Deposit Transactions]
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
 *                     totalApprovedAmount:
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
  getDepositStatistics
);

/**
 * @swagger
 * /api/deposit-transactions/admin/{id}:
 *   get:
 *     summary: Get single deposit transaction (Admin only)
 *     tags: [Deposit Transactions]
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
  getDepositTransactionById
);

/**
 * @swagger
 * /api/deposit-transactions/admin/{id}:
 *   put:
 *     summary: Update deposit transaction status - Approve or Cancel (Admin only)
 *     tags: [Deposit Transactions]
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
 *                 description: New status (approved adds balance to user)
 *                 example: "approved"
 *               adminNote:
 *                 type: string
 *                 description: Admin's note about the transaction
 *                 example: "Verified and approved"
 *     responses:
 *       200:
 *         description: Transaction status updated successfully (balance updated if approved)
 *       400:
 *         description: Invalid status or transaction already processed
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
  updateDepositTransactionStatus
);

export default router;
