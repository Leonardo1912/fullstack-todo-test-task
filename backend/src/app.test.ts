import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { Server } from "node:http";
import request from "supertest";
import { app } from "./app";
import { prisma } from "./prisma/prismaClient";

jest.mock("./prisma/prismaClient", () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn()
    },
    todo: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe("API", () => {
  let server: Server;

  beforeEach((done) => {
    server = app.listen(0, "127.0.0.1", done);
  });

  afterEach((done) => {
    server.close(done);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns categories", async () => {
    mockedPrisma.category.findMany.mockResolvedValue([
      {
        id: 1,
        name: "Work",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z")
      }
    ]);

    const response = await request(server).get("/categories").expect(200);

    expect(response.body).toEqual([
      {
        id: 1,
        name: "Work",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z"
      }
    ]);
  });

  it("validates todo creation input", async () => {
    const response = await request(server).post("/todos").send({ categoryId: 1 }).expect(400);

    expect(response.body).toEqual({ message: "text is required." });
  });

  it("returns a clear category limit error", async () => {
    mockedPrisma.category.findUnique.mockResolvedValue({
      id: 1,
      name: "Work",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z")
    });
    mockedPrisma.todo.count.mockResolvedValue(5);

    const response = await request(server)
      .post("/todos")
      .send({ text: "New task", categoryId: 1 })
      .expect(400);

    expect(response.body.message).toContain("already has 5 active todos");
    expect(mockedPrisma.todo.create).not.toHaveBeenCalled();
  });
});
