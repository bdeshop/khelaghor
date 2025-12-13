import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  title: string;
  imageUrl: string;
  textEnglish?: string;
  textBangla?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image"],
    },
    textEnglish: {
      type: String,
      default: "",
    },
    textBangla: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBanner>("Banner", bannerSchema);
