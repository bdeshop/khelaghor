import express from "express";
import {
  getGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
} from "../controllers/gameController";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Get all games (Public)
 *     tags: [Games]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: Games retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", getGames);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Get single game (Public)
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game retrieved successfully
 *       404:
 *         description: Game not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getGame);

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Create game (Admin only)
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *               - url
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               url:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: Category ID
 *     responses:
 *       201:
 *         description: Game created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  protectDashboard,
  restrictTo("admin"),
  upload.single("image"),
  createGame
);

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Update game (Admin only)
 *     tags: [Games]
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
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               url:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: Category ID
 *     responses:
 *       200:
 *         description: Game updated successfully
 *       404:
 *         description: Game or category not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  upload.single("image"),
  updateGame
);

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Delete game (Admin only)
 *     tags: [Games]
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
 *         description: Game deleted successfully
 *       404:
 *         description: Game not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", protectDashboard, restrictTo("admin"), deleteGame);

export default router;
