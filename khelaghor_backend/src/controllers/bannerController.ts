import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Banner from "../models/Banner";
import path from "path";
import fs from "fs";

// Admin: Upload banner
export const uploadBanner = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, textEnglish, textBangla, order, isActive } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "Please upload an image" });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const banner = await Banner.create({
      title,
      imageUrl,
      textEnglish: textEnglish || "",
      textBangla: textBangla || "",
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      banner: {
        id: banner._id,
        title: banner.title,
        imageUrl: banner.imageUrl,
        textEnglish: banner.textEnglish,
        textBangla: banner.textBangla,
        isActive: banner.isActive,
        order: banner.order,
        createdAt: banner.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Get all banners
export const getAllBannersAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const banners = await Banner.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners: banners.map((banner) => ({
        id: banner._id,
        title: banner.title,
        imageUrl: banner.imageUrl,
        textEnglish: banner.textEnglish,
        textBangla: banner.textBangla,
        isActive: banner.isActive,
        order: banner.order,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Update banner
export const updateBanner = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, textEnglish, textBangla, order, isActive } = req.body;

    const banner = await Banner.findById(id);

    if (!banner) {
      res.status(404).json({ message: "Banner not found" });
      return;
    }

    // If new image is uploaded, delete old one
    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "../../",
        banner.imageUrl.replace(/^\//, "")
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      banner.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (title) banner.title = title;
    if (textEnglish !== undefined) banner.textEnglish = textEnglish;
    if (textBangla !== undefined) banner.textBangla = textBangla;
    if (order !== undefined) banner.order = order;
    if (isActive !== undefined) banner.isActive = isActive;

    await banner.save();

    res.status(200).json({
      success: true,
      banner: {
        id: banner._id,
        title: banner.title,
        imageUrl: banner.imageUrl,
        textEnglish: banner.textEnglish,
        textBangla: banner.textBangla,
        isActive: banner.isActive,
        order: banner.order,
        updatedAt: banner.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Delete banner
export const deleteBanner = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      res.status(404).json({ message: "Banner not found" });
      return;
    }

    // Delete image file
    const imagePath = path.join(
      __dirname,
      "../../",
      banner.imageUrl.replace(/^\//, "")
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Public: Get active banners for frontend
export const getActiveBanners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners: banners.map((banner) => ({
        id: banner._id,
        title: banner.title,
        imageUrl: banner.imageUrl,
        textEnglish: banner.textEnglish,
        textBangla: banner.textBangla,
        order: banner.order,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
