import express from "express";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  createPromotion,
  getAllPromotionsAdmin,
  getPromotionAdmin,
  updatePromotion,
  deletePromotion,
  getAllPromotions,
  getPromotion,
} from "../controllers/promotionController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Promotion management
 */

// Admin routes must come BEFORE public /:id route to avoid conflicts

/**
 * @swagger
 * /api/promotions/admin:
 *   post:
 *     summary: Create a new promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - promotionImage
 *               - title
 *               - description
 *               - gameType
 *             properties:
 *               promotionImage:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               titleBn:
 *                 type: string
 *               description:
 *                 type: string
 *               descriptionBn:
 *                 type: string
 *               gameType:
 *                 type: string
 *                 description: Game category ID from /api/game-categories
 *               paymentMethods:
 *                 type: string
 *                 description: JSON array of deposit method IDs from /api/deposit-methods/active
 *               bonusSettings:
 *                 type: string
 *                 description: 'JSON object - Fixed: {"bonusType":"fixed","bonusAmount":100,"minDepositAmount":50} OR Percentage: {"bonusType":"percentage","bonusPercentage":10,"maxBonusAmount":500,"minDepositAmount":100}'
 *     responses:
 *       201:
 *         description: Promotion created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/admin",
  protectDashboard,
  restrictTo("admin"),
  upload.single("promotionImage"),
  createPromotion
);

/**
 * @swagger
 * /api/promotions/admin:
 *   get:
 *     summary: Get all promotions (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all promotions
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/admin",
  protectDashboard,
  restrictTo("admin"),
  getAllPromotionsAdmin
);

/**
 * @swagger
 * /api/promotions/admin/{id}:
 *   get:
 *     summary: Get a single promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: Promotion details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Server error
 */
router.get(
  "/admin/:id",
  protectDashboard,
  restrictTo("admin"),
  getPromotionAdmin
);

/**
 * @swagger
 * /api/promotions/admin/{id}:
 *   put:
 *     summary: Update a promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               promotionImage:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               titleBn:
 *                 type: string
 *               description:
 *                 type: string
 *               descriptionBn:
 *                 type: string
 *               gameType:
 *                 type: string
 *                 description: Game category ID
 *               paymentMethods:
 *                 type: string
 *                 description: JSON array of deposit method IDs
 *               bonusSettings:
 *                 type: string
 *                 description: 'JSON object - Fixed: {"bonusType":"fixed","bonusAmount":100,"minDepositAmount":50} OR Percentage: {"bonusType":"percentage","bonusPercentage":10,"maxBonusAmount":500,"minDepositAmount":100}'
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Server error
 */
router.put(
  "/admin/:id",
  protectDashboard,
  restrictTo("admin"),
  upload.single("promotionImage"),
  updatePromotion
);

/**
 * @swagger
 * /api/promotions/admin/{id}:
 *   delete:
 *     summary: Delete a promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: Promotion deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/admin/:id",
  protectDashboard,
  restrictTo("admin"),
  deletePromotion
);

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Get all promotions (Public)
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of all promotions
 *       500:
 *         description: Server error
 */
router.get("/", getAllPromotions);

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Get a single promotion (Public)
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: Promotion details
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getPromotion);

export default router;
