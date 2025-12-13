import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import DashboardUser from "../models/DashboardUser";
import FrontendUser from "../models/FrontendUser";

export interface AuthRequest extends Request {
  user?: any;
}

export const protectDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    console.log("🔍 Headers:", req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("❌ No token found");
      res.status(401).json({ message: "Not authorized to access this route" });
      return;
    }

    console.log("🎫 Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    console.log("🔓 Decoded:", decoded);

    req.user = await DashboardUser.findById(decoded.id);
    console.log("👤 User found:", req.user ? "YES" : "NO");
    console.log("👤 User ID:", decoded.id);

    if (!req.user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    next();
  } catch (error) {
    console.log("💥 Error:", error);
    res.status(401).json({ message: "Not authorized to access this route" });
  }
};

export const protectFrontend = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    console.log("🔍 [Frontend Auth] Headers:", req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("❌ [Frontend Auth] No token found");
      res.status(401).json({ message: "Not authorized to access this route" });
      return;
    }

    console.log("🎫 [Frontend Auth] Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    console.log("🔓 [Frontend Auth] Decoded:", decoded);

    req.user = await FrontendUser.findById(decoded.id);
    console.log("👤 [Frontend Auth] User found:", req.user ? "YES" : "NO");

    if (req.user) {
      console.log("👤 [Frontend Auth] User ID:", req.user._id);
      console.log("👤 [Frontend Auth] Username:", req.user.userName);
    }

    if (!req.user) {
      console.log("❌ [Frontend Auth] User not found in database");
      res.status(401).json({ message: "User not found" });
      return;
    }

    console.log("✅ [Frontend Auth] Authentication successful");
    next();
  } catch (error: any) {
    console.log("💥 [Frontend Auth] Error:", error.message);
    console.log("💥 [Frontend Auth] Error Type:", error.name);
    res.status(401).json({ message: "Not authorized to access this route" });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
      return;
    }
    next();
  };
};
