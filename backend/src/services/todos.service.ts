import { HttpError } from "../errors/HttpError";
import { prisma } from "../prisma/prismaClient";
import type { CreateTodoDto, UpdateTodoDto } from "../validation/todos.validation";

const MAX_ACTIVE_TODOS_PER_CATEGORY = 5;

export const todosService = {
  getAll(categoryId?: number) {
    return prisma.todo.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  },

  async create(data: CreateTodoDto) {
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId
      }
    });

    if (!category) {
      throw new HttpError(400, "Category does not exist.");
    }

    const activeTodosCount = await prisma.todo.count({
      where: {
        categoryId: data.categoryId,
        completed: false
      }
    });

    if (activeTodosCount >= MAX_ACTIVE_TODOS_PER_CATEGORY) {
      throw new HttpError(
        400,
        "This category already has 5 active todos. Complete or delete an existing todo before adding another."
      );
    }

    return prisma.todo.create({
      data,
      include: {
        category: true
      }
    });
  },

  async update(id: number, data: UpdateTodoDto) {
    await ensureTodoExists(id);

    return prisma.todo.update({
      where: {
        id
      },
      data,
      include: {
        category: true
      }
    });
  },

  async delete(id: number) {
    await ensureTodoExists(id);

    await prisma.todo.delete({
      where: {
        id
      }
    });
  }
};

async function ensureTodoExists(id: number) {
  const todo = await prisma.todo.findUnique({
    where: {
      id
    }
  });

  if (!todo) {
    throw new HttpError(404, "Todo not found.");
  }
}
