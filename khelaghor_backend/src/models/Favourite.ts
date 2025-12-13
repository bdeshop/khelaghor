import mongoose, { Document, Schema } from "mongoose";

export interface IFavourite extends Document {
  image: string;
  title: string;
  actionType: "url" | "modal";
  url?: string;
  modalOptions?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const favouriteSchema = new Schema<IFavourite>(
  {
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    actionType: {
      type: String,
      enum: ["url", "modal"],
      required: [true, "Please specify action type"],
    },
    url: {
      type: String,
      required: function (this: IFavourite) {
        return this.actionType === "url";
      },
    },
    modalOptions: {
      type: String,
      required: function (this: IFavourite) {
        return this.actionType === "modal";
      },
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

export default mongoose.model<IFavourite>("Favourite", favouriteSchema);
