import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test endpoint
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Test successful
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test endpoint is working!",
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /api/test/echo:
 *   post:
 *     summary: Echo test - returns what you send
 *     tags: [Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Hello World
 *     responses:
 *       200:
 *         description: Echo response
 */
router.post("/echo", (req, res) => {
  res.status(200).json({
    success: true,
    echo: req.body,
    timestamp: new Date().toISOString(),
  });
});

export default router;
