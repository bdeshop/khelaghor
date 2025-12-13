import express from "express";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  createWithdrawMethod,
  getAllWithdrawMethodsAdmin,
  getWithdrawMethodAdmin,
  updateWithdrawMethod,
  deleteWithdrawMethod,
  getActiveWithdrawMethods,
  getActiveWithdrawMethod,
} from "../controllers/withdrawMethodController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Withdraw Methods
 *   description: Withdraw method management
 */

/**
 * @swagger
 * /api/withdraw-methods/active:
 *   get:
 *     summary: Get all active withdraw methods (Public)
 *     tags: [Withdraw Methods]
 *     responses:
 *       200:
 *         description: List of active withdraw methods
 *       500:
 *         description: Server error
 */
router.get("/active", getActiveWithdrawMethods);

/**
 * @swagger
 * /api/withdraw-methods/active/{id}:
 *   get:
 *     summary: Get a single active withdraw method (Public)
 *     tags: [Withdraw Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Withdraw method ID
 *     responses:
 *       200:
 *         description: Withdraw method details
 *       404:
 *         description: Withdraw method not found
 *       500:
 *         description: Server error
 */
router.get("/active/:id", getActiveWithdrawMethod);

/**
 * @swagger
 * /api/withdraw-methods:
 *   post:
 *     summary: Create a new withdraw method (Admin only)
 *     tags: [Withdraw Methods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - methodNameEn
 *               - methodNameBn
 *               - minimumWithdrawal
 *               - maximumWithdrawal
 *               - processingTime
 *               - withdrawalFee
 *               - feeType
 *             properties:
 *               methodNameEn:
 *                 type: string
 *               methodNameBn:
 *                 type: string
 *               minimumWithdrawal:
 *                 type: number
 *               maximumWithdrawal:
 *                 type: number
 *               processingTime:
 *                 type: string
 *                 description: e.g. "24 hours"
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 default: Active
 *               withdrawalFee:
 *                 type: number
 *               feeType:
 *                 type: string
 *                 enum: [Fixed, Percentage]
 *               methodImage:
 *                 type: string
 *                 format: binary
 *               withdrawPageImage:
 *                 type: string
 *                 format: binary
 *               colors:
 *                 type: string
 *                 description: 'JSON object: {"textColor":"#000000","backgroundColor":"#FFFFFF","buttonColor":"#FFFFFF"}'
 *               instructionEn:
 *                 type: string
 *               instructionBn:
 *                 type: string
 *               userInputFields:
 *                 type: string
 *                 description: 'JSON array: [{"fieldLabelEn":"Account Number","fieldLabelBn":"","fieldType":"text","required":true}]'
 *     responses:
 *       201:
 *         description: Withdraw method created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  protectDashboard,
  restrictTo("admin"),
  upload.fields([
    { name: "methodImage", maxCount: 1 },
    { name: "withdrawPageImage", maxCount: 1 },
  ]),
  createWithdrawMethod
);

/**
 * @swagger
 * /api/withdraw-methods:
 *   get:
 *     summary: Get all withdraw methods (Admin only)
 *     tags: [Withdraw Methods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all withdraw methods
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  protectDashboard,
  restrictTo("admin"),
  getAllWithdrawMethodsAdmin
);

/**
 * @swagger
 * /api/withdraw-methods/{id}:
 *   get:
 *     summary: Get a single withdraw method (Admin only)
 *     tags: [Withdraw Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Withdraw method ID
 *     responses:
 *       200:
 *         description: Withdraw method details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Withdraw method not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  getWithdrawMethodAdmin
);

/**
 * @swagger
 * /api/withdraw-methods/{id}:
 *   put:
 *     summary: Update a withdraw method (Admin only)
 *     tags: [Withdraw Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Withdraw method ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               methodNameEn:
 *                 type: string
 *               methodNameBn:
 *                 type: string
 *               minimumWithdrawal:
 *                 type: number
 *               maximumWithdrawal:
 *                 type: number
 *               processingTime:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *               withdrawalFee:
 *                 type: number
 *               feeType:
 *                 type: string
 *                 enum: [Fixed, Percentage]
 *               methodImage:
 *                 type: string
 *                 format: binary
 *               withdrawPageImage:
 *                 type: string
 *                 format: binary
 *               colors:
 *                 type: string
 *                 description: JSON object for colors
 *               instructionEn:
 *                 type: string
 *               instructionBn:
 *                 type: string
 *               userInputFields:
 *                 type: string
 *                 description: JSON array of user input fields
 *     responses:
 *       200:
 *         description: Withdraw method updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Withdraw method not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  upload.fields([
    { name: "methodImage", maxCount: 1 },
    { name: "withdrawPageImage", maxCount: 1 },
  ]),
  updateWithdrawMethod
);

/**
 * @swagger
 * /api/withdraw-methods/{id}:
 *   delete:
 *     summary: Delete a withdraw method (Admin only)
 *     tags: [Withdraw Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Withdraw method ID
 *     responses:
 *       200:
 *         description: Withdraw method deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Withdraw method not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  deleteWithdrawMethod
);

export default router;
