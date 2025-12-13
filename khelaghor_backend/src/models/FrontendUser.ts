import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IFrontendUser extends Document {
  userName: string;
  password: string;
  myReferralCode: string;
  friendReferrerCode?: string;
  referredBy?: string;
  fullName?: string;
  birthday?: Date;
  phone: number;
  email?: string;
  callingCode: string;
  balance: number;
  role: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const frontendUserSchema = new Schema<IFrontendUser>({
  userName: {
    type: String,
    required: [true, "Please provide a userName"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  myReferralCode: {
    type: String,
    unique: true,
    required: true,
  },
  friendReferrerCode: {
    type: String,
    default: "",
  },
  referredBy: {
    type: String,
    default: "",
  },
  fullName: {
    type: String,
    default: "",
  },
  birthday: {
    type: Date,
  },
  phone: {
    type: Number,
    required: [true, "Please provide a phone number"],
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    sparse: true,
  },
  callingCode: {
    type: String,
    required: [true, "Please provide a calling code"],
    default: "880",
  },
  balance: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

frontendUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

frontendUserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IFrontendUser>(
  "FrontendUser",
  frontendUserSchema
);
