import express from "express";
import { protectDashboard, restrictTo } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  createDepositMethod,
  getAllDepositMethodsAdmin,
  getDepositMethodAdmin,
  updateDepositMethod,
  deleteDepositMethod,
  getActiveDepositMethods,
  getActiveDepositMethod,
} from "../controllers/depositMethodController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Deposit Methods
 *   description: Deposit method management
 */

/**
 * @swagger
 * /api/deposit-methods/active:
 *   get:
 *     summary: Get all active deposit methods (Public)
 *     tags: [Deposit Methods]
 *     responses:
 *       200:
 *         description: List of active deposit methods
 *       500:
 *         description: Server error
 */
router.get("/active", getActiveDepositMethods);

/**
 * @swagger
 * /api/deposit-methods/active/{id}:
 *   get:
 *     summary: Get a single active deposit method (Public)
 *     tags: [Deposit Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deposit method ID
 *     responses:
 *       200:
 *         description: Deposit method details
 *       404:
 *         description: Deposit method not found
 *       500:
 *         description: Server error
 */
router.get("/active/:id", getActiveDepositMethod);

/**
 * @swagger
 * /api/deposit-methods:
 *   post:
 *     summary: Create a new deposit method (Admin only)
 *     tags: [Deposit Methods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - method_name_en
 *               - method_name_bd
 *               - agent_wallet_number
 *             properties:
 *               method_name_en:
 *                 type: string
 *                 description: Method name in English
 *               method_name_bd:
 *                 type: string
 *                 description: Method name in Bangla
 *               agent_wallet_number:
 *                 type: string
 *                 description: Agent wallet number
 *               agent_wallet_text:
 *                 type: string
 *                 description: Agent wallet text
 *               gateways:
 *                 type: string
 *                 description: JSON array of gateways e.g. ["bKash", "Nagad"]
 *               method_image:
 *                 type: string
 *                 format: binary
 *               payment_page_image:
 *                 type: string
 *                 format: binary
 *               text_color:
 *                 type: string
 *                 default: "#000000"
 *               background_color:
 *                 type: string
 *                 default: "#ffffff"
 *               button_color:
 *                 type: string
 *                 default: "#007bff"
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 default: Active
 *               instruction_en:
 *                 type: string
 *               instruction_bd:
 *                 type: string
 *               user_input_fields:
 *                 type: string
 *                 description: JSON array of user input fields
 *     responses:
 *       201:
 *         description: Deposit method created successfully
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
    { name: "method_image", maxCount: 1 },
    { name: "payment_page_image", maxCount: 1 },
  ]),
  createDepositMethod
);

/**
 * @swagger
 * /api/deposit-methods:
 *   get:
 *     summary: Get all deposit methods (Admin only)
 *     tags: [Deposit Methods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all deposit methods
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  protectDashboard,
  restrictTo("admin"),
  getAllDepositMethodsAdmin
);

/**
 * @swagger
 * /api/deposit-methods/{id}:
 *   get:
 *     summary: Get a single deposit method (Admin only)
 *     tags: [Deposit Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deposit method ID
 *     responses:
 *       200:
 *         description: Deposit method details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Deposit method not found
 *       500:
 *         description: Server error
 */
router.get(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  getDepositMethodAdmin
);

/**
 * @swagger
 * /api/deposit-methods/{id}:
 *   put:
 *     summary: Update a deposit method (Admin only)
 *     tags: [Deposit Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deposit method ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               method_name_en:
 *                 type: string
 *               method_name_bd:
 *                 type: string
 *               agent_wallet_number:
 *                 type: string
 *               agent_wallet_text:
 *                 type: string
 *               gateways:
 *                 type: string
 *                 description: JSON array of gateways
 *               method_image:
 *                 type: string
 *                 format: binary
 *               payment_page_image:
 *                 type: string
 *                 format: binary
 *               text_color:
 *                 type: string
 *               background_color:
 *                 type: string
 *               button_color:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *               instruction_en:
 *                 type: string
 *               instruction_bd:
 *                 type: string
 *               user_input_fields:
 *                 type: string
 *                 description: JSON array of user input fields
 *     responses:
 *       200:
 *         description: Deposit method updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Deposit method not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  upload.fields([
    { name: "method_image", maxCount: 1 },
    { name: "payment_page_image", maxCount: 1 },
  ]),
  updateDepositMethod
);

/**
 * @swagger
 * /api/deposit-methods/{id}:
 *   delete:
 *     summary: Delete a deposit method (Admin only)
 *     tags: [Deposit Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deposit method ID
 *     responses:
 *       200:
 *         description: Deposit method deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Deposit method not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  protectDashboard,
  restrictTo("admin"),
  deleteDepositMethod
);

export default router;
