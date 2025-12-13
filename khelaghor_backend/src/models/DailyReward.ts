import mongoose, { Document, Schema } from "mongoose";

export interface IDailyReward extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  rewardDate: Date;
  isClaimed: boolean;
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DailyRewardSchema = new Schema<IDailyReward>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "FrontendUser",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    rewardDate: {
      type: Date,
      required: true,
    },
    isClaimed: {
      type: Boolean,
      default: false,
    },
    claimedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for faster queries
DailyRewardSchema.index({ userId: 1, rewardDate: 1 });
DailyRewardSchema.index({ userId: 1, isClaimed: 1 });

export default mongoose.model<IDailyReward>("DailyReward", DailyRewardSchema);
