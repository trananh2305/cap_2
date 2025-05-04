import AdminController from "../controllers/AdminController";
import { BaseRoutes } from "./BaseRoutes";

export default class AdminRoutes extends BaseRoutes {
  private adminController: AdminController;

  constructor(adminController: AdminController) {
    super();
    this.adminController = adminController;
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get("/daily", this.adminController.getRevenuesDaily);
    this.router.get("/monthly", this.adminController.getRevenuesMonthly);
    this.router.get("/annual", this.adminController.getRevenueForYear);
    this.router.get("/total", this.adminController.getTotal);
    this.router.get("/best-sales", this.adminController.getBestSales);
    this.router.get("/startDay-endDay", this.adminController.getStartEndOrder);
    this.router.get("/order-monthly", this.adminController.getOrderForMonth);
    this.router.get("/all-staff", this.adminController.getAllStaff);
    this.router.get("/staff/:id", this.adminController.getDetailStaff);
    this.router.put("/update-staff/:id", this.adminController.updateStaff);
    this.router.delete("/delete-staff/:id", this.adminController.deleteStaff);
  }
}
