import { Request, Response } from "express";
import path from "path";
import UploadController from "../controllers/UploadController";
import multer from "multer";
import { BaseRoutes } from "./BaseRoutes";

export default class UploadRouter extends BaseRoutes {
  private uploadController: UploadController;
  private storage;
  private upload;

  constructor(uploadController: UploadController) {
    super();
    this.uploadController = uploadController;
    this.storage = multer.memoryStorage();
    this.upload = multer({ storage: this.storage });
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/upload", this.serveUploadPage);

    // Upload images
    this.router.post(
      "/staff",
      this.upload.array("files"),
      this.uploadController.uploadStaffImages
    );
    this.router.post(
      "/food",
      this.upload.array("files"),
      this.uploadController.uploadFoodImages
    );

    // Delete images
    this.router.delete(
      "/staff/delete",
      this.uploadController.deleteStaffImages
    );
    this.router.delete("/food/delete", this.uploadController.deleteFoodImages);
  }

  private serveUploadPage(req: Request, res: Response): void {
    res.sendFile(path.join(__dirname, "../views/upload.html"));
  }
}
