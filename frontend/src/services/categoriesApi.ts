import { api } from "@/services/api";
import type { Category } from "@/types/category";

export async function getCategories() {
  const response = await api.get<Category[]>("/categories");

  return response.data;
}
