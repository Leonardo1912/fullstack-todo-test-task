import { Paper, Typography } from "@mui/material";

export function TodoList() {
  return (
    <Paper elevation={0} sx={{ border: "1px solid #ddd", p: 2 }}>
      <Typography color="text.secondary">Todo list placeholder</Typography>
    </Paper>
  );
}
