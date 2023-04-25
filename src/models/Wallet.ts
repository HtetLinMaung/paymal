import { Schema, model, Decimal128 } from "mongoose";

export interface IWallet extends Document {
  _id: string;
  balance: Decimal128;
  transactions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema(
  {
    balance: {
      type: Schema.Types.Decimal128,
      default: 0,
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IWallet>("Wallet", walletSchema);
