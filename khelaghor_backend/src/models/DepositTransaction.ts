import mongoose, { Document, Schema } from "mongoose";

export interface IDepositTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  depositMethodId: mongoose.Types.ObjectId;
  transactionId: string;
  amount: number;
  userInputData: Record<string, any>;
  status: "pending" | "approved" | "cancelled";
  adminNote?: string;
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DepositTransactionSchema = new Schema<IDepositTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "FrontendUser",
      required: true,
    },
    depositMethodId: {
      type: Schema.Types.ObjectId,
      ref: "DepositMethod",
      required: true,
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than 0"],
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
DepositTransactionSchema.index({ userId: 1, status: 1 });
DepositTransactionSchema.index({ transactionId: 1 });

export default mongoose.model<IDepositTransaction>(
  "DepositTransaction",
  DepositTransactionSchema
);
