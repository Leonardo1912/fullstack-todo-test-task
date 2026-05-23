import type { Request, Response } from "express";
import { categoriesService } from "../services/categories.service";

export async function getCategories(_req: Request, res: Response) {
  const categories = await categoriesService.getAll();

  res.json(categories);
}
