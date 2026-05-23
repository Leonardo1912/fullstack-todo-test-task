import type { Request, Response } from "express";
import { todosService } from "../services/todos.service";

export function getTodos(_req: Request, res: Response) {
  res.status(501).json(todosService.notImplemented("GET /todos"));
}

export function createTodo(_req: Request, res: Response) {
  res.status(501).json(todosService.notImplemented("POST /todos"));
}

export function updateTodo(_req: Request, res: Response) {
  res.status(501).json(todosService.notImplemented("PATCH /todos/:id"));
}

export function deleteTodo(_req: Request, res: Response) {
  res.status(501).json(todosService.notImplemented("DELETE /todos/:id"));
}
