# Full-Stack Todo with Categories

Small full-stack Todo with Categories application.

## Project Structure

- `frontend/` - Next.js, TypeScript, App Router
- `backend/` - Node.js, Express, TypeScript, Prisma, SQLite

## Install

```bash
npm install
```

## Development

Run both apps:

```bash
npm run dev
```

Run frontend only:

```bash
npm run dev:frontend
```

Run backend only:

```bash
npm run dev:backend
```

Backend runs on `http://127.0.0.1:4000` by default.

## Database

The backend uses Prisma with SQLite. Copy the example environment file before running migrations:

```bash
cp backend/.env.example backend/.env
npm run prisma:migrate:init --workspace backend
npm run prisma:seed --workspace backend
```

For later schema changes, create a named migration:

```bash
npm run prisma:migrate --workspace backend -- --name your_migration_name
```

`GET /todos` supports an optional `category` query parameter. Use a category id:

```bash
GET /todos?category=1
```

## Backend API

- `GET /categories` - returns all categories
- `GET /todos` - returns todos with category data
- `POST /todos` - creates a todo with `text` and `categoryId`
- `PATCH /todos/:id` - updates `completed`
- `DELETE /todos/:id` - deletes a todo

Each category can have at most 5 active non-completed todos.

## Build

```bash
npm run build
```
