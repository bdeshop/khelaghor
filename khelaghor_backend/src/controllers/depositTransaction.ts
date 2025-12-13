import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import DepositTransaction from "../models/DepositTransaction";
import DepositMethod from "../models/DepositMethod";
import FrontendUser from "../models/FrontendUser";
import DashboardUser from "../models/DashboardUser";

/**
 * @desc    Create a new deposit transaction (Frontend User)
 * @route   POST /api/deposit-transactions
 * @access  Private (Frontend User)
 */
export const createDepositTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("📝 [Create Deposit] Request received");
    console.log(
      "📝 [Create Deposit] User:",
      req.user ? req.user.userName : "NO USER"
    );
    console.log("📝 [Create Deposit] Body:", req.body);

    const { depositMethodId, transactionId, amount, userInputData } = req.body;

    // Validate required fields
    if (!depositMethodId || !transactionId || !amount) {
      console.log("❌ [Create Deposit] Missing required fields");
      res.status(400).json({
        success: false,
        message: "Please provide depositMethodId, transactionId, and amount",
      });
      return;
    }

    // Check if deposit method exists and is active
    const depositMethod = await DepositMethod.findById(depositMethodId);
    if (!depositMethod) {
      res.status(404).json({
        success: false,
        message: "Deposit method not found",
      });
      return;
    }

    if (depositMethod.status !== "Active") {
      res.status(400).json({
        success: false,
        message: "This deposit method is currently inactive",
      });
      return;
    }

    // Check if transaction ID already exists
    const existingTransaction = await DepositTransaction.findOne({
      transactionId,
    });
    if (existingTransaction) {
      res.status(400).json({
        success: false,
        message: "Transaction ID already exists",
      });
      return;
    }

    // Create deposit transaction
    const depositTransaction = await DepositTransaction.create({
      userId: req.user._id,
      depositMethodId,
      transactionId,
      amount,
      userInputData: userInputData || {},
      status: "pending",
    });

    const populatedTransaction = await DepositTransaction.findById(
      depositTransaction._id
    )
      .populate("userId", "userName phone email")
      .populate("depositMethodId", "method_name_en method_name_bd");

    res.status(201).json({
      success: true,
      message: "Deposit transaction created successfully",
      transaction: populatedTransaction,
    });
  } catch (error: any) {
    console.error("Error creating deposit transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get user's own deposit transactions
 * @route   GET /api/deposit-transactions/my-transactions
 * @access  Private (Frontend User)
 */
export const getMyDepositTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = { userId: req.user._id };

    if (status) {
      filter.status = status;
    }

    const transactions = await DepositTransaction.find(filter)
      .populate("depositMethodId", "method_name_en method_name_bd")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error: any) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get single deposit transaction (User's own)
 * @route   GET /api/deposit-transactions/:id
 * @access  Private (Frontend User)
 */
export const getMyDepositTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const transaction = await DepositTransaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate("depositMethodId")
      .populate("processedBy", "name email");

    if (!transaction) {
      res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error: any) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get all deposit transactions (Admin)
 * @route   GET /api/deposit-transactions/admin/all
 * @access  Private (Admin)
 */
export const getAllDepositTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, userId, depositMethodId } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (depositMethodId) filter.depositMethodId = depositMethodId;

    const transactions = await DepositTransaction.find(filter)
      .populate("userId", "userName phone email balance")
      .populate("depositMethodId", "method_name_en method_name_bd")
      .populate("processedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error: any) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get single deposit transaction (Admin)
 * @route   GET /api/deposit-transactions/admin/:id
 * @access  Private (Admin)
 */
export const getDepositTransactionById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const transaction = await DepositTransaction.findById(req.params.id)
      .populate("userId", "userName phone email balance")
      .populate("depositMethodId")
      .populate("processedBy", "name email");

    if (!transaction) {
      res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error: any) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Update deposit transaction status (Admin)
 * @route   PUT /api/deposit-transactions/admin/:id
 * @access  Private (Admin)
 */
export const updateDepositTransactionStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, adminNote } = req.body;

    if (!status || !["approved", "cancelled"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid status (approved or cancelled)",
      });
      return;
    }

    const transaction = await DepositTransaction.findById(req.params.id);

    if (!transaction) {
      res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
      return;
    }

    if (transaction.status !== "pending") {
      res.status(400).json({
        success: false,
        message: `Transaction is already ${transaction.status}`,
      });
      return;
    }

    // If approved, add balance to user
    if (status === "approved") {
      const user = await FrontendUser.findById(transaction.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      user.balance += transaction.amount;
      await user.save();
    }

    // Update transaction
    transaction.status = status;
    transaction.adminNote = adminNote || "";
    transaction.processedBy = req.user._id;
    transaction.processedAt = new Date();
    await transaction.save();

    const updatedTransaction = await DepositTransaction.findById(
      transaction._id
    )
      .populate("userId", "userName phone email balance")
      .populate("depositMethodId", "method_name_en method_name_bd")
      .populate("processedBy", "name email");

    res.status(200).json({
      success: true,
      message: `Transaction ${status} successfully`,
      transaction: updatedTransaction,
    });
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get deposit transaction statistics (Admin)
 * @route   GET /api/deposit-transactions/admin/statistics
 * @access  Private (Admin)
 */
export const getDepositStatistics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const totalPending = await DepositTransaction.countDocuments({
      status: "pending",
    });
    const totalApproved = await DepositTransaction.countDocuments({
      status: "approved",
    });
    const totalCancelled = await DepositTransaction.countDocuments({
      status: "cancelled",
    });

    const approvedTransactions = await DepositTransaction.find({
      status: "approved",
    });
    const totalApprovedAmount = approvedTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    res.status(200).json({
      success: true,
      statistics: {
        totalPending,
        totalApproved,
        totalCancelled,
        totalApprovedAmount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
