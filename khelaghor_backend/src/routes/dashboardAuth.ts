import express from "express";
import {
  register,
  login,
  changePassword,
  updateProfile,
} from "../controllers/dashboardAuthController";
import { protectDashboard } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/auth/register:
 *   post:
 *     summary: Register a new dashboard user (admin/user)
 *     tags: [Dashboard Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin User
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: admin
 *     responses:
 *       201:
 *         description: Dashboard user registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/dashboard/auth/login:
 *   post:
 *     summary: Login dashboard user
 *     tags: [Dashboard Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/dashboard/auth/change-password:
 *   put:
 *     summary: Change password for logged in dashboard user
 *     tags: [Dashboard Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: Admin123
 *               newPassword:
 *                 type: string
 *                 example: NewAdmin123
 *               confirmPassword:
 *                 type: string
 *                 example: NewAdmin123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Current password incorrect or not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/change-password", protectDashboard, changePassword);

/**
 * @swagger
 * /api/dashboard/auth/update-profile:
 *   put:
 *     summary: Update profile for logged in dashboard user
 *     tags: [Dashboard Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Admin
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/update-profile", protectDashboard, updateProfile);

export default router;
