import { model, Schema } from "mongoose";

const PaymentInfoSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    info: {
      type: String,
      required: true,
      default: "Not Available",
    },
  },
  {
    timestamps: true,
  }
);

const PaymentInfo = model("PaymentInfo", PaymentInfoSchema);

export default PaymentInfo;
