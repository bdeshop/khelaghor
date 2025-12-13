import mongoose, { Document, Schema } from "mongoose";

export interface IGame extends Document {
  title: string;
  image: string;
  url: string;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const gameSchema = new Schema<IGame>(
  {
    title: {
      type: String,
      required: [true, "Game title is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Game image is required"],
    },
    url: {
      type: String,
      required: [true, "Game URL is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "GameCategory",
      required: [true, "Game category is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IGame>("Game", gameSchema);
