import mongoose, { Schema } from "mongoose";
import { IOrder } from "../interfaces/IOrder";
import { TableOrderStatus } from "../enums/TableOrderStatus";
import { OrderItemSchema } from "./OrderItemModel";
import { PaymentMethodStatus } from "../enums/PaymentMethodStatus";

// Order Schema
const OrderSchema: Schema = new Schema(
  {
    tableId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tableName: { type: String },
    userName: { type: String },
    totalPrice: { type: mongoose.Types.Decimal128, required: true },
    status: {
      type: String,
      enum: Object.values(TableOrderStatus),
      default: TableOrderStatus.PENDING,
    },
    orderItems: [OrderItemSchema],
    orderTime: { type: Date },
    queueSizeAtOrder: { type: Number },
    availableChefsAtOrder: { type: Number },
    paymentMethod: {
      type: String,
      enum: PaymentMethodStatus,
      default: "CARD",
    },
  },
  { timestamps: true } // auto create createdAt, updatedAt
);

const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
