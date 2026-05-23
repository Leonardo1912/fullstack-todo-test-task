import cors from "cors";
import express from "express";
import { categoriesRouter } from "./routes/categories.routes";
import { todosRouter } from "./routes/todos.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000"
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/todos", todosRouter);
app.use("/categories", categoriesRouter);
app.use(errorHandler);
