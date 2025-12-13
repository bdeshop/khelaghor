import express from "express";
import {
  uploadBanner,
  getAllBannersAdmin,
  updateBanner,
  deleteBanner,
  getActiveBanners,
} from "../controllers/bannerController";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

/**
 * @swagger
 * /api/banners/active:
 *   get:
 *     summary: Get all active banners (Public)
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Active banners retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/active", getActiveBanners);

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Get all banners (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Banners retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/", protectDashboard, restrictTo("admin"), getAllBannersAdmin);

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Upload a new banner (Admin only)
 *     tags: [Banners]
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: Summer Sale Banner
 *               image:
 *                 type: string
 *                 format: binary
 *               textEnglish:
 *                 type: string
 *                 example: Welcome to our summer sale!
 *               textBangla:
 *                 type: string
 *                 example: আমাদের গ্রীষ্মকালীন বিক্রয়ে স্বাগতম!
 *               order:
 *                 type: number
 *                 example: 1
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Banner uploaded successfully
 *       400:
 *         description: No image uploaded
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post(
  "/",
  protectDashboard,
  restrictTo("admin"),
  upload.single("image"),
  uploadBanner
);

/**
 * @swagger
 * /api/banners/{id}:
 *   put:
 *     summary: Update a banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     requestBody:
 *       required: false
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
 *               textEnglish:
 *                 type: string
 *                 example: Welcome to our summer sale!
 *               textBangla:
 *                 type: string
 *                 example: আমাদের গ্রীষ্মকালীন বিক্রয়ে স্বাগতম!
 *               order:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       404:
 *         description: Banner not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  upload.single("image"),
  updateBanner
);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     summary: Delete a banner (Admin only)
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete("/:id", protectDashboard, restrictTo("admin"), deleteBanner);

export default router;
