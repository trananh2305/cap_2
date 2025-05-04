import { BaseRoutes } from "./BaseRoutes";
import KitchenController from "../controllers/KitchenController";

export default class KitchenRouters extends BaseRoutes {
  private kitchenController: KitchenController;

  constructor(kitchenController: KitchenController) {
    super();
    this.kitchenController = kitchenController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // show create template
    this.router.get("/get-all", this.kitchenController.getAllOrderItems);
    // cập nhật trạng thái món
    this.router.patch("/update-status",this.kitchenController.updateItemStatus);
    // món trùng lặp
    this.router.get("/summary-food", this.kitchenController.getGroupedItems);
    // món hoàn thành
    this.router.get("/completed-items",this.kitchenController.getCompletedItems);
    // lấy các category trong kitchen queue
    this.router.get("/categories",this.kitchenController.getAllCategoriesInKitchenQueue);
    //lọc theo categoryId
    this.router.get("/get-items-by-categoryId/:categoryId",this.kitchenController.getItemsByCategoryInKitchenItems);
    // các bàn đang được sử dụng
    this.router.get("/occupied-table",this.kitchenController.getOccupiedTableNames);
    // bàn có món nào truyền tableID
    this.router.get("/items-in-table/:tableid",this.kitchenController.getItemsByTableId);
    // món có trong bàn nào truyền itemId và status
    this.router.get("/orders-of-item",this.kitchenController.getOrdersByItemId);
    // gọi nhân viên và trạng thái nhân viên
    this.router.get("/get-all-chef-cooking",this.kitchenController.getChefList);
    // đang lỗi
    this.router.get("/get-items-by-chef/:id",this.kitchenController.getItemsByChef);

    this.router.patch("/assign-chef-cooking/",this.kitchenController.assignChefToKitchenItem);

    this.router.patch("/chefs-change-status/:id",this.kitchenController.updateChefStatus);



  }
}
