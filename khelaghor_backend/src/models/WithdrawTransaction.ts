import mongoose, { Document, Schema } from "mongoose";

export interface IWithdrawTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  withdrawMethodId: mongoose.Types.ObjectId;
  amount: number;
  withdrawalFee: number;
  netAmount: number;
  userInputData: Record<string, any>;
  status: "pending" | "approved" | "cancelled";
  adminNote?: string;
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawTransactionSchema = new Schema<IWithdrawTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "FrontendUser",
      required: true,
    },
    withdrawMethodId: {
      type: Schema.Types.ObjectId,
      ref: "WithdrawMethod",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than 0"],
    },
    withdrawalFee: {
      type: Number,
      required: true,
      default: 0,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    userInputData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    adminNote: {
      type: String,
      default: "",
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "DashboardUser",
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for faster queries
WithdrawTransactionSchema.index({ userId: 1, status: 1 });
WithdrawTransactionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IWithdrawTransaction>(
  "WithdrawTransaction",
  WithdrawTransactionSchema
);
