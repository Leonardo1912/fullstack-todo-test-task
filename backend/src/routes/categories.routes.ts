import { Router } from "express";
import { getCategories } from "../controllers/categories.controller";

export const categoriesRouter = Router();

categoriesRouter.get("/", getCategories);
