import { api } from "@/services/api";

export function getTodos() {
  return api.get("/todos");
}
