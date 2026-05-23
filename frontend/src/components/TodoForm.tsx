"use client";

import { Box, Button, TextField } from "@mui/material";

export function TodoForm() {
  return (
    <Box
      component="form"
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", sm: "1fr 220px auto" }
      }}
    >
      <TextField disabled fullWidth label="Task" placeholder="Add task" />
      <TextField disabled label="Category" placeholder="Select category" />
      <Button disabled type="submit" variant="contained">
        Add
      </Button>
    </Box>
  );
}
