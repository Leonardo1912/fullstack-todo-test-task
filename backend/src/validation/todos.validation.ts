import { HttpError } from "../errors/HttpError";

export type CreateTodoDto = {
  text: string;
  categoryId: number;
};

export type UpdateTodoDto = {
  completed: boolean;
};

export function parseCategoryQuery(value: unknown): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(400, "category query parameter must be a category id.");
  }

  const categoryId = Number(value);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new HttpError(400, "category query parameter must be a positive integer category id.");
  }

  return categoryId;
}

export function parseTodoId(value: unknown): number {
  if (typeof value !== "string") {
    throw new HttpError(400, "Todo id must be a positive integer.");
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "Todo id must be a positive integer.");
  }

  return id;
}

export function validateCreateTodoDto(body: unknown): CreateTodoDto {
  if (!isRecord(body)) {
    throw new HttpError(400, "Request body must be an object.");
  }

  const text = body.text;
  const categoryId = body.categoryId;

  if (typeof text !== "string" || text.trim() === "") {
    throw new HttpError(400, "text is required.");
  }

  if (typeof categoryId !== "number" || !Number.isInteger(categoryId) || categoryId <= 0) {
    throw new HttpError(400, "categoryId is required and must be a positive integer.");
  }

  return {
    text: text.trim(),
    categoryId
  };
}

export function validateUpdateTodoDto(body: unknown): UpdateTodoDto {
  if (!isRecord(body)) {
    throw new HttpError(400, "Request body must be an object.");
  }

  if (typeof body.completed !== "boolean") {
    throw new HttpError(400, "completed is required and must be a boolean.");
  }

  return {
    completed: body.completed
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
