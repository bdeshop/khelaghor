import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import WithdrawMethod from "../models/WithdrawMethod";
import path from "path";
import fs from "fs";

// Admin: Create withdraw method
export const createWithdrawMethod = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("=== CREATE WITHDRAW METHOD ===");
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Request Files:", req.files);

    const {
      methodNameEn,
      methodNameBn,
      minimumWithdrawal,
      maximumWithdrawal,
      processingTime,
      status,
      withdrawalFee,
      feeType,
      colors,
      instructionEn,
      instructionBn,
      userInputFields,
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const methodImage = files?.methodImage?.[0]
      ? `/uploads/${files.methodImage[0].filename}`
      : "";
    const withdrawPageImage = files?.withdrawPageImage?.[0]
      ? `/uploads/${files.withdrawPageImage[0].filename}`
      : "";

    const createData = {
      methodNameEn,
      methodNameBn,
      minimumWithdrawal: Number(minimumWithdrawal),
      maximumWithdrawal: Number(maximumWithdrawal),
      processingTime,
      status: status || "Active",
      withdrawalFee: Number(withdrawalFee),
      feeType,
      methodImage,
      withdrawPageImage,
      colors: colors
        ? JSON.parse(colors)
        : {
            textColor: "#000000",
            backgroundColor: "#FFFFFF",
            buttonColor: "#FFFFFF",
          },
      instructionEn: instructionEn || "",
      instructionBn: instructionBn || "",
      userInputFields: userInputFields ? JSON.parse(userInputFields) : [],
    };

    console.log("Data to create:", JSON.stringify(createData, null, 2));

    const withdrawMethod = await WithdrawMethod.create(createData);

    console.log(
      "Created withdraw method:",
      JSON.stringify(withdrawMethod, null, 2)
    );

    res.status(201).json({
      success: true,
      withdrawMethod,
    });
  } catch (error) {
    console.error("Error creating withdraw method:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Get all withdraw methods
export const getAllWithdrawMethodsAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const withdrawMethods = await WithdrawMethod.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: withdrawMethods.length,
      withdrawMethods,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Get single withdraw method
export const getWithdrawMethodAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const withdrawMethod = await WithdrawMethod.findById(id);

    if (!withdrawMethod) {
      res.status(404).json({ message: "Withdraw method not found" });
      return;
    }

    res.status(200).json({
      success: true,
      withdrawMethod,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Update withdraw method
export const updateWithdrawMethod = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      methodNameEn,
      methodNameBn,
      minimumWithdrawal,
      maximumWithdrawal,
      processingTime,
      status,
      withdrawalFee,
      feeType,
      colors,
      instructionEn,
      instructionBn,
      userInputFields,
    } = req.body;

    const withdrawMethod = await WithdrawMethod.findById(id);

    if (!withdrawMethod) {
      res.status(404).json({ message: "Withdraw method not found" });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Handle method image update
    if (files?.methodImage?.[0]) {
      if (withdrawMethod.methodImage) {
        const oldImagePath = path.join(
          __dirname,
          "../../",
          withdrawMethod.methodImage.replace(/^\//, "")
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      withdrawMethod.methodImage = `/uploads/${files.methodImage[0].filename}`;
    }

    // Handle withdraw page image update
    if (files?.withdrawPageImage?.[0]) {
      if (withdrawMethod.withdrawPageImage) {
        const oldImagePath = path.join(
          __dirname,
          "../../",
          withdrawMethod.withdrawPageImage.replace(/^\//, "")
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      withdrawMethod.withdrawPageImage = `/uploads/${files.withdrawPageImage[0].filename}`;
    }

    if (methodNameEn) withdrawMethod.methodNameEn = methodNameEn;
    if (methodNameBn) withdrawMethod.methodNameBn = methodNameBn;
    if (minimumWithdrawal !== undefined)
      withdrawMethod.minimumWithdrawal = Number(minimumWithdrawal);
    if (maximumWithdrawal !== undefined)
      withdrawMethod.maximumWithdrawal = Number(maximumWithdrawal);
    if (processingTime) withdrawMethod.processingTime = processingTime;
    if (status !== undefined) withdrawMethod.status = status;
    if (withdrawalFee !== undefined)
      withdrawMethod.withdrawalFee = Number(withdrawalFee);
    if (feeType) withdrawMethod.feeType = feeType;
    if (colors) withdrawMethod.colors = JSON.parse(colors);
    if (instructionEn !== undefined)
      withdrawMethod.instructionEn = instructionEn;
    if (instructionBn !== undefined)
      withdrawMethod.instructionBn = instructionBn;
    if (userInputFields)
      withdrawMethod.userInputFields = JSON.parse(userInputFields);

    await withdrawMethod.save();

    res.status(200).json({
      success: true,
      withdrawMethod,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Delete withdraw method
export const deleteWithdrawMethod = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const withdrawMethod = await WithdrawMethod.findByIdAndDelete(id);

    if (!withdrawMethod) {
      res.status(404).json({ message: "Withdraw method not found" });
      return;
    }

    // Delete method image
    if (withdrawMethod.methodImage) {
      const methodImagePath = path.join(
        __dirname,
        "../../",
        withdrawMethod.methodImage.replace(/^\//, "")
      );
      if (fs.existsSync(methodImagePath)) {
        fs.unlinkSync(methodImagePath);
      }
    }

    // Delete withdraw page image
    if (withdrawMethod.withdrawPageImage) {
      const withdrawImagePath = path.join(
        __dirname,
        "../../",
        withdrawMethod.withdrawPageImage.replace(/^\//, "")
      );
      if (fs.existsSync(withdrawImagePath)) {
        fs.unlinkSync(withdrawImagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Withdraw method deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Public: Get active withdraw methods
export const getActiveWithdrawMethods = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const withdrawMethods = await WithdrawMethod.find({
      status: "Active",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: withdrawMethods.length,
      withdrawMethods,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Public: Get single active withdraw method
export const getActiveWithdrawMethod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const withdrawMethod = await WithdrawMethod.findOne({
      _id: id,
      status: "Active",
    });

    if (!withdrawMethod) {
      res.status(404).json({ message: "Withdraw method not found" });
      return;
    }

    res.status(200).json({
      success: true,
      withdrawMethod,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
