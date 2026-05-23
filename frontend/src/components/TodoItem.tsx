import { Box, Button, Checkbox, Chip, ListItem, Typography } from "@mui/material";
import type { Todo } from "@/types/todo";

type TodoItemProps = {
  isSelected: boolean;
  todo: Todo;
  onComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onToggleSelect: (todoId: number) => void;
};

export function TodoItem({
  isSelected,
  todo,
  onComplete,
  onDelete,
  onToggleSelect
}: TodoItemProps) {
  return (
    <ListItem
      divider
      secondaryAction={
        <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
          <Chip label={todo.category?.name ?? "No category"} size="small" />
          <Button color="error" size="small" variant="text" onClick={() => onDelete(todo)}>
            Delete
          </Button>
        </Box>
      }
      sx={{ px: 0 }}
    >
      <Checkbox
        checked={isSelected}
        edge="start"
        slotProps={{ input: { "aria-label": `Select ${todo.text}` } }}
        onChange={() => onToggleSelect(todo.id)}
      />
      <Checkbox
        slotProps={{ input: { "aria-label": `Complete ${todo.text}` } }}
        checked={todo.completed}
        disabled={todo.completed}
        onChange={(event) => {
          if (event.target.checked) {
            onComplete(todo);
          }
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            pr: { xs: 14, sm: 20 },
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
