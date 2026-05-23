import { Box, Chip, ListItem, Typography } from "@mui/material";
import type { Todo } from "@/types/todo";

type TodoItemProps = {
  todo: Todo;
};

export function TodoItem({ todo }: TodoItemProps) {
  return (
    <ListItem
      divider
      secondaryAction={<Chip label={todo.category?.name ?? "No category"} size="small" />}
      sx={{ px: 0 }}
    >
      <Box>
        <Typography
          sx={{
            pr: 10,
            textDecoration: todo.completed ? "line-through" : "none"
          }}
        >
          {todo.text}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{
            textDecoration: todo.completed ? "line-through" : "none"
          }}
        >
          {todo.completed ? "Completed" : "Active"}
        </Typography>
      </Box>
    </ListItem>
  );
}
