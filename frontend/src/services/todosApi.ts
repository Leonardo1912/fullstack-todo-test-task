import { api } from "@/services/api";
import type { Todo } from "@/types/todo";

export type CreateTodoPayload = {
  text: string;
  categoryId: number;
};

export async function getTodos(categoryId?: number) {
  const response = await api.get<Todo[]>("/todos", {
    params: categoryId ? { category: categoryId } : undefined
  });

  return response.data;
}

export async function createTodo(payload: CreateTodoPayload) {
  const response = await api.post<Todo>("/todos", payload);

  return response.data;
}
