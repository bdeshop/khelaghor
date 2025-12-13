import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import DashboardUser from "../models/DashboardUser";

import FrontendUser from "../models/FrontendUser";

export const getDashboardMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await DashboardUser.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserBalance = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await FrontendUser.findById(userId).select(
      "userName balance phone"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        userName: user.userName,
        phone: user.phone,
        balance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getAllUsersBalances = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await FrontendUser.find()
      .select("userName balance phone email")
      .sort({ balance: -1 });

    const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);

    res.status(200).json({
      success: true,
      count: users.length,
      totalBalance,
      users: users.map((user) => ({
        id: user._id,
        userName: user.userName,
        phone: user.phone,
        email: user.email,
        balance: user.balance,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
