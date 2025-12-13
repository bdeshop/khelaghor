import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController";
import { protectDashboard, restrictTo } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get application settings (Public)
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 settings:
 *                   type: object
 *                   properties:
 *                     telegram:
 *                       type: string
 *                     email:
 *                       type: string
 *                     bannerTextEnglish:
 *                       type: string
 *                     bannerTextBangla:
 *                       type: string
 *       500:
 *         description: Server error
 */
router.get("/", getSettings);

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update application settings (Admin only)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telegram:
 *                 type: string
 *                 example: "@khelaghor"
 *               email:
 *                 type: string
 *                 example: support@khelaghor.com
 *               bannerTextEnglish:
 *                 type: string
 *                 example: "Welcome to Khelaghor"
 *               bannerTextBangla:
 *                 type: string
 *                 example: "খেলাঘরে স্বাগতম"
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       201:
 *         description: Settings created successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.put("/", protectDashboard, restrictTo("admin"), updateSettings);

export default router;
