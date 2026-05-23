import { List, Paper } from "@mui/material";
import { TodoItem } from "@/components/TodoItem";
import type { Todo } from "@/types/todo";

type TodoListProps = {
  todos: Todo[];
};

export function TodoList({ todos }: TodoListProps) {
  return (
    <Paper elevation={0} sx={{ border: "1px solid #ddd", p: 2 }}>
      <List disablePadding>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </List>
    </Paper>
  );
}
