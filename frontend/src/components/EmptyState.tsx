import { Box, Typography } from "@mui/material";

export function EmptyState() {
  return (
    <Box sx={{ border: "1px dashed #bbb", p: 4, textAlign: "center" }}>
      <Typography variant="h6">No tasks</Typography>
      <Typography color="text.secondary">Create a task to see it here.</Typography>
    </Box>
  );
}
