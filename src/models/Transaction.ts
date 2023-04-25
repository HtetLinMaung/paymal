import { Schema, model, Decimal128 } from "mongoose";

export interface ITransaction extends Document {
  _id: string;
  groupRef: string;
  sender: string;
  receiver: string;
  amount: Decimal128;
  type: "deposit" | "withdraw" | "transfer";
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema(
  {
    groupRef: { type: String },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    amount: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ITransaction>("Transaction", transactionSchema);
