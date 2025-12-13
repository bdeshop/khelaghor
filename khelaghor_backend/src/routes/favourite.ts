import express from "express";
import {
  getFavourites,
  getAllFavourites,
  createFavourite,
  updateFavourite,
  deleteFavourite,
  getFavourite,
} from "../controllers/favouriteController";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

/**
 * @swagger
 * /api/favourites:
 *   get:
 *     summary: Get all active favourites (Public)
 *     tags: [Favourites]
 *     responses:
 *       200:
 *         description: Favourites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 favourites:
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
 *                       actionType:
 *                         type: string
 *                         enum: [url, modal]
 *                       url:
 *                         type: string
 *                       modalOptions:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       order:
 *                         type: number
 *       500:
 *         description: Server error
 */
router.get("/", getFavourites);

/**
 * @swagger
 * /api/favourites/admin:
 *   get:
 *     summary: Get all favourites including inactive (Admin only)
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favourites retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/admin", protectDashboard, restrictTo("admin"), getAllFavourites);

/**
 * @swagger
 * /api/favourites/admin/{id}:
 *   get:
 *     summary: Get single favourite (Admin only)
 *     tags: [Favourites]
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
 *         description: Favourite retrieved successfully
 *       404:
 *         description: Favourite not found
 */
router.get("/admin/:id", protectDashboard, restrictTo("admin"), getFavourite);

/**
 * @swagger
 * /api/favourites:
 *   post:
 *     summary: Create new favourite (Admin only)
 *     tags: [Favourites]
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
 *               - actionType
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg, jpg, png, gif, webp)
 *               title:
 *                 type: string
 *                 example: My Favourite
 *               actionType:
 *                 type: string
 *                 enum: [url, modal]
 *                 example: url
 *               url:
 *                 type: string
 *                 example: https://example.com
 *                 description: Required if actionType is url
 *               modalOptions:
 *                 type: string
 *                 example: Option 1, Option 2, Option 3
 *                 description: Required if actionType is modal
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               order:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Favourite created successfully
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
  createFavourite
);

/**
 * @swagger
 * /api/favourites/{id}:
 *   put:
 *     summary: Update favourite (Admin only)
 *     tags: [Favourites]
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
 *               actionType:
 *                 type: string
 *                 enum: [url, modal]
 *               url:
 *                 type: string
 *               modalOptions:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Favourite updated successfully
 *       404:
 *         description: Favourite not found
 */
router.put(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  upload.single("image"),
  updateFavourite
);

/**
 * @swagger
 * /api/favourites/{id}:
 *   delete:
 *     summary: Delete favourite (Admin only)
 *     tags: [Favourites]
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
 *         description: Favourite deleted successfully
 *       404:
 *         description: Favourite not found
 */
router.delete("/:id", protectDashboard, restrictTo("admin"), deleteFavourite);

export default router;
