# Full-Stack Todo with Categories

Small full-stack Todo application with category filtering, a backend category limit rule, undo snackbar flows, tests, and a Docker Compose setup.

## Tech Stack

- Frontend: Next.js App Router, TypeScript, MUI, React Hook Form, Axios
- Backend: Node.js, Express, TypeScript, Prisma, SQLite
- Tests: Jest, Supertest, React Testing Library
- Tooling: npm workspaces, Prettier, Docker Compose

## Project Structure

```text
.
├── frontend/          # Next.js app
├── backend/           # Express API and Prisma schema
├── docker-compose.yml # containerized dev runner
├── package.json       # root workspace scripts
├── package-lock.json
└── README.md
```

## Fresh Clone Setup

Install dependencies:

```bash
npm install
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Create and seed the SQLite database:

```bash
npm run prisma:migrate:init --workspace backend
npm run prisma:seed --workspace backend
```

Run both apps:

```bash
npm run dev
```

Open the frontend at `http://localhost:3000`.

## Docker Compose

Run the project in Docker:

```bash
docker compose up
```

The compose service installs dependencies, generates Prisma Client, applies migrations, seeds categories, and starts both apps. Frontend is exposed on `http://localhost:3000`; backend is exposed on `http://localhost:4000`.

## Environment Variables

Backend, `backend/.env`:

```bash
DATABASE_URL="file:./dev.db"
PORT=4000
HOST="127.0.0.1"
FRONTEND_URL="http://localhost:3000"
```

Frontend, `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:4000"
```

The frontend reads `NEXT_PUBLIC_API_BASE_URL`. If it is not set, it defaults to `http://127.0.0.1:4000`.

## Scripts

Root scripts:

```bash
npm run dev              # run frontend and backend together
npm run dev:frontend     # run Next.js only
npm run dev:backend      # run Express API only
npm run build            # build frontend and backend
npm run test             # run backend and frontend tests
npm run format           # format project files with Prettier
npm run format:check     # check Prettier formatting
npm run start:frontend   # start built frontend
npm run start:backend    # start built backend
```

Backend scripts:

```bash
npm run dev --workspace backend
npm run build --workspace backend
npm run start --workspace backend
npm run test --workspace backend
npm run prisma:generate --workspace backend
npm run prisma:migrate:init --workspace backend
npm run prisma:migrate --workspace backend -- --name your_migration_name
npm run prisma:seed --workspace backend
```

Frontend scripts:

```bash
npm run dev --workspace frontend
npm run build --workspace frontend
npm run start --workspace frontend
npm run test --workspace frontend
```

## Tests

Run all tests:

```bash
npm run test
```

Run one side only:

```bash
npm run test --workspace backend
npm run test --workspace frontend
```

Backend tests use Jest and Supertest. Frontend tests use Jest and React Testing Library.

## Backend API

- `GET /categories` - returns all categories
- `GET /todos` - returns todos with category data
- `GET /todos?category=1` - returns todos for category id `1`
- `POST /todos` - creates a todo with `text` and `categoryId`
- `PATCH /todos/:id` - updates `completed`
- `DELETE /todos/:id` - deletes a todo

`GET /todos` uses a category id for the optional `category` query parameter.

Each category can have at most 5 active non-completed todos. If the limit is reached, the backend returns `400` with a clear message.

## Frontend Features

- Create todos with text and category.
- Filter todos by category.
- Mark a todo as completed with a 5-second Undo snackbar.
- Delete a todo with a 5-second Undo snackbar.
- Select multiple todos and mark selected active todos as completed.
- Loading, error, empty, and backend validation states.

## Build And Checks

```bash
npm run format:check
npm run test
npm run build
```

No lint script is configured in this project.
