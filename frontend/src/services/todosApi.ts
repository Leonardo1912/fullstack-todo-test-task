import { api } from "@/services/api";
import type { Todo } from "@/types/todo";

export type CreateTodoPayload = {
  text: string;
  categoryId: number;
};

export type UpdateTodoPayload = {
  completed: boolean;
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

export async function updateTodo(id: number, payload: UpdateTodoPayload) {
  const response = await api.patch<Todo>(`/todos/${id}`, payload);

  return response.data;
}

export async function deleteTodo(id: number) {
  await api.delete(`/todos/${id}`);
}
