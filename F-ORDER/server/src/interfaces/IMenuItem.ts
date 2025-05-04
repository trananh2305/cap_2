import { Document } from "mongoose";
import { ICategory } from "./ICategory";

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: { 
    categoryId: ICategory["_id"]; 
    categoryName: string 
  };
  estimatedTime: number;
  isAvailable: boolean;
  difficultyLevel: number;
  createdAt: Date;
  updatedAt: Date;
}
