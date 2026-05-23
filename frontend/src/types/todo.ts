import type { Category } from "@/types/category";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  categoryId: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
};
