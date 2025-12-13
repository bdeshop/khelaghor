import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Footer from "../models/Footer";

// Frontend - Get footer data
export const getFooter = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the first (and should be only) footer document
    const footer = await Footer.findOne();

    if (!footer) {
      res.status(404).json({ message: "Footer not found" });
      return;
    }

    res.status(200).json({
      success: true,
      footer,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin - Create or Update footer
export const upsertFooter = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      logo,
      socialLinks,
      quickLinks,
      responsibleGaming,
      gamingLicenses,
      brandPartners,
      copyrightText,
      descriptionSection,
    } = req.body;

    // Check if footer already exists
    let footer = await Footer.findOne();

    const footerData: any = {};

    // Handle logo upload
    if (req.file) {
      footerData.logo = `/uploads/${req.file.filename}`;
    } else if (logo !== undefined) {
      footerData.logo = logo;
    }

    // Parse JSON strings for arrays and objects
    if (socialLinks) footerData.socialLinks = JSON.parse(socialLinks);
    if (quickLinks) footerData.quickLinks = JSON.parse(quickLinks);
    if (responsibleGaming)
      footerData.responsibleGaming = JSON.parse(responsibleGaming);
    if (gamingLicenses) footerData.gamingLicenses = JSON.parse(gamingLicenses);
    if (brandPartners) footerData.brandPartners = JSON.parse(brandPartners);
    if (copyrightText) footerData.copyrightText = copyrightText;
    if (descriptionSection)
      footerData.descriptionSection = JSON.parse(descriptionSection);

    if (footer) {
      // Update existing footer (there's only one)
      Object.assign(footer, footerData);
      await footer.save();

      res.status(200).json({
        success: true,
        message: "Footer updated successfully",
        footer,
      });
    } else {
      // Create new footer (first time only)
      footer = await Footer.create(footerData);

      res.status(201).json({
        success: true,
        message: "Footer created successfully",
        footer,
      });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin - Upload icon/image
export const uploadIcon = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const iconUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      url: iconUrl,
      message: "Icon uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin - Delete footer
export const deleteFooter = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const footer = await Footer.findOneAndDelete();

    if (!footer) {
      res.status(404).json({ message: "Footer not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Footer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
