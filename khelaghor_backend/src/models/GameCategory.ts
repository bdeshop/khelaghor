import mongoose, { Document, Schema } from "mongoose";

export interface IGameCategory extends Document {
  name: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const gameCategorySchema = new Schema<IGameCategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGameCategory>(
  "GameCategory",
  gameCategorySchema
);
