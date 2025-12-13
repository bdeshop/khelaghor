import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import FrontendUser from "../models/FrontendUser";
import DailyReward from "../models/DailyReward";
import RewardConfig from "../models/RewardConfig";

/**
 * @desc    Get referral and rewards dashboard
 * @route   GET /api/referrals/dashboard
 * @access  Private (Frontend User)
 */
export const getReferralDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await FrontendUser.findById(req.user._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Get referral count
    const referralCount = await FrontendUser.countDocuments({
      referredBy: user.myReferralCode,
    });

    // Get today's date (start and end)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get today's rewards
    const todayRewards = await DailyReward.find({
      userId: user._id,
      rewardDate: { $gte: today, $lt: tomorrow },
    });

    const todayRewardAmount = todayRewards.reduce(
      (sum, reward) => sum + reward.amount,
      0
    );

    // Get yesterday's rewards
    const yesterdayRewards = await DailyReward.find({
      userId: user._id,
      rewardDate: { $gte: yesterday, $lt: today },
    });

    const yesterdayRewardAmount = yesterdayRewards.reduce(
      (sum, reward) => sum + reward.amount,
      0
    );

    // Get available (unclaimed) rewards
    const unclaimedRewards = await DailyReward.find({
      userId: user._id,
      isClaimed: false,
    });

    const availableCashRewards = unclaimedRewards.reduce(
      (sum, reward) => sum + reward.amount,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        myReferralCode: user.myReferralCode,
        referralCount,
        todayRewards: todayRewardAmount,
        yesterdayRewards: yesterdayRewardAmount,
        availableCashRewards,
        balance: user.balance,
      },
    });
  } catch (error: any) {
    console.error("Error fetching referral dashboard:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get list of referred users
 * @route   GET /api/referrals/my-referrals
 * @access  Private (Frontend User)
 */
export const getMyReferrals = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await FrontendUser.findById(req.user._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const referredUsers = await FrontendUser.find({
      referredBy: user.myReferralCode,
    }).select("userName phone createdAt");

    res.status(200).json({
      success: true,
      count: referredUsers.length,
      referrals: referredUsers,
    });
  } catch (error: any) {
    console.error("Error fetching referrals:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Claim available rewards
 * @route   POST /api/referrals/claim-rewards
 * @access  Private (Frontend User)
 */
export const claimRewards = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await FrontendUser.findById(req.user._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Get unclaimed rewards
    const unclaimedRewards = await DailyReward.find({
      userId: user._id,
      isClaimed: false,
    });

    if (unclaimedRewards.length === 0) {
      res.status(400).json({
        success: false,
        message: "No rewards available to claim",
      });
      return;
    }

    const totalRewardAmount = unclaimedRewards.reduce(
      (sum, reward) => sum + reward.amount,
      0
    );

    // Check minimum claim amount
    const config = await RewardConfig.findOne();
    if (config && totalRewardAmount < config.minimumClaimAmount) {
      res.status(400).json({
        success: false,
        message: `Minimum claim amount is ${config.minimumClaimAmount}. You have ${totalRewardAmount}`,
      });
      return;
    }

    // Add rewards to user balance
    user.balance += totalRewardAmount;
    await user.save();

    // Mark rewards as claimed
    const now = new Date();
    await DailyReward.updateMany(
      { userId: user._id, isClaimed: false },
      { isClaimed: true, claimedAt: now }
    );

    res.status(200).json({
      success: true,
      message: "Rewards claimed successfully",
      data: {
        claimedAmount: totalRewardAmount,
        newBalance: user.balance,
        rewardsClaimed: unclaimedRewards.length,
      },
    });
  } catch (error: any) {
    console.error("Error claiming rewards:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get reward history
 * @route   GET /api/referrals/reward-history
 * @access  Private (Frontend User)
 */
export const getRewardHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const rewards = await DailyReward.find({
      userId: req.user._id,
    }).sort({ rewardDate: -1 });

    res.status(200).json({
      success: true,
      count: rewards.length,
      rewards,
    });
  } catch (error: any) {
    console.error("Error fetching reward history:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Generate daily rewards for a user (Admin or Cron Job)
 * @route   POST /api/referrals/admin/generate-daily-reward
 * @access  Private (Admin)
 */
export const generateDailyReward = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "Please provide userId",
      });
      return;
    }

    const user = await FrontendUser.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Get reward config
    const config = await RewardConfig.findOne();
    const rewardAmount = config?.dailyRewardAmount || 10;

    // Check if reward already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingReward = await DailyReward.findOne({
      userId,
      rewardDate: { $gte: today, $lt: tomorrow },
    });

    if (existingReward) {
      res.status(400).json({
        success: false,
        message: "Daily reward already generated for today",
      });
      return;
    }

    // Create daily reward
    const reward = await DailyReward.create({
      userId,
      amount: rewardAmount,
      rewardDate: today,
      isClaimed: false,
    });

    res.status(201).json({
      success: true,
      message: "Daily reward generated successfully",
      reward,
    });
  } catch (error: any) {
    console.error("Error generating daily reward:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get or create reward configuration
 * @route   GET /api/referrals/admin/config
 * @access  Private (Admin)
 */
export const getRewardConfig = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let config = await RewardConfig.findOne();

    if (!config) {
      config = await RewardConfig.create({
        dailyRewardAmount: 10,
        referralBonusAmount: 50,
        minimumClaimAmount: 10,
        isActive: true,
      });
    }

    res.status(200).json({
      success: true,
      config,
    });
  } catch (error: any) {
    console.error("Error fetching reward config:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Update reward configuration
 * @route   PUT /api/referrals/admin/config
 * @access  Private (Admin)
 */
export const updateRewardConfig = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      dailyRewardAmount,
      referralBonusAmount,
      minimumClaimAmount,
      isActive,
    } = req.body;

    let config = await RewardConfig.findOne();

    if (!config) {
      config = await RewardConfig.create({
        dailyRewardAmount: dailyRewardAmount || 10,
        referralBonusAmount: referralBonusAmount || 50,
        minimumClaimAmount: minimumClaimAmount || 10,
        isActive: isActive !== undefined ? isActive : true,
      });
    } else {
      if (dailyRewardAmount !== undefined)
        config.dailyRewardAmount = dailyRewardAmount;
      if (referralBonusAmount !== undefined)
        config.referralBonusAmount = referralBonusAmount;
      if (minimumClaimAmount !== undefined)
        config.minimumClaimAmount = minimumClaimAmount;
      if (isActive !== undefined) config.isActive = isActive;

      await config.save();
    }

    res.status(200).json({
      success: true,
      message: "Reward configuration updated successfully",
      config,
    });
  } catch (error: any) {
    console.error("Error updating reward config:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/**
 * @desc    Get all users' referral statistics (Admin)
 * @route   GET /api/referrals/admin/statistics
 * @access  Private (Admin)
 */
export const getReferralStatistics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const totalUsers = await FrontendUser.countDocuments();
    const usersWithReferrals = await FrontendUser.countDocuments({
      referredBy: { $ne: "" },
    });

    const totalRewardsGenerated = await DailyReward.countDocuments();
    const totalRewardsClaimed = await DailyReward.countDocuments({
      isClaimed: true,
    });

    const allRewards = await DailyReward.find();
    const totalRewardAmount = allRewards.reduce(
      (sum, reward) => sum + reward.amount,
      0
    );

    const claimedRewards = await DailyReward.find({ isClaimed: true });
    const totalClaimedAmount = claimedRewards.reduce(
      (sum, reward) => sum + reward.amount,
      0
    );

    res.status(200).json({
      success: true,
      statistics: {
        totalUsers,
        usersWithReferrals,
        totalRewardsGenerated,
        totalRewardsClaimed,
        totalRewardAmount,
        totalClaimedAmount,
        pendingRewardAmount: totalRewardAmount - totalClaimedAmount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching referral statistics:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
