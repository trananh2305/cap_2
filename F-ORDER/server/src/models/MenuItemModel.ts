import mongoose, { Schema } from "mongoose";
import { IMenuItem } from "../interfaces/IMenuItem";
import CategoryModel from "./CategoryModel";

// Menu Item Schema
const MenuItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: mongoose.Types.Decimal128, required: true },
    imageUrl: { type: String },
    category: {
      categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      categoryName: { type: String, default: "" },
    },
    estimatedTime: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    difficultyLevel: { type: Number, default: 1, require: true }, // 1-5
  },
  { timestamps: true } // auto create createdAt, updatedAt);
);

// Middleware tự động cập nhật categoryName dựa trên categoryId
MenuItemSchema.pre("save", async function (next) {
  if (this.isModified("categoryId")) {
    // Chỉ update khi categoryId thay đổi
    const category = await CategoryModel.findById(this.categoryId);
    if (category) {
      this.categoryName = category.name; // Gán tên danh mục vào menuItem
    }
  }
  next();
});

const MenuItemModel = mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItemModel;
