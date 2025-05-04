import { BaseRoutes } from "./BaseRoutes";
import MenuItemController from "../controllers/MenuItemController";

export default class MenuItemRouters extends BaseRoutes {
  private menuItemController: MenuItemController;

  constructor(menuItemController: MenuItemController) {
    super();
    this.menuItemController = menuItemController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // show create template
    this.router.get("/createShow", this.menuItemController.createShow);
    // Public routes
    this.router.get("/get-all", this.menuItemController.getAllMenuItems);
    this.router.get("/:id", this.menuItemController.getMenuItemDetail);
    this.router.post("/create", this.menuItemController.createMenuItem);
    this.router.put("/:id/edit", this.menuItemController.updateMenuItem);
    this.router.delete("/:id/delete", this.menuItemController.deleteMenuItem);
  }
}
