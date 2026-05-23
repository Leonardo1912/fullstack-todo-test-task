import { Box, Typography } from "@mui/material";

export function EmptyState() {
  return (
    <Box
      sx={{
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        p: { xs: 3, sm: 5 },
        textAlign: "center"
      }}
    >
      <Typography variant="h6">No tasks</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Create a task or change the category filter.
      </Typography>
    </Box>
  );
}
