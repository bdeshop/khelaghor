import mongoose, { Document, Schema } from "mongoose";

export interface IRewardConfig extends Document {
  dailyRewardAmount: number;
  referralBonusAmount: number;
  minimumClaimAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RewardConfigSchema = new Schema<IRewardConfig>(
  {
    dailyRewardAmount: {
      type: Number,
      required: true,
      default: 10,
    },
    referralBonusAmount: {
      type: Number,
      required: true,
      default: 50,
    },
    minimumClaimAmount: {
      type: Number,
      required: true,
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRewardConfig>(
  "RewardConfig",
  RewardConfigSchema
);
