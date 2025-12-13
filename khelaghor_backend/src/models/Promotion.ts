import mongoose, { Document, Schema } from "mongoose";

export interface IBonusSettings {
  bonusType: "fixed" | "percentage";
  bonusAmount?: number; // for fixed amount (e.g., 100 taka)
  bonusPercentage?: number; // for percentage (e.g., 10%)
  maxBonusAmount?: number; // max cap for percentage bonus
  minDepositAmount?: number; // minimum deposit required
}

export interface IPromotion extends Document {
  promotionImage: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  gameType: mongoose.Types.ObjectId;
  paymentMethods: mongoose.Types.ObjectId[];
  bonusSettings: IBonusSettings;
  createdAt: Date;
  updatedAt: Date;
}

const promotionSchema = new Schema<IPromotion>(
  {
    promotionImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleBn: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    descriptionBn: {
      type: String,
      default: "",
    },
    gameType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameCategory",
      required: true,
    },
    paymentMethods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DepositMethod",
      },
    ],
    bonusSettings: {
      bonusType: {
        type: String,
        enum: ["fixed", "percentage"],
        required: true,
      },
      bonusAmount: {
        type: Number,
        default: 0,
      },
      bonusPercentage: {
        type: Number,
        default: 0,
      },
      maxBonusAmount: {
        type: Number,
        default: 0,
      },
      minDepositAmount: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPromotion>("Promotion", promotionSchema);
