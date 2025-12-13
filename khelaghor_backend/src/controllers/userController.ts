import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import FrontendUser from "../models/FrontendUser";

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await FrontendUser.findById(req.user._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        birthday: user.birthday,
        email: user.email,
        myReferralCode: user.myReferralCode,
        phone: user.phone,
        callingCode: user.callingCode,
        balance: user.balance,
        friendReferrerCode: user.friendReferrerCode,
        referredBy: user.referredBy,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await FrontendUser.find();

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map((user) => ({
        id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        birthday: user.birthday,
        email: user.email,
        myReferralCode: user.myReferralCode,
        phone: user.phone,
        callingCode: user.callingCode,
        balance: user.balance,
        friendReferrerCode: user.friendReferrerCode,
        referredBy: user.referredBy,
        role: user.role,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userName, phone, callingCode, balance, friendReferrerCode } =
      req.body;

    const user = await FrontendUser.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (userName) user.userName = userName;
    if (phone) user.phone = phone;
    if (callingCode) user.callingCode = callingCode;
    if (balance !== undefined) user.balance = balance;
    if (friendReferrerCode !== undefined)
      user.friendReferrerCode = friendReferrerCode;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        birthday: user.birthday,
        email: user.email,
        myReferralCode: user.myReferralCode,
        phone: user.phone,
        callingCode: user.callingCode,
        balance: user.balance,
        friendReferrerCode: user.friendReferrerCode,
        referredBy: user.referredBy,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await FrontendUser.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMyBalance = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await FrontendUser.findById(req.user._id).select(
      "balance userName"
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
      balance: user.balance,
      userName: user.userName,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
