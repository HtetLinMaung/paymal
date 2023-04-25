import { Schema, model } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email?: string;
  pin: string;
  phoneNumber: string;
  wallet: string;
  otpVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    pin: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
    otpVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);
