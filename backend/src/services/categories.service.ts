import { prisma } from "../prisma/prismaClient";

export const categoriesService = {
  getAll() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }
};
