import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Favourite from "../models/Favourite";

// Frontend - Get all active favourites
export const getFavourites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const favourites = await Favourite.find({ isActive: true }).sort({
      order: 1,
    });

    res.status(200).json({
      success: true,
      count: favourites.length,
      favourites,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin - Get all favourites
export const getAllFavourites = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const favourites = await Favourite.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: favourites.length,
      favourites,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin - Create favourite
export const createFavourite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, actionType, url, modalOptions, isActive, order } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "Image is required" });
      return;
    }

    // Validate based on actionType
    if (actionType === "url" && !url) {
      res.status(400).json({ message: "URL is required for url action type" });
      return;
    }

    if (actionType === "modal" && !modalOptions) {
      res
        .status(400)
        .json({ message: "Modal options are required for modal action type" });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const favourite = await Favourite.create({
      image: imageUrl,
      title,
      actionType,
      url: actionType === "url" ? url : undefined,
      modalOptions: actionType === "modal" ? modalOptions : undefined,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      favourite,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin - Update favourite
export const updateFavourite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, actionType, url, modalOptions, isActive, order } = req.body;

    const favourite = await Favourite.findById(id);

    if (!favourite) {
      res.status(404).json({ message: "Favourite not found" });
      return;
    }

    // Validate based on actionType
    if (actionType === "url" && !url) {
      res.status(400).json({ message: "URL is required for url action type" });
      return;
    }

    if (actionType === "modal" && !modalOptions) {
      res
        .status(400)
        .json({ message: "Modal options are required for modal action type" });
      return;
    }

    if (req.file) {
      favourite.image = `/uploads/${req.file.filename}`;
    }
    if (title) favourite.title = title;
    if (actionType) {
      favourite.actionType = actionType;
      if (actionType === "url") {
        favourite.url = url;
        favourite.modalOptions = undefined;
      } else {
        favourite.modalOptions = modalOptions;
        favourite.url = undefined;
      }
    }
    if (isActive !== undefined) favourite.isActive = isActive;
    if (order !== undefined) favourite.order = order;

    await favourite.save();

    res.status(200).json({
      success: true,
      favourite,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin - Delete favourite
export const deleteFavourite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const favourite = await Favourite.findByIdAndDelete(id);

    if (!favourite) {
      res.status(404).json({ message: "Favourite not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Favourite deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin - Get single favourite
export const getFavourite = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const favourite = await Favourite.findById(id);

    if (!favourite) {
      res.status(404).json({ message: "Favourite not found" });
      return;
    }

    res.status(200).json({
      success: true,
      favourite,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
