import express from "express";
import {
  register,
  login,
  changePassword,
  updateProfile,
} from "../controllers/frontendAuthController";
import { protectFrontend } from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /api/frontend/auth/register:
 *   post:
 *     summary: Register a new frontend user
 *     tags: [Frontend Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *               - phone
 *               - callingCode
 *               - captcha
 *             properties:
 *               userName:
 *                 type: string
 *                 example: nanayeem
 *               password:
 *                 type: string
 *                 example: Nayeem123
 *               friendReferrerCode:
 *                 type: string
 *                 example: ""
 *               phone:
 *                 type: number
 *                 example: 1845588512
 *               callingCode:
 *                 type: string
 *                 example: "880"
 *               captcha:
 *                 type: string
 *                 example: "5977"
 *               balance:
 *                 type: number
 *                 example: 0
 *     responses:
 *       201:
 *         description: Frontend user registered successfully
 *       400:
 *         description: User already exists or captcha missing
 *       500:
 *         description: Server error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/frontend/auth/login:
 *   post:
 *     summary: Login frontend user
 *     tags: [Frontend Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: nanayeem
 *               password:
 *                 type: string
 *                 example: Nayeem123
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
 * /api/frontend/auth/change-password:
 *   put:
 *     summary: Change password for logged in frontend user
 *     tags: [Frontend Authentication]
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
 *                 example: Nayeem123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: NewPassword123
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
router.put("/change-password", protectFrontend, changePassword);

/**
 * @swagger
 * /api/frontend/auth/update-profile:
 *   put:
 *     summary: Update profile for logged in frontend user
 *     tags: [Frontend Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-15
 *               phone:
 *                 type: number
 *                 example: 1234567890
 *               email:
 *                 type: string
 *                 example: john@example.com
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
router.put("/update-profile", protectFrontend, updateProfile);

export default router;
