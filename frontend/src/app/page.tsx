import { Box, Container, Typography } from "@mui/material";
import { CategoryFilter } from "@/components/CategoryFilter";
import { EmptyState } from "@/components/EmptyState";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box component="main" sx={{ py: 6 }}>
        <Box sx={{ display: "grid", gap: 4 }}>
          <Typography component="h1" variant="h4">
            Todo Categories
          </Typography>
          <TodoForm />
          <CategoryFilter />
          <TodoList />
          <EmptyState />
        </Box>
      </Box>
    </Container>
  );
}
