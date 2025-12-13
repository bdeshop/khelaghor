import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import connectDB from "./config/database";
import dashboardAuthRoutes from "./routes/dashboardAuth";
import frontendAuthRoutes from "./routes/frontendAuth";
import dashboardRoutes from "./routes/dashboard";
import userRoutes from "./routes/user";
import favouriteRoutes from "./routes/favourite";
import popularGameRoutes from "./routes/popularGame";
import footerRoutes from "./routes/footer";
import bannerRoutes from "./routes/banner";
import testRoutes from "./routes/test";
import appVersionRoutes from "./routes/appVersion";
import settingsRoutes from "./routes/settings";
import gameCategoryRoutes from "./routes/gameCategory";
import gameRoutes from "./routes/game";
import depositMethodRoutes from "./routes/depositMethod";
import depositTransactionRoutes from "./routes/depositTransaction";
import promotionRoutes from "./routes/promotion";
import withdrawMethodRoutes from "./routes/withdrawMethod";
import withdrawTransactionRoutes from "./routes/withdrawTransaction";
import referralRewardRoutes from "./routes/referralReward";
import themeConfigRoutes from "./routes/themeConfig";

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Logging
app.use(morgan(":method :url :status :response-time ms - :date[clf]"));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to Database
connectDB();

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to Khelaghor API",
    environment: process.env.NODE_ENV,
  });
});

// Dashboard Authentication Routes (Admin & Users)
app.use("/api/dashboard/auth", dashboardAuthRoutes);

// Frontend Authentication Routes (Users only)
app.use("/api/frontend/auth", frontendAuthRoutes);

// Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);

// User Routes
app.use("/api/users", userRoutes);

// Favourite Routes
app.use("/api/favourites", favouriteRoutes);

// Popular Games Routes
app.use("/api/popular-games", popularGameRoutes);

// Footer Routes
app.use("/api/footer", footerRoutes);

// Banner Routes
app.use("/api/banners", bannerRoutes);

// Test Routes
app.use("/api/test", testRoutes);

// App Version Routes
app.use("/api/app-version", appVersionRoutes);

// Settings Routes
app.use("/api/settings", settingsRoutes);

// Game Category Routes
app.use("/api/game-categories", gameCategoryRoutes);

// Game Routes
app.use("/api/games", gameRoutes);

// Deposit Method Routes
app.use("/api/deposit-methods", depositMethodRoutes);

// Deposit Transaction Routes
app.use("/api/deposit-transactions", depositTransactionRoutes);

// Promotion Routes
app.use("/api/promotions", promotionRoutes);

// Withdraw Method Routes
app.use("/api/withdraw-methods", withdrawMethodRoutes);

// Withdraw Transaction Routes
app.use("/api/withdraw-transactions", withdrawTransactionRoutes);

// Referral & Reward Routes
app.use("/api/referrals", referralRewardRoutes);

// Theme Config Routes
app.use("/api/theme-config", themeConfigRoutes);

// Serve static files from uploads directory with CORS headers
app.use("/uploads", cors(corsOptions), express.static("uploads"));

// Serve APK files with CORS headers
app.use("/apk", cors(corsOptions), express.static("apk"));

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});
