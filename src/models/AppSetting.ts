import { Schema, model } from "mongoose";

export interface IAppSetting extends Document {
  _id: string;
  key: string;
  value: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const appSettingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model<IAppSetting>("AppSetting", appSettingSchema);
