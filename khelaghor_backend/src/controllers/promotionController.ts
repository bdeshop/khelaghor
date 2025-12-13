import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Promotion from "../models/Promotion";
import path from "path";
import fs from "fs";

// Admin: Create promotion
export const createPromotion = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("=== CREATE PROMOTION ===");
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Request File:", req.file);

    const {
      title,
      titleBn,
      description,
      descriptionBn,
      gameType,
      paymentMethods,
      bonusSettings,
    } = req.body;

    const file = req.file;
    if (!file) {
      console.log("Error: No file uploaded");
      res.status(400).json({ message: "Promotion image is required" });
      return;
    }

    const promotionImage = `/uploads/${file.filename}`;

    const createData = {
      promotionImage,
      title,
      titleBn: titleBn || "",
      description,
      descriptionBn: descriptionBn || "",
      gameType,
      paymentMethods: paymentMethods ? JSON.parse(paymentMethods) : [],
      bonusSettings: bonusSettings ? JSON.parse(bonusSettings) : {},
    };

    console.log("Data to create:", JSON.stringify(createData, null, 2));

    const promotion = await Promotion.create(createData);

    console.log("Created promotion:", JSON.stringify(promotion, null, 2));

    res.status(201).json({
      success: true,
      promotion,
    });
  } catch (error) {
    console.error("Error creating promotion:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Get all promotions
export const getAllPromotionsAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const promotions = await Promotion.find()
      .populate("gameType", "name")
      .populate("paymentMethods", "method_name_en method_name_bd method_image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: promotions.length,
      promotions,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Get single promotion
export const getPromotionAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findById(id)
      .populate("gameType", "name")
      .populate("paymentMethods", "method_name_en method_name_bd method_image");

    if (!promotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }

    res.status(200).json({
      success: true,
      promotion,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Update promotion
export const updatePromotion = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      titleBn,
      description,
      descriptionBn,
      gameType,
      paymentMethods,
      bonusSettings,
    } = req.body;

    const promotion = await Promotion.findById(id);

    if (!promotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }

    // Handle image update
    if (req.file) {
      if (promotion.promotionImage) {
        const oldImagePath = path.join(
          __dirname,
          "../../",
          promotion.promotionImage.replace(/^\//, "")
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      promotion.promotionImage = `/uploads/${req.file.filename}`;
    }

    if (title) promotion.title = title;
    if (titleBn !== undefined) promotion.titleBn = titleBn;
    if (description) promotion.description = description;
    if (descriptionBn !== undefined) promotion.descriptionBn = descriptionBn;
    if (gameType) promotion.gameType = gameType;
    if (paymentMethods) promotion.paymentMethods = JSON.parse(paymentMethods);
    if (bonusSettings) promotion.bonusSettings = JSON.parse(bonusSettings);

    await promotion.save();

    res.status(200).json({
      success: true,
      promotion,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Delete promotion
export const deletePromotion = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findByIdAndDelete(id);

    if (!promotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }

    // Delete promotion image
    if (promotion.promotionImage) {
      const imagePath = path.join(
        __dirname,
        "../../",
        promotion.promotionImage.replace(/^\//, "")
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Public: Get all promotions
export const getAllPromotions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const promotions = await Promotion.find()
      .populate("gameType", "name")
      .populate("paymentMethods", "method_name_en method_name_bd method_image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: promotions.length,
      promotions,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Public: Get single promotion
export const getPromotion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findById(id)
      .populate("gameType", "name")
      .populate("paymentMethods", "method_name_en method_name_bd method_image");

    if (!promotion) {
      res.status(404).json({ message: "Promotion not found" });
      return;
    }

    res.status(200).json({
      success: true,
      promotion,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
