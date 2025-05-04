import { Document } from "mongoose";
import { IOrder } from "./IOrder";  // Đảm bảo bạn đã import `IOrder` interface nếu cần
import { IKitchenQueue } from "./IKitchenQueue";

export interface IAiTrainingData extends Document {
  orderId: IOrder["_id"];  // Mã đơn hàng, tham chiếu tới bảng `Order`
  itemId: IKitchenQueue["_id"];  // Mã món ăn, tham chiếu tới bảng `KitchenQueue`
  dishName: string;  // Tên món ăn
  quantity: number;  // Số lượng món ăn
  orderTime: Date;  // Thời gian đặt món
  queueSizeAtOrder: number;  // Số lượng món ăn đang chờ khi đặt món
  availableChefsAtOrder: number;  // Số đầu bếp có sẵn khi đặt món
  startCookingTime: Date;
  completionTime: Date;
  updatedEstimatedTime: number
  estimatedTime: number;  // Thời gian ước tính chế biến món ăn
  actualTime: number;  // Thời gian thực tế chế biến món ăn
  categoryName: string;  // Loại món ăn (Main Course, Dessert, etc.)
  difficultyLevel: number;  // Mức độ khó của món ăn (1-5)
  hourOfDay: number;  // Giờ trong ngày (0-23)
  dayOfWeek: number;  // Ngày trong tuần (0-6, với 0 là Chủ Nhật)
  isWeekend: number;  // Có phải cuối tuần không (0 hoặc 1)
  createdAt: Date;  // Thời gian tạo
  updatedAt: Date;  // Thời gian cập nhật
}
