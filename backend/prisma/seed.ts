import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoryNames = ["Work", "Personal", "Study", "Shopping"];

async function main() {
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
