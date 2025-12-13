import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Game from "../models/Game";
import GameCategory from "../models/GameCategory";
import fs from "fs";
import path from "path";

// Get all games (Public)
export const getGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    const games = await Game.find(filter)
      .populate("category", "name icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: games.length,
      games,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get single game (Public)
export const getGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const game = await Game.findById(req.params.id).populate(
      "category",
      "name icon"
    );

    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    res.status(200).json({
      success: true,
      game,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Create game (Admin only)
export const createGame = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, url, category } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "Game image is required" });
      return;
    }

    // Verify category exists
    const categoryExists = await GameCategory.findById(category);
    if (!categoryExists) {
      // Delete uploaded file
      const filePath = path.join(process.cwd(), "uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.status(404).json({ message: "Game category not found" });
      return;
    }

    const game = await Game.create({
      title,
      image: `/uploads/${req.file.filename}`,
      url,
      category,
    });

    const populatedGame = await Game.findById(game._id).populate(
      "category",
      "name icon"
    );

    res.status(201).json({
      success: true,
      message: "Game created successfully",
      game: populatedGame,
    });
  } catch (error) {
    // Delete uploaded file if game creation fails
    if (req.file) {
      const filePath = path.join(process.cwd(), "uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update game (Admin only)
export const updateGame = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, url, category } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    // Verify category exists if provided
    if (category) {
      const categoryExists = await GameCategory.findById(category);
      if (!categoryExists) {
        res.status(404).json({ message: "Game category not found" });
        return;
      }
      game.category = category;
    }

    // Update fields if provided
    if (title) game.title = title;
    if (url) game.url = url;

    // Update image if new file uploaded
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(process.cwd(), game.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      game.image = `/uploads/${req.file.filename}`;
    }

    await game.save();

    const updatedGame = await Game.findById(game._id).populate(
      "category",
      "name icon"
    );

    res.status(200).json({
      success: true,
      message: "Game updated successfully",
      game: updatedGame,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Delete game (Admin only)
export const deleteGame = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      res.status(404).json({ message: "Game not found" });
      return;
    }

    // Delete image file
    const imagePath = path.join(process.cwd(), game.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Game.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Game deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
