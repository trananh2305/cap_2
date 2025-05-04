import { Document } from "mongoose";
import { ITable } from "./ITable";
import { IUser } from "./IUser";
import { IOrderItem } from "./IOrderItem";
import { TableOrderStatus } from "../enums/TableOrderStatus";

export interface IOrder extends Document {
  tableId: ITable["_id"];
  userId?: IUser["_id"];
  tableName: string;
  userName: string;
  totalPrice: number;
  status: TableOrderStatus;
  orderItems: IOrderItem[];
  orderTime: Date;
  queueSizeAtOrder: number;
  availableChefsAtOrder: number;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}