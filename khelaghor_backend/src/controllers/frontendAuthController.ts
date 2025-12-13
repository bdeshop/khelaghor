import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import FrontendUser from "../models/FrontendUser";

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const generateReferralCode = (userName: string): string => {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${userName.substring(0, 4).toUpperCase()}${randomStr}`;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userName,
      password,
      friendReferrerCode,
      phone,
      callingCode,
      captcha,
      balance,
    } = req.body;

    // TODO: Implement captcha verification
    if (!captcha) {
      res.status(400).json({ message: "Captcha is required" });
      return;
    }

    // Check if username already exists
    const userNameExists = await FrontendUser.findOne({ userName });
    if (userNameExists) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    // Check if phone already exists
    const phoneExists = await FrontendUser.findOne({ phone });
    if (phoneExists) {
      res.status(400).json({ message: "Phone number already exists" });
      return;
    }

    // Verify referral code if provided
    let referredByUser = null;
    if (friendReferrerCode) {
      referredByUser = await FrontendUser.findOne({
        myReferralCode: friendReferrerCode,
      });
      if (!referredByUser) {
        res.status(400).json({ message: "Invalid referral code" });
        return;
      }
    }

    // Generate unique referral code
    let myReferralCode = generateReferralCode(userName);
    let codeExists = await FrontendUser.findOne({ myReferralCode });
    while (codeExists) {
      myReferralCode = generateReferralCode(userName);
      codeExists = await FrontendUser.findOne({ myReferralCode });
    }

    const user = await FrontendUser.create({
      userName,
      password,
      myReferralCode,
      friendReferrerCode: friendReferrerCode || "",
      referredBy: referredByUser ? referredByUser.userName : "",
      phone,
      callingCode: callingCode || "880",
      balance: balance || 0,
    });
    const token = signToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        userName: user.userName,
        myReferralCode: user.myReferralCode,
        phone: user.phone,
        callingCode: user.callingCode,
        balance: user.balance,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      res.status(400).json({ message: "Please provide userName and password" });
      return;
    }

    const user = await FrontendUser.findOne({ userName }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = signToken(user._id.toString());

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        userName: user.userName,
        myReferralCode: user.myReferralCode,
        phone: user.phone,
        callingCode: user.callingCode,
        balance: user.balance,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({
        message:
          "Please provide current password, new password and confirm password",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
      return;
    }

    if (newPassword.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
      return;
    }

    // Get user ID from token (assuming middleware sets req.user)
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await FrontendUser.findById(userId).select("+password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ message: "Current password is incorrect" });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullName, birthday, phone, email } = req.body;

    // Get user ID from token
    const userId = (req as any).user?._id;
    if (!userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await FrontendUser.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const phoneExists = await FrontendUser.findOne({ phone });
      if (phoneExists) {
        res.status(400).json({ message: "Phone number already in use" });
        return;
      }
      user.phone = phone;
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await FrontendUser.findOne({ email });
      if (emailExists) {
        res.status(400).json({ message: "Email already in use" });
        return;
      }
      user.email = email;
    }

    // Update other fields
    if (fullName !== undefined) user.fullName = fullName;
    if (birthday !== undefined && birthday !== "") {
      const parsedDate = new Date(birthday);
      if (!isNaN(parsedDate.getTime())) {
        user.birthday = parsedDate;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        birthday: user.birthday,
        phone: user.phone,
        email: user.email,
        myReferralCode: user.myReferralCode,
        callingCode: user.callingCode,
        balance: user.balance,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
