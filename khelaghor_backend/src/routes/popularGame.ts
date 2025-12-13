import express from "express";
import {
  getPopularGames,
  getAllPopularGames,
  getPopularGame,
  createPopularGame,
  updatePopularGame,
  deletePopularGame,
} from "../controllers/popularGameController";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

/**
 * @swagger
 * /api/popular-games:
 *   get:
 *     summary: Get all active popular games (Public)
 *     tags: [Popular Games]
 *     responses:
 *       200:
 *         description: Popular games retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 games:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       image:
 *                         type: string
 *                       title:
 *                         type: string
 *                       redirectUrl:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       order:
 *                         type: number
 *       500:
 *         description: Server error
 */
router.get("/", getPopularGames);

/**
 * @swagger
 * /api/popular-games/admin:
 *   get:
 *     summary: Get all popular games including inactive (Admin only)
 *     tags: [Popular Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Popular games retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/admin", protectDashboard, restrictTo("admin"), getAllPopularGames);

/**
 * @swagger
 * /api/popular-games/admin/{id}:
 *   get:
 *     summary: Get single popular game (Admin only)
 *     tags: [Popular Games]
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
 *         description: Popular game retrieved successfully
 *       404:
 *         description: Popular game not found
 */
router.get("/admin/:id", protectDashboard, restrictTo("admin"), getPopularGame);

/**
 * @swagger
 * /api/popular-games:
 *   post:
 *     summary: Create new popular game (Admin only)
 *     tags: [Popular Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - title
 *               - redirectUrl
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg, jpg, png, gif, webp)
 *               title:
 *                 type: string
 *                 example: Poker Game
 *               redirectUrl:
 *                 type: string
 *                 example: https://example.com/poker
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               order:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Popular game created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */
router.post(
  "/",
  protectDashboard,
  restrictTo("admin"),
  upload.single("image"),
  createPopularGame
);

/**
 * @swagger
 * /api/popular-games/{id}:
 *   put:
 *     summary: Update popular game (Admin only)
 *     tags: [Popular Games]
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
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (optional)
 *               title:
 *                 type: string
 *               redirectUrl:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Popular game updated successfully
 *       404:
 *         description: Popular game not found
 */
router.put(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  upload.single("image"),
  updatePopularGame
);

/**
 * @swagger
 * /api/popular-games/{id}:
 *   delete:
 *     summary: Delete popular game (Admin only)
 *     tags: [Popular Games]
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
 *         description: Popular game deleted successfully
 *       404:
 *         description: Popular game not found
 */
router.delete("/:id", protectDashboard, restrictTo("admin"), deletePopularGame);

export default router;
