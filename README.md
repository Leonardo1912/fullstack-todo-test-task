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

## Database

```bash
npm run prisma:migrate --workspace backend
npm run prisma:seed --workspace backend
```

## Build

```bash
npm run build
```
