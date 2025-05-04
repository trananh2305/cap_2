import { Document } from "mongoose";
import { IMenuItem } from "./IMenuItem";
import { FoodStatus } from "../enums/FoodStatus";
import { ObjectId } from "mongoose";

export interface IOrderItem extends Document {
  _id: ObjectId; // ID of the order item
  itemId: ObjectId; // ID of the menu item
  name: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  price: number;
  note: string;
  status: FoodStatus;
  estimatedTime: number; // in minutes
  predictedTime: Date; // time when the item is predicted to be ready
  predictedMinutes: number; // in minutes
  difficultyLevel: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}
