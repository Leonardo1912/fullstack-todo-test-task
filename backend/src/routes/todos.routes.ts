import { Router } from "express";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todos.controller";
import { asyncHandler } from "../middleware/asyncHandler";

export const todosRouter = Router();

todosRouter.get("/", asyncHandler(getTodos));
todosRouter.post("/", asyncHandler(createTodo));
todosRouter.patch("/:id", asyncHandler(updateTodo));
todosRouter.delete("/:id", asyncHandler(deleteTodo));
