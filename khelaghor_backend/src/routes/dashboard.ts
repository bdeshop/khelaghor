import express from "express";
import {
  getDashboardMe,
  getUserBalance,
  getAllUsersBalances,
} from "../controllers/dashboardController";
import { protectDashboard, restrictTo } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/me:
 *   get:
 *     summary: Get logged in dashboard user info
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard user info retrieved successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
router.get("/me", protectDashboard, getDashboardMe);

/**
 * @swagger
 * /api/dashboard/users/balances:
 *   get:
 *     summary: Get all users' balances (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users balances retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 totalBalance:
 *                   type: number
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userName:
 *                         type: string
 *                       phone:
 *                         type: number
 *                       email:
 *                         type: string
 *                       balance:
 *                         type: number
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  "/users/balances",
  protectDashboard,
  restrictTo("admin"),
  getAllUsersBalances
);

/**
 * @swagger
 * /api/dashboard/users/{userId}/balance:
 *   get:
 *     summary: Get specific user's balance (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Frontend User ID
 *     responses:
 *       200:
 *         description: User balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     phone:
 *                       type: number
 *                     balance:
 *                       type: number
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 */
router.get(
  "/users/:userId/balance",
  protectDashboard,
  restrictTo("admin"),
  getUserBalance
);

export default router;
