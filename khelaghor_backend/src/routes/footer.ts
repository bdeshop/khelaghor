import express from "express";
import {
  getFooter,
  upsertFooter,
  deleteFooter,
  uploadIcon,
} from "../controllers/footerController";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

/**
 * @swagger
 * /api/footer:
 *   get:
 *     summary: Get footer data (Public)
 *     tags: [Footer]
 *     responses:
 *       200:
 *         description: Footer data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 success:
 *                   type: boolean
 *                 footer:
 *                   type: array
 *                   properties:
 *                     socialLinks:
 *                       type: array
 *                       items:
 *                         type: array
 *                         properties:
 *                           platform:
 *                             type: string
 *                           icon:
 *                             type: string
 *                           url:
 *                             type: string
 *                     quickLinks:
 *                       type: array
 *                       items:
 *                         type: array
 *                         properties:
 *                           title:
 *                             type: string
 *                           url:
 *                             type: string
 *                     responsibleGaming:
 *                       type: array
 *                     gamingLicenses:
 *                       type: array
 *                     brandPartners:
 *                       type: array
 *                     logo:
 *                       type: string
 *                     copyrightText:
 *                       type: string
 *                     descriptionSection:
 *                       type: array
 *       404:
 *         description: Footer not found
 *       500:
 *         description: Server error
 */
router.get("/", getFooter);

/**
 * @swagger
 * /api/footer:
 *   put:
 *     summary: Create or Update footer - Only one footer exists (Admin only)
 *     tags: [Footer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: array
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Footer logo image file (optional)
 *               socialLinks:
 *                 type: string
 *                 example: '[{"platform":"Facebook","url":"https://facebook.com"}]'
 *                 description: JSON string of social links (icons uploaded separately)
 *               quickLinks:
 *                 type: string
 *                 example: '[{"title":"About Us","url":"/about"}]'
 *                 description: JSON string of quick links
 *               responsibleGaming:
 *                 type: string
 *                 example: '[{"title":"18+"}]'
 *                 description: JSON string of responsible gaming items
 *               gamingLicenses:
 *                 type: string
 *                 example: '[{"name":"Curaçao Gaming"}]'
 *                 description: JSON string of gaming licenses
 *               brandPartners:
 *                 type: string
 *                 example: '[{"name":"Partner 1","logo":"/uploads/p1.png"},{"name":"Partner 2","logo":"/uploads/p2.png"}]'
 *                 description: JSON string of brand partner
 *               copyrightText:
 *                 type: string
 *                 example: © 2024 Khelaghor. All rights reserved.
 *               descriptionSection:
 *                 type: string
 *                 example: '{"title":"About","content":"Description text"}'
 *                 description: JSON string of description section
 *     responses:
 *       200:
 *         description: Footer updated successfully
 *       201:
 *         description: Footer created successfully (first time only)
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.put(
  "/",
  protectDashboard,
  restrictTo("admin"),
  upload.single("logo"),
  upsertFooter
);

/**
 * @swagger
 * /api/footer/upload-icon:
 *   post:
 *     summary: Upload icon/image for footer (Admin only)
 *     tags: [Footer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: array
 *             required:
 *               - icon
 *             properties:
 *               icon:
 *                 type: string
 *                 format: binary
 *                 description: Icon/image file to upload
 *     responses:
 *       200:
 *         description: Icon uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 success:
 *                   type: boolean
 *                 url:
 *                   type: string
 *                   example: /uploads/icon-123456.png
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Not authorized
 */
router.post(
  "/upload-icon",
  protectDashboard,
  restrictTo("admin"),
  upload.single("icon"),
  uploadIcon
);

/**
 * @swagger
 * /api/footer:
 *   delete:
 *     summary: Delete footer (Admin only)
 *     tags: [Footer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Footer deleted successfully
 *       404:
 *         description: Footer not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete("/", protectDashboard, restrictTo("admin"), deleteFooter);

export default router;

