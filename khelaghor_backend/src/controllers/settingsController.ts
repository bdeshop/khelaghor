import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Settings from "../models/Settings";

export const getSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let settings = await Settings.findOne();

    // If no settings exist, create default one
    if (!settings) {
      settings = await Settings.create({
        telegram: "",
        email: "",
        bannerTextEnglish: "",
        bannerTextBangla: "",
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateSettings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { telegram, email, bannerTextEnglish, bannerTextBangla } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      // Create new settings if none exist
      settings = await Settings.create({
        telegram: telegram || "",
        email: email || "",
        bannerTextEnglish: bannerTextEnglish || "",
        bannerTextBangla: bannerTextBangla || "",
      });

      res.status(201).json({
        success: true,
        message: "Settings created successfully",
        settings,
      });
    } else {
      // Update existing settings
      if (telegram !== undefined) settings.telegram = telegram;
      if (email !== undefined) settings.email = email;
      if (bannerTextEnglish !== undefined)
        settings.bannerTextEnglish = bannerTextEnglish;
      if (bannerTextBangla !== undefined)
        settings.bannerTextBangla = bannerTextBangla;

      await settings.save();

      res.status(200).json({
        success: true,
        message: "Settings updated successfully",
        settings,
      });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
