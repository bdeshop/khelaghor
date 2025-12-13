import express from "express";
import {
  getThemeConfig,
  updateThemeConfig,
  uploadLogo,
  uploadFavicon,
  resetThemeConfig,
} from "../controllers/themeConfigController";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ThemeConfig:
 *       type: object
 *       properties:
 *         brand:
 *           type: object
 *           properties:
 *             site_name:
 *               type: string
 *               example: "KhelaGhor"
 *             logo:
 *               type: string
 *               example: "/uploads/logo.png"
 *             favicon:
 *               type: string
 *               example: "/uploads/favicon.ico"
 *             logo_width:
 *               type: number
 *               example: 160
 *             logo_height:
 *               type: number
 *               example: 32
 *         colors:
 *           type: object
 *           properties:
 *             primary:
 *               type: string
 *               example: "#f7b500"
 *             secondary:
 *               type: string
 *               example: "#111111"
 *             accent:
 *               type: string
 *               example: "#db110f"
 *             background:
 *               type: object
 *               properties:
 *                 body:
 *                   type: string
 *                   example: "#0b0b0b"
 *                 section:
 *                   type: string
 *                   example: "#121212"
 *                 card:
 *                   type: string
 *                   example: "#1c1c1c"
 *             text:
 *               type: object
 *               properties:
 *                 heading:
 *                   type: string
 *                   example: "#ffffff"
 *                 body:
 *                   type: string
 *                   example: "#cccccc"
 *                 muted:
 *                   type: string
 *                   example: "#999999"
 *         header:
 *           type: object
 *           properties:
 *             background:
 *               type: string
 *               example: "#222222"
 *             height:
 *               type: number
 *               example: 56
 *             logo:
 *               type: object
 *               properties:
 *                 src:
 *                   type: string
 *                   example: "/uploads/logo.png"
 *                 height_mobile:
 *                   type: number
 *                   example: 24
 *                 height_desktop:
 *                   type: number
 *                   example: 32
 *             buttons:
 *               type: object
 *               properties:
 *                 login:
 *                   type: object
 *                   properties:
 *                     bg:
 *                       type: string
 *                       example: "linear-gradient(to bottom, #db110f, #750503)"
 *                     text:
 *                       type: string
 *                       example: "#ffffff"
 *                     hover_opacity:
 *                       type: number
 *                       example: 0.9
 *                 signup:
 *                   type: object
 *                   properties:
 *                     bg:
 *                       type: string
 *                     text:
 *                       type: string
 *                     hover_opacity:
 *                       type: number
 *                 deposit:
 *                   type: object
 *                   properties:
 *                     bg:
 *                       type: string
 *                     text:
 *                       type: string
 *                 wallet:
 *                   type: object
 *                   properties:
 *                     bg:
 *                       type: string
 *                     text:
 *                       type: string
 *                     balance_color:
 *                       type: string
 *             profile_menu:
 *               type: object
 *               properties:
 *                 bg:
 *                   type: string
 *                 hover_bg:
 *                   type: string
 *                 text:
 *                   type: string
 *                 icon_color:
 *                   type: string
 *                 vip_color:
 *                   type: string
 *         mobile_bar:
 *           type: object
 *           properties:
 *             background:
 *               type: string
 *             height:
 *               type: number
 *             buttons:
 *               type: object
 *         banner:
 *           type: object
 *           properties:
 *             nav_button:
 *               type: object
 *             indicator:
 *               type: object
 *             height:
 *               type: object
 *               properties:
 *                 mobile:
 *                   type: number
 *                 tablet:
 *                   type: number
 *                 desktop:
 *                   type: number
 *         popular_games:
 *           type: object
 *           properties:
 *             section_title:
 *               type: object
 *             card:
 *               type: object
 *         game_grid:
 *           type: object
 *           properties:
 *             card:
 *               type: object
 *         footer:
 *           type: object
 *           properties:
 *             background:
 *               type: string
 *             text_color:
 *               type: string
 *             muted_text:
 *               type: string
 *             heading_color:
 *               type: string
 *             link_hover_color:
 *               type: string
 *             divider_color:
 *               type: string
 *         modals:
 *           type: object
 *           properties:
 *             overlay_bg:
 *               type: string
 *             content_bg:
 *               type: string
 *             header_bg:
 *               type: string
 *             text_color:
 *               type: string
 *             border_color:
 *               type: string
 *             close_button:
 *               type: object
 *         sidebar:
 *           type: object
 *           properties:
 *             background:
 *               type: string
 *             item_bg:
 *               type: string
 *             item_hover_bg:
 *               type: string
 *             item_active_bg:
 *               type: string
 *             text_color:
 *               type: string
 *             text_active_color:
 *               type: string
 *             icon_color:
 *               type: string
 *             icon_active_color:
 *               type: string
 *             divider_color:
 *               type: string
 *         buttons:
 *           type: object
 *           properties:
 *             radius:
 *               type: number
 *             primary:
 *               type: object
 *             danger:
 *               type: object
 *             secondary:
 *               type: object
 *         typography:
 *           type: object
 *           properties:
 *             font_family:
 *               type: object
 *               properties:
 *                 primary:
 *                   type: string
 *             headings:
 *               type: object
 *             body_text:
 *               type: object
 *         category_tabs:
 *           type: object
 *           properties:
 *             bg:
 *               type: string
 *             active_bg:
 *               type: string
 *             text_color:
 *               type: string
 *             active_text_color:
 *               type: string
 *             border_radius:
 *               type: number
 *         forms:
 *           type: object
 *           properties:
 *             input:
 *               type: object
 *             label:
 *               type: object
 */

