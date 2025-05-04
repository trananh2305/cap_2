import { BaseRoutes } from "./BaseRoutes";
import OrderController from "../controllers/OrderController";

export default class OrderRoutes extends BaseRoutes {
  private orderController: OrderController;

  constructor(orderController: OrderController) {
    super();
    this.orderController = orderController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/get-all", this.orderController.getAllOrders);
    this.router.get("/:id", this.orderController.getOrderById);
    this.router.get("/ordered/table/:tableId", this.orderController.getOrderByTable);
    this.router.get("/ordered/user/:userId", this.orderController.getOrderByUserId);
    
    
    // Update order status
    this.router.patch("/update-status/:id", this.orderController.updateOrderStatus);

    // Create or update an order, check if orderId exists
    // We use PUT if we want to update a specific resource or POST if it's a new resource
    this.router.post("/create-update-order", this.orderController.createOrUpdateOrder);
  }
}
