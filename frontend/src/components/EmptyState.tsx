import { Box, Typography } from "@mui/material";

export function EmptyState() {
  return (
    <Box sx={{ border: "1px dashed #bbb", p: 4, textAlign: "center" }}>
      <Typography variant="h6">No tasks</Typography>
      <Typography color="text.secondary">Tasks will appear here after the API is implemented.</Typography>
    </Box>
  );
}
