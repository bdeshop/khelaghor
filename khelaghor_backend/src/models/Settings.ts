import mongoose, { Document, Schema } from "mongoose";

export interface ISettings extends Document {
  telegram: string;
  email: string;
  bannerTextEnglish: string;
  bannerTextBangla: string;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    telegram: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    bannerTextEnglish: {
      type: String,
      default: "",
    },
    bannerTextBangla: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISettings>("Settings", settingsSchema);
