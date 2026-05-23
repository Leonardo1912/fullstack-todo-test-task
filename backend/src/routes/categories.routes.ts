import { Router } from "express";
import { getCategories } from "../controllers/categories.controller";
import { asyncHandler } from "../middleware/asyncHandler";

export const categoriesRouter = Router();

categoriesRouter.get("/", asyncHandler(getCategories));
