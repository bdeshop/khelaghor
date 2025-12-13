import express from "express";
import {
  createOrUpdateAppVersion,
  getAppVersion,
  deleteAppVersion,
} from "../controllers/appVersionController";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { uploadApk } from "../middleware/upload";

const router = express.Router();

/**
 * @swagger
 * /api/app-version:
 *   get:
 *     summary: Get current app version (Public)
 *     tags: [App Version]
 *     responses:
 *       200:
 *         description: App version retrieved successfully
 *       404:
 *         description: No app version found
 */
router.get("/", getAppVersion);

/**
 * @swagger
 * /api/app-version:
 *   put:
 *     summary: Create or update app version (Admin only)
 *     tags: [App Version]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - version
 *             properties:
 *               version:
 *                 type: string
 *                 example: "1.0.0"
 *               apkFile:
 *                 type: string
 *                 format: binary
 *                 description: APK file to upload (either this or apkUrl)
 *               apkUrl:
 *                 type: string
 *                 example: "https://example.com/app.apk"
 *                 description: APK URL (either this or apkFile)
 *               fileSize:
 *                 type: string
 *                 example: "25 MB"
 *               releaseNotes:
 *                 type: string
 *                 example: "Bug fixes and performance improvements"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: App version updated successfully
 *       201:
 *         description: App version created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put(
  "/",
  protectDashboard,
  restrictTo("admin"),
  uploadApk.single("apkFile"),
  createOrUpdateAppVersion
);

/**
 * @swagger
 * /api/app-version:
 *   delete:
 *     summary: Delete app version (Admin only)
 *     tags: [App Version]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: App version deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: App version not found
 */
router.delete("/", protectDashboard, restrictTo("admin"), deleteAppVersion);

export default router;
