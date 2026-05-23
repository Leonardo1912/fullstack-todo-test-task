import { api } from "@/services/api";

export function getCategories() {
  return api.get("/categories");
}
