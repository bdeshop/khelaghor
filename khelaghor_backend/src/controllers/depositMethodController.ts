import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import DepositMethod from "../models/DepositMethod";
import path from "path";
import fs from "fs";

// Admin: Create deposit method
export const createDepositMethod = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("=== CREATE DEPOSIT METHOD ===");
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Request Files:", req.files);

    const {
      method_name_en,
      method_name_bd,
      agent_wallet_number,
      agent_wallet_text,
      gateways,
      text_color,
      background_color,
      button_color,
      status,
      instruction_en,
      instruction_bd,
      user_input_fields,
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const method_image = files?.method_image?.[0]
      ? `/uploads/${files.method_image[0].filename}`
      : "";
    const payment_page_image = files?.payment_page_image?.[0]
      ? `/uploads/${files.payment_page_image[0].filename}`
      : "";

    const createData = {
      method_name_en,
      method_name_bd,
      agent_wallet_number,
      agent_wallet_text: agent_wallet_text || "",
      gateways: gateways ? JSON.parse(gateways) : [],
      method_image,
      payment_page_image,
      text_color: text_color || "#000000",
      background_color: background_color || "#ffffff",
      button_color: button_color || "#007bff",
      status: status || "Active",
      instruction_en: instruction_en || "",
      instruction_bd: instruction_bd || "",
      user_input_fields: user_input_fields ? JSON.parse(user_input_fields) : [],
    };

    console.log("Data to create:", JSON.stringify(createData, null, 2));

    const depositMethod = await DepositMethod.create(createData);

    console.log(
      "Created deposit method:",
      JSON.stringify(depositMethod, null, 2)
    );

    res.status(201).json({
      success: true,
      depositMethod,
    });
  } catch (error) {
    console.error("Error creating deposit method:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Get all deposit methods
export const getAllDepositMethodsAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const depositMethods = await DepositMethod.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: depositMethods.length,
      depositMethods,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Get single deposit method
export const getDepositMethodAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const depositMethod = await DepositMethod.findById(id);

    if (!depositMethod) {
      res.status(404).json({ message: "Deposit method not found" });
      return;
    }

    res.status(200).json({
      success: true,
      depositMethod,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Update deposit method
export const updateDepositMethod = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log("=== UPDATE DEPOSIT METHOD ===");
    console.log("ID:", id);
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Request Files:", req.files);

    if (!id || id === "undefined") {
      res.status(400).json({ message: "Valid deposit method ID is required" });
      return;
    }

    const {
      method_name_en,
      method_name_bd,
      agent_wallet_number,
      agent_wallet_text,
      gateways,
      text_color,
      background_color,
      button_color,
      status,
      instruction_en,
      instruction_bd,
      user_input_fields,
    } = req.body;

    const depositMethod = await DepositMethod.findById(id);

    if (!depositMethod) {
      res.status(404).json({ message: "Deposit method not found" });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Handle method image update
    if (files?.method_image?.[0]) {
      if (depositMethod.method_image) {
        const oldImagePath = path.join(
          __dirname,
          "../../",
          depositMethod.method_image.replace(/^\//, "")
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      depositMethod.method_image = `/uploads/${files.method_image[0].filename}`;
    }

    // Handle payment page image update
    if (files?.payment_page_image?.[0]) {
      if (depositMethod.payment_page_image) {
        const oldImagePath = path.join(
          __dirname,
          "../../",
          depositMethod.payment_page_image.replace(/^\//, "")
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      depositMethod.payment_page_image = `/uploads/${files.payment_page_image[0].filename}`;
    }

    if (method_name_en) depositMethod.method_name_en = method_name_en;
    if (method_name_bd) depositMethod.method_name_bd = method_name_bd;
    if (agent_wallet_number)
      depositMethod.agent_wallet_number = agent_wallet_number;
    if (agent_wallet_text !== undefined)
      depositMethod.agent_wallet_text = agent_wallet_text;
    if (gateways) depositMethod.gateways = JSON.parse(gateways);
    if (text_color) depositMethod.text_color = text_color;
    if (background_color) depositMethod.background_color = background_color;
    if (button_color) depositMethod.button_color = button_color;
    if (status !== undefined) depositMethod.status = status;
    if (instruction_en !== undefined)
      depositMethod.instruction_en = instruction_en;
    if (instruction_bd !== undefined)
      depositMethod.instruction_bd = instruction_bd;
    if (user_input_fields)
      depositMethod.user_input_fields = JSON.parse(user_input_fields);

    await depositMethod.save();

    res.status(200).json({
      success: true,
      depositMethod,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Admin: Delete deposit method
export const deleteDepositMethod = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const depositMethod = await DepositMethod.findByIdAndDelete(id);

    if (!depositMethod) {
      res.status(404).json({ message: "Deposit method not found" });
      return;
    }

    // Delete method image
    if (depositMethod.method_image) {
      const methodImagePath = path.join(
        __dirname,
        "../../",
        depositMethod.method_image.replace(/^\//, "")
      );
      if (fs.existsSync(methodImagePath)) {
        fs.unlinkSync(methodImagePath);
      }
    }

    // Delete payment page image
    if (depositMethod.payment_page_image) {
      const paymentImagePath = path.join(
        __dirname,
        "../../",
        depositMethod.payment_page_image.replace(/^\//, "")
      );
      if (fs.existsSync(paymentImagePath)) {
        fs.unlinkSync(paymentImagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Deposit method deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Public: Get active deposit methods
export const getActiveDepositMethods = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const depositMethods = await DepositMethod.find({ status: "Active" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: depositMethods.length,
      depositMethods,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Public: Get single active deposit method
export const getActiveDepositMethod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const depositMethod = await DepositMethod.findOne({
      _id: id,
      status: "Active",
    });

    if (!depositMethod) {
      res.status(404).json({ message: "Deposit method not found" });
      return;
    }

    res.status(200).json({
      success: true,
      depositMethod,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
