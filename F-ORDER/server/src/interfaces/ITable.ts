import { Document } from "mongoose";
import { TableStatus } from "../enums/TableStatus";

export interface ITable extends Document {
  tableNumber: string;
  qrCode: string;
  status: TableStatus;
  slug: string;
  waitingTimeAt: Date;
}
