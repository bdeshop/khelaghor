import mongoose, { Document, Schema } from "mongoose";

export interface IUserInputField {
  name: string;
  type: string;
  isRequired: boolean;
  label_en: string;
  label_bd: string;
  instruction_en: string;
  instruction_bd: string;
}

export interface IDepositMethod extends Document {
  method_name_en: string;
  method_name_bd: string;
  agent_wallet_number: string;
  agent_wallet_text: string;
  gateways: string[];
  method_image: string;
  payment_page_image: string;
  text_color: string;
  background_color: string;
  button_color: string;
  status: "Active" | "Inactive";
  instruction_en: string;
  instruction_bd: string;
  user_input_fields: IUserInputField[];
  createdAt: Date;
  updatedAt: Date;
}

const UserInputFieldSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, default: "text" },
    isRequired: { type: Boolean, default: false },
    label_en: { type: String, default: "" },
    label_bd: { type: String, default: "" },
    instruction_en: { type: String, default: "" },
    instruction_bd: { type: String, default: "" },
  },
  { _id: false }
);

const DepositMethodSchema = new Schema<IDepositMethod>(
  {
    method_name_en: { type: String, required: true },
    method_name_bd: { type: String, required: true },
    agent_wallet_number: { type: String, required: true },
    agent_wallet_text: { type: String, default: "" },
    gateways: { type: [String], default: [] },
    method_image: { type: String, default: "" },
    payment_page_image: { type: String, default: "" },
    text_color: { type: String, default: "#000000" },
    background_color: { type: String, default: "#ffffff" },
    button_color: { type: String, default: "#007bff" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    instruction_en: { type: String, default: "" },
    instruction_bd: { type: String, default: "" },
    user_input_fields: { type: [UserInputFieldSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IDepositMethod>(
  "DepositMethod",
  DepositMethodSchema
);
