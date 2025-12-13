import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import GameCategory from "../models/GameCategory";
import fs from "fs";
import path from "path";

// Get all game categories (Public)
export const getGameCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await GameCategory.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get single game category (Public)
export const getGameCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await GameCategory.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Game category not found" });
      return;
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Create game category (Admin only)
export const createGameCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "Icon is required" });
      return;
    }

    const category = await GameCategory.create({
      name,
      icon: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Game category created successfully",
      category,
    });
  } catch (error) {
    // Delete uploaded file if category creation fails
    if (req.file) {
      const filePath = path.join(process.cwd(), "uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update game category (Admin only)
export const updateGameCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const category = await GameCategory.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Game category not found" });
      return;
    }

    // Update name if provided
    if (name) {
      category.name = name;
    }

    // Update icon if new file uploaded
    if (req.file) {
      // Delete old icon
      const oldIconPath = path.join(process.cwd(), category.icon);
      if (fs.existsSync(oldIconPath)) {
        fs.unlinkSync(oldIconPath);
      }
      category.icon = `/uploads/${req.file.filename}`;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Game category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Delete game category (Admin only)
export const deleteGameCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const category = await GameCategory.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Game category not found" });
      return;
    }

    // Delete icon file
    const iconPath = path.join(process.cwd(), category.icon);
    if (fs.existsSync(iconPath)) {
      fs.unlinkSync(iconPath);
    }

    await GameCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Game category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
