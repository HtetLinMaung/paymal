import { Schema, model } from "mongoose";

export interface IUserNotification extends Document {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: "transaction" | "promo" | "system" | "others";
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userNotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUserNotification>(
  "UserNotification",
  userNotificationSchema
);
