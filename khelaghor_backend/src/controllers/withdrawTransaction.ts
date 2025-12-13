import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import WithdrawTransaction from "../models/WithdrawTransaction";
import WithdrawMethod from "../models/WithdrawMethod";
import FrontendUser from "../models/FrontendUser";

/**
 * @desc    Create a new withdraw transaction (Frontend User)
 * @route   POST /api/withdraw-transactions
 * @access  Private (Frontend User)
 */
export const createWithdrawTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("📤 [Create Withdraw] Request received");
    console.log(
      "📤 [Create Withdraw] User:",
      req.user ? req.user.userName : "NO USER"
    );
    console.log("📤 [Create Withdraw] Body:", req.body);

    const { withdrawMethodId, amount, userInputData } = req.body;

    // Validate required fields
    if (!withdrawMethodId || !amount) {
      console.log("❌ [Create Withdraw] Missing required fields");
      res.status(400).json({
        success: false,
        message: "Please provide withdrawMethodId and amount",
      });
      return;
    }

    // Check if withdraw method exists and is active
    const withdrawMethod = await WithdrawMethod.findById(withdrawMethodId);
    if (!withdrawMethod) {
      res.status(404).json({
        success: false,
        message: "Withdraw method not found",
      });
      return;
    }

    if (withdrawMethod.status !== "Active") {
      res.status(400).json({
        success: false,
        message: "This withdraw method is currently inactive",
      });
      return;
    }

    // Check minimum and maximum withdrawal limits
    if (amount < withdrawMethod.minimumWithdrawal) {
      res.status(400).json({
        success: false,
        message: `Minimum withdrawal amount is ${withdrawMethod.minimumWithdrawal}`,
      });
      return;
    }

    if (amount > withdrawMethod.maximumWithdrawal) {
      res.status(400).json({
        success: false,
        message: `Maximum withdrawal amount is ${withdrawMethod.maximumWithdrawal}`,
      });
      return;
    }

    // Calculate withdrawal fee
    let withdrawalFee = 0;
    if (withdrawMethod.feeType === "Fixed") {
      withdrawalFee = withdrawMethod.withdrawalFee;
    } else if (withdrawMethod.feeType === "Percentage") {
      withdrawalFee = (amount * withdrawMethod.withdrawalFee) / 100;
    }

    const netAmount = amount - withdrawalFee;

    // Check if user has sufficient balance
    const user = await FrontendUser.findById(req.user._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.balance < amount) {
      res.status(400).json({
        success: false,
        message: `Insufficient balance. Your balance: ${user.balance}, Required: ${amount}`,
      });
      return;
    }

    // Create withdraw transaction
    const withdrawTransaction = await WithdrawTransaction.create({
      userId: req.user._id,
      withdrawMethodId,
      amount,
      withdrawalFee,
      netAmount,
      userInputData: userInputData || {},
      status: "pending",
    });

    const populatedTransaction = await WithdrawTransaction.findById(
      withdrawTransaction._id
    )
      .populate("userId", "userName phone email balance")
      .populate("withdrawMethodId", "methodNameEn methodNameBn");

    console.log("✅ [Create Withdraw] Transaction created successfully");

    res.status(201).json({
      success: true,
      message: "Withdraw transaction created successfully",
      transaction: populatedTransaction,
    });
  } catch (error: any) {
    console.error("Error creating withdraw transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get user's own withdraw transactions
 * @route   GET /api/withdraw-transactions/my-transactions
 * @access  Private (Frontend User)
 */
export const getMyWithdrawTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = { userId: req.user._id };

    if (status) {
      filter.status = status;
    }

    const transactions = await WithdrawTransaction.find(filter)
      .populate("withdrawMethodId", "methodNameEn methodNameBn")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error: any) {
    console.error("Error fetching user withdraw transactions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get single withdraw transaction (User's own)
 * @route   GET /api/withdraw-transactions/:id
 * @access  Private (Frontend User)
 */
export const getMyWithdrawTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const transaction = await WithdrawTransaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate("withdrawMethodId")
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
    console.error("Error fetching withdraw transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get all withdraw transactions (Admin)
 * @route   GET /api/withdraw-transactions/admin/all
 * @access  Private (Admin)
 */
export const getAllWithdrawTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, userId, withdrawMethodId } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (withdrawMethodId) filter.withdrawMethodId = withdrawMethodId;

    const transactions = await WithdrawTransaction.find(filter)
      .populate("userId", "userName phone email balance")
      .populate("withdrawMethodId", "methodNameEn methodNameBn")
      .populate("processedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error: any) {
    console.error("Error fetching all withdraw transactions:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get single withdraw transaction (Admin)
 * @route   GET /api/withdraw-transactions/admin/:id
 * @access  Private (Admin)
 */
export const getWithdrawTransactionById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const transaction = await WithdrawTransaction.findById(req.params.id)
      .populate("userId", "userName phone email balance")
      .populate("withdrawMethodId")
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
    console.error("Error fetching withdraw transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Update withdraw transaction status (Admin)
 * @route   PUT /api/withdraw-transactions/admin/:id
 * @access  Private (Admin)
 */
export const updateWithdrawTransactionStatus = async (
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

    const transaction = await WithdrawTransaction.findById(req.params.id);

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

    const user = await FrontendUser.findById(transaction.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // If approved, deduct balance from user
    if (status === "approved") {
      // Double check user has sufficient balance
      if (user.balance < transaction.amount) {
        res.status(400).json({
          success: false,
          message: `User has insufficient balance. Current balance: ${user.balance}, Required: ${transaction.amount}`,
        });
        return;
      }

      user.balance -= transaction.amount;
      await user.save();
    }

    // Update transaction
    transaction.status = status;
    transaction.adminNote = adminNote || "";
    transaction.processedBy = req.user._id;
    transaction.processedAt = new Date();
    await transaction.save();

    const updatedTransaction = await WithdrawTransaction.findById(
      transaction._id
    )
      .populate("userId", "userName phone email balance")
      .populate("withdrawMethodId", "methodNameEn methodNameBn")
      .populate("processedBy", "name email");

    res.status(200).json({
      success: true,
      message: `Transaction ${status} successfully`,
      transaction: updatedTransaction,
    });
  } catch (error: any) {
    console.error("Error updating withdraw transaction:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get withdraw transaction statistics (Admin)
 * @route   GET /api/withdraw-transactions/admin/statistics
 * @access  Private (Admin)
 */
export const getWithdrawStatistics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const totalPending = await WithdrawTransaction.countDocuments({
      status: "pending",
    });
    const totalApproved = await WithdrawTransaction.countDocuments({
      status: "approved",
    });
    const totalCancelled = await WithdrawTransaction.countDocuments({
      status: "cancelled",
    });

    const approvedTransactions = await WithdrawTransaction.find({
      status: "approved",
    });

    const totalWithdrawnAmount = approvedTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const totalFeesCollected = approvedTransactions.reduce(
      (sum, t) => sum + t.withdrawalFee,
      0
    );

    res.status(200).json({
      success: true,
      statistics: {
        totalPending,
        totalApproved,
        totalCancelled,
        totalWithdrawnAmount,
        totalFeesCollected,
      },
    });
  } catch (error: any) {
    console.error("Error fetching withdraw statistics:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
