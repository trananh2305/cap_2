import CategoryController from "../controllers/CategoryController";
import { BaseRoutes } from "./BaseRoutes";

export default class CategoryRoutes extends BaseRoutes {
  private categoryController: CategoryController;

  constructor(categoryController: CategoryController) {
    super();
    this.categoryController = categoryController;
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    // show create template
    this.router.get("/createShow", this.categoryController.createShow);
    // Public routes
    this.router.get("/get-all", this.categoryController.getAllCategories);
    this.router.get("/:id", this.categoryController.getCategoryDetail);
    this.router.post("/create",  this.categoryController.createCategory);
    this.router.put("/:id/edit", this.categoryController.updateCategory);
    this.router.delete("/:id/delete", this.categoryController.deleteCategory);
  }
}
