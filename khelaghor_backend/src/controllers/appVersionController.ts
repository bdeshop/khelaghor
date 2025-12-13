import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import AppVersion from "../models/AppVersion";
import fs from "fs";
import path from "path";

export const createOrUpdateAppVersion = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { version, apkUrl, fileSize, releaseNotes, isActive } = req.body;
    const uploadedFile = (req as any).file;

    if (!version) {
      res.status(400).json({ message: "Version is required" });
      return;
    }

    // Check if either file or URL is provided
    if (!uploadedFile && !apkUrl) {
      res
        .status(400)
        .json({ message: "Either upload APK file or provide APK URL" });
      return;
    }

    // Get the single app version record (there should only be one)
    let appVersion = await AppVersion.findOne();

    // Delete old APK file if exists and new file is uploaded
    if (appVersion && uploadedFile && appVersion.apkUrl) {
      const oldFilePath = path.join(
        process.cwd(),
        appVersion.apkUrl.replace(/^\//, "")
      );
      if (fs.existsSync(oldFilePath) && !appVersion.apkUrl.startsWith("http")) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const finalApkUrl = uploadedFile ? `/apk/${uploadedFile.filename}` : apkUrl;

    if (appVersion) {
      // Update existing version
      appVersion.version = version;
      appVersion.apkUrl = finalApkUrl;
      if (fileSize !== undefined) appVersion.fileSize = fileSize;
      if (releaseNotes !== undefined) appVersion.releaseNotes = releaseNotes;
      if (isActive !== undefined) appVersion.isActive = isActive;

      await appVersion.save();

      res.status(200).json({
        success: true,
        message: "App version updated successfully",
        appVersion,
      });
    } else {
      // Create new version (first time)
      const newVersion = await AppVersion.create({
        version,
        apkUrl: finalApkUrl,
        fileSize,
        releaseNotes,
        isActive: isActive !== undefined ? isActive : true,
      });

      res.status(201).json({
        success: true,
        message: "App version created successfully",
        appVersion: newVersion,
      });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAppVersion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const appVersion = await AppVersion.findOne();

    if (!appVersion) {
      res.status(404).json({ message: "No app version found" });
      return;
    }

    res.status(200).json({
      success: true,
      appVersion,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteAppVersion = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const appVersion = await AppVersion.findOne();

    if (!appVersion) {
      res.status(404).json({ message: "App version not found" });
      return;
    }

    // Delete APK file if it exists locally
    if (appVersion.apkUrl && !appVersion.apkUrl.startsWith("http")) {
      const filePath = path.join(
        process.cwd(),
        appVersion.apkUrl.replace(/^\//, "")
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await AppVersion.deleteOne({ _id: appVersion._id });

    res.status(200).json({
      success: true,
      message: "App version deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
