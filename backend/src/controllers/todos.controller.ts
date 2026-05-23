import type { Request, Response } from "express";
import { todosService } from "../services/todos.service";
import {
  parseCategoryQuery,
  parseTodoId,
  validateCreateTodoDto,
  validateUpdateTodoDto
} from "../validation/todos.validation";

export async function getTodos(req: Request, res: Response) {
  const categoryId = parseCategoryQuery(req.query.category);
  const todos = await todosService.getAll(categoryId);

  res.json(todos);
}

export async function createTodo(req: Request, res: Response) {
  const dto = validateCreateTodoDto(req.body);
  const todo = await todosService.create(dto);

  res.status(201).json(todo);
}

export async function updateTodo(req: Request, res: Response) {
  const id = parseTodoId(req.params.id);
  const dto = validateUpdateTodoDto(req.body);
  const todo = await todosService.update(id, dto);

  res.json(todo);
}

export async function deleteTodo(req: Request, res: Response) {
  const id = parseTodoId(req.params.id);

  await todosService.delete(id);

  res.status(204).send();
}
