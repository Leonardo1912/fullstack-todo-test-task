import { List, Paper } from "@mui/material";
import { TodoItem } from "@/components/TodoItem";
import type { Todo } from "@/types/todo";

type TodoListProps = {
  todos: Todo[];
  onComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

export function TodoList({ todos, onComplete, onDelete }: TodoListProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        px: { xs: 2, sm: 3 }
      }}
    >
      <List disablePadding>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onComplete={onComplete} onDelete={onDelete} />
        ))}
      </List>
    </Paper>
  );
}
