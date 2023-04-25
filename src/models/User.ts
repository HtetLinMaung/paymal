import { Schema, model } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email?: string;
  password: string;
  phoneNumber: string;
  wallet: string;
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
    password: {
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
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);
