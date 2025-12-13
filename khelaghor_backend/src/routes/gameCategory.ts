import express from "express";
import {
  getGameCategories,
  getGameCategory,
  createGameCategory,
  updateGameCategory,
  deleteGameCategory,
} from "../controllers/gameCategoryController";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

/**
 * @swagger
 * /api/game-categories:
 *   get:
 *     summary: Get all game categories (Public)
 *     tags: [Game Categories]
 *     responses:
 *       200:
 *         description: Game categories retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", getGameCategories);

/**
 * @swagger
 * /api/game-categories/{id}:
 *   get:
 *     summary: Get single game category (Public)
 *     tags: [Game Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game category retrieved successfully
 *       404:
 *         description: Game category not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getGameCategory);

/**
 * @swagger
 * /api/game-categories:
 *   post:
 *     summary: Create game category (Admin only)
 *     tags: [Game Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Game category created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  protectDashboard,
  restrictTo("admin"),
  upload.single("icon"),
  createGameCategory
);

/**
 * @swagger
 * /api/game-categories/{id}:
 *   put:
 *     summary: Update game category (Admin only)
 *     tags: [Game Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Game category updated successfully
 *       404:
 *         description: Game category not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  upload.single("icon"),
  updateGameCategory
);

/**
 * @swagger
 * /api/game-categories/{id}:
 *   delete:
 *     summary: Delete game category (Admin only)
 *     tags: [Game Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game category deleted successfully
 *       404:
 *         description: Game category not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  deleteGameCategory
);

export default router;
