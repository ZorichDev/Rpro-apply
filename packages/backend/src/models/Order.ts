import { Schema, model, Document, Types } from "mongoose";
import { ORDER_STATUS, OrderStatus, CURRENCIES, Currency } from "shared";

export interface IOrder extends Document {
  studentId: Types.ObjectId;
  serviceId: Types.ObjectId;
  vendorId: Types.ObjectId;
  amount: number;
  currency: Currency;
  status: OrderStatus;
  // Set at order-creation time from the student's own referredBy — a
  // referral is attributed to whoever brought the student onto the
  // platform, not whoever they happen to be dealing with at checkout.
  referralPartnerId?: Types.ObjectId;
  // Set by admin, not automatically — "closing" isn't something the
  // system can detect on its own. Default is referral-only (7%); admin
  // marks this true when the partner both referred the student AND
  // closed the sale themselves, per the R-Pro Group Incentive &
  // Commission Policy's 10% self-close tier.
  isSelfClose: boolean;
  commissionRate: number;
  // Always the same currency as `amount` above — commission is a
  // percentage of what was actually charged, in the currency it was
  // actually charged in. Never converted to a single "reporting"
  // currency, since partners and vendors span multiple countries.
  commissionAmount: number;
  paidAt?: Date;
  // Flutterwave fields. txRef is generated when the order is created and
  // sent to Flutterwave at checkout time; flwTransactionId is only set
  // after the payment is verified server-side.
  txRef: string;
  flwTransactionId?: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: CURRENCIES, required: true },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    referralPartnerId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    isSelfClose: { type: Boolean, default: false },
    // 7% referral-only commission rate, per the R-Pro Group Incentive &
    // Commission Policy referenced in the brief. Stored per-order (not
    // just looked up live) so a future rate change doesn't rewrite history.
    commissionRate: { type: Number, default: 0.07 },
    commissionAmount: { type: Number, default: 0 },
    paidAt: { type: Date },
    txRef: { type: String, unique: true, sparse: true },
    flwTransactionId: { type: Number },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
