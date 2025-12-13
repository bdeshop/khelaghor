import mongoose, { Document, Schema } from "mongoose";

export interface IAppVersion extends Document {
  version: string;
  apkUrl: string;
  fileSize?: string;
  releaseNotes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appVersionSchema = new Schema<IAppVersion>(
  {
    version: {
      type: String,
      required: [true, "Please provide version number"],
    },
    apkUrl: {
      type: String,
      required: [true, "Please provide APK URL"],
    },
    fileSize: {
      type: String,
    },
    releaseNotes: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAppVersion>("AppVersion", appVersionSchema);
