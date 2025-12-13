import express from "express";
import {
  getReferralDashboard,
  getMyReferrals,
  claimRewards,
  getRewardHistory,
  generateDailyReward,
  getRewardConfig,
  updateRewardConfig,
  getReferralStatistics,
} from "../controllers/referralReward";
import {
  protectFrontend,
  protectDashboard,
  restrictTo,
} from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Referrals & Rewards
 *   description: Referral and reward management
 */

/**
 * @swagger
 * /api/referrals/dashboard:
 *   get:
 *     summary: Get referral and rewards dashboard (Frontend User)
 *     tags: [Referrals & Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     myReferralCode:
 *                       type: string
 *                     referralCount:
 *                       type: number
 *                     todayRewards:
 *                       type: number
 *                     yesterdayRewards:
 *                       type: number
 *                     availableCashRewards:
 *                       type: number
 *                     balance:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/dashboard", protectFrontend, getReferralDashboard);

/**
 * @swagger
 * /api/referrals/my-referrals:
 *   get:
 *     summary: Get list of users referred by me (Frontend User)
 *     tags: [Referrals & Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of referred users
 *       401:
 *         description: Unauthorized
 */
router.get("/my-referrals", protectFrontend, getMyReferrals);

/**
 * @swagger
 * /api/referrals/claim-rewards:
 *   post:
 *     summary: Claim available rewards and add to balance (Frontend User)
 *     tags: [Referrals & Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rewards claimed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     claimedAmount:
 *                       type: number
 *                     newBalance:
 *                       type: number
 *                     rewardsClaimed:
 *                       type: number
 *       400:
 *         description: No rewards available or below minimum claim amount
 *       401:
 *         description: Unauthorized
 */
router.post("/claim-rewards", protectFrontend, claimRewards);

/**
 * @swagger
 * /api/referrals/reward-history:
 *   get:
 *     summary: Get reward history (Frontend User)
 *     tags: [Referrals & Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reward history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/reward-history", protectFrontend, getRewardHistory);

/**
 * @swagger
 * /api/referrals/admin/generate-daily-reward:
 *   post:
 *     summary: Generate daily reward for a user (Admin only)
 *     tags: [Referrals & Rewards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Frontend user ID
 *     responses:
 *       201:
 *         description: Daily reward generated successfully
 *       400:
 *         description: Reward already generated for today
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: User not found
 */
router.post(
  "/admin/generate-daily-reward",
  protectDashboard,
  restrictTo("admin"),
  generateDailyReward
);

/**
 * @swagger
 * /api/referrals/admin/config:
 *   get:
 *     summary: Get reward configuration (Admin only)
 *     tags: [Referrals & Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reward configuration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  "/admin/config",
  protectDashboard,
  restrictTo("admin"),
  getRewardConfig
);

/**
 * @swagger
 * /api/referrals/admin/config:
 *   put:
 *     summary: Update reward configuration (Admin only)
 *     tags: [Referrals & Rewards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dailyRewardAmount:
 *                 type: number
 *                 description: Amount for daily rewards
 *                 example: 10
 *               referralBonusAmount:
 *                 type: number
 *                 description: Bonus amount for referrals
 *                 example: 50
 *               minimumClaimAmount:
 *                 type: number
 *                 description: Minimum amount required to claim rewards
 *                 example: 10
 *               isActive:
 *                 type: boolean
 *                 description: Enable/disable reward system
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put(
  "/admin/config",
  protectDashboard,
  restrictTo("admin"),
  updateRewardConfig
);

/**
 * @swagger
 * /api/referrals/admin/statistics:
 *   get:
 *     summary: Get referral and reward statistics (Admin only)
 *     tags: [Referrals & Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get(
  "/admin/statistics",
  protectDashboard,
  restrictTo("admin"),
  getReferralStatistics
);

export default router;
