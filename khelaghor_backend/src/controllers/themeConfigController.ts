import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import ThemeConfig from "../models/ThemeConfig";
import path from "path";
import fs from "fs";

// Helper function to deep merge objects
const deepMerge = (target: any, source: any): any => {
  const result = { ...target };
  for (const key in source) {
    if (source[key] !== undefined && source[key] !== null) {
      if (
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        source[key] !== null
      ) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
};

// Helper function to clean config object
const cleanConfig = (config: any) => {
  const { _id, __v, createdAt, updatedAt, ...rest } = config;
  return rest;
};

// Public: Get theme config
export const getThemeConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let themeConfig = await ThemeConfig.findOne();

    // If no theme config exists, create default one
    if (!themeConfig) {
      themeConfig = await ThemeConfig.create({});
    }

    const config = cleanConfig(themeConfig.toObject());

    res.status(200).json({
      success: true,
      themeConfig: config,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Update theme config
export const updateThemeConfig = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const updates = req.body;

    let themeConfig = await ThemeConfig.findOne();

    if (!themeConfig) {
      // Create new theme config with provided values
      themeConfig = await ThemeConfig.create(updates);

      const config = cleanConfig(themeConfig.toObject());

      res.status(201).json({
        success: true,
        message: "Theme config created successfully",
        themeConfig: config,
      });
    } else {
      // Deep merge updates with existing config
      const existingConfig = themeConfig.toObject();
      const mergedConfig = deepMerge(existingConfig, updates);

      // Update each top-level field
      Object.keys(mergedConfig).forEach((key) => {
        if (!["_id", "__v", "createdAt", "updatedAt"].includes(key)) {
          (themeConfig as any)[key] = mergedConfig[key];
        }
      });

      await themeConfig.save();

      const config = cleanConfig(themeConfig.toObject());

      res.status(200).json({
        success: true,
        message: "Theme config updated successfully",
        themeConfig: config,
      });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Upload logo
export const uploadLogo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Please upload an image" });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    let themeConfig = await ThemeConfig.findOne();

    if (!themeConfig) {
      themeConfig = await ThemeConfig.create({
        brand: { logo: imageUrl },
        header: { logo: { src: imageUrl } },
      });
    } else {
      // Delete old logo if it exists and is in uploads folder
      const oldLogo = themeConfig.brand?.logo;
      if (oldLogo && oldLogo.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), oldLogo.replace(/^\//, ""));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      themeConfig.brand.logo = imageUrl;
      themeConfig.header.logo.src = imageUrl;
      await themeConfig.save();
    }

    res.status(200).json({
      success: true,
      message: "Logo uploaded successfully",
      logoUrl: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Upload favicon
export const uploadFavicon = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Please upload an image" });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    let themeConfig = await ThemeConfig.findOne();

    if (!themeConfig) {
      themeConfig = await ThemeConfig.create({
        brand: { favicon: imageUrl },
      });
    } else {
      // Delete old favicon if it exists and is in uploads folder
      const oldFavicon = themeConfig.brand?.favicon;
      if (oldFavicon && oldFavicon.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), oldFavicon.replace(/^\//, ""));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      themeConfig.brand.favicon = imageUrl;
      await themeConfig.save();
    }

    res.status(200).json({
      success: true,
      message: "Favicon uploaded successfully",
      faviconUrl: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Reset theme config to defaults
export const resetThemeConfig = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    await ThemeConfig.deleteMany({});
    const themeConfig = await ThemeConfig.create({});

    const config = cleanConfig(themeConfig.toObject());

    res.status(200).json({
      success: true,
      message: "Theme config reset to defaults",
      themeConfig: config,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
