import type { Request, Response } from "express";
import { categoriesService } from "../services/categories.service";

export function getCategories(_req: Request, res: Response) {
  res.status(501).json(categoriesService.notImplemented("GET /categories"));
}
