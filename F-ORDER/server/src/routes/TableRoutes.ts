import { BaseRoutes } from "./BaseRoutes";
import TableController from "../controllers/TableController";

export default class TableRoutes extends BaseRoutes {
  private tableController: TableController;

  constructor(tableController: TableController) {
    super();
    this.tableController = tableController;
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    // show create template
    this.router.get("/show", this.tableController.showTables);
    // Public routes
    this.router.get("/get-all", this.tableController.getAllTables);
    this.router.get("/:id", this.tableController.getTableDetail);
    this.router.post("/create", this.tableController.createTable);
    // this.router.put("/:id/edit", this.tableController.updateTable);
    this.router.delete("/delete/:id", this.tableController.deleteTable);
  }
}
