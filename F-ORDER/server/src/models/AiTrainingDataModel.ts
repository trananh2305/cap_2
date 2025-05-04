import mongoose, { Schema } from "mongoose";
import { IAiTrainingData } from "../interfaces/IAiTrainingData"; // Đảm bảo bạn đã import `IAiTrainingData`

// AI Training Data Schema
const AiTrainingDataSchema: Schema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order", // Tham chiếu tới bảng `Order`
      required: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "KitchenQueue", // Tham chiếu tới bảng `KitchenQueue`
      required: true,
    },
    dishName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Đảm bảo số lượng phải lớn hơn hoặc bằng 1
    },
    orderTime: {
      type: Date,
      required: true,
    },
    queueSizeAtOrder: {
      type: Number,
      required: true,
    },
    availableChefsAtOrder: {
      type: Number,
      required: true,
    },
    startCookingTime: {
      type: Date,
      required: true,
    },
    completionTime: {
      type: Date,
      required: true,
    },
    updatedEstimatedTime: {
      type: Number,
      required: true,
    },
    estimatedTime: {
      type: Number,
      required: true,
    },
    actualTime: {
      type: Number,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    difficultyLevel: {
      type: Number,
      required: true,
    },
    hourOfDay: {
      type: Number,
      required: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
    },
    isWeekend: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // Tạo thời gian tạo và cập nhật tự động
);

// Chuyển đổi dữ liệu khi trả về JSON (ví dụ: convert Decimal128 thành số thập phân)
AiTrainingDataSchema.set("toJSON", {
  transform: (_, ret) => {
    if (ret.updatedEstimatedTime) {
      ret.updatedEstimatedTime = parseFloat(
        ret.updatedEstimatedTime.toString()
      );
    }
    if (ret.estimatedTime) {
      ret.estimatedTime = parseFloat(ret.estimatedTime.toString());
    }
    if (ret.actualTime) {
      ret.actualTime = parseFloat(ret.actualTime.toString());
    }
    return ret;
  },
});

// Tạo model cho AiTrainingData
const AiTrainingDataModel = mongoose.model<IAiTrainingData>(
  "AiTrainingData",
  AiTrainingDataSchema
);

export default AiTrainingDataModel;