/**
 * @swagger
 * /api/theme-config:
 *   get:
 *     summary: Get theme configuration (Public)
 *     tags: [Theme Config]
 *     responses:
 *       200:
 *         description: Theme config retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 themeConfig:
 *                   $ref: '#/components/schemas/ThemeConfig'
 *       500:
 *         description: Server error
 */
router.get("/", getThemeConfig);

/**
 * @swagger
 * /api/theme-config:
 *   put:
 *     summary: Update theme configuration (Admin only)
 *     tags: [Theme Config]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ThemeConfig'
 *           example:
 *             brand:
 *               site_name: "KhelaGhor"
 *             colors:
 *               primary: "#f7b500"
 *               accent: "#db110f"
 *     responses:
 *       200:
 *         description: Theme config updated successfully
 *       201:
 *         description: Theme config created successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.put("/", protectDashboard, restrictTo("admin"), updateThemeConfig);

/**
 * @swagger
 * /api/theme-config/logo:
 *   post:
 *     summary: Upload logo image (Admin only)
 *     tags: [Theme Config]
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
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 logoUrl:
 *                   type: string
 *       400:
 *         description: No image uploaded
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post(
  "/logo",
  protectDashboard,
  restrictTo("admin"),
  upload.single("image"),
  uploadLogo
);

/**
 * @swagger
 * /api/theme-config/favicon:
 *   post:
 *     summary: Upload favicon image (Admin only)
 *     tags: [Theme Config]
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
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Favicon uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 faviconUrl:
 *                   type: string
 *       400:
 *         description: No image uploaded
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post(
  "/favicon",
  protectDashboard,
  restrictTo("admin"),
  upload.single("image"),
  uploadFavicon
);

/**
 * @swagger
 * /api/theme-config/reset:
 *   post:
 *     summary: Reset theme configuration to defaults (Admin only)
 *     tags: [Theme Config]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Theme config reset to defaults
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 themeConfig:
 *                   $ref: '#/components/schemas/ThemeConfig'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post("/reset", protectDashboard, restrictTo("admin"), resetThemeConfig);

export default router;
