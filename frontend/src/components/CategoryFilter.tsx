"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export function CategoryFilter() {
  return (
    <FormControl disabled fullWidth>
      <InputLabel id="category-filter-label">Category</InputLabel>
      <Select label="Category" labelId="category-filter-label" value="">
        <MenuItem value="">All categories</MenuItem>
      </Select>
    </FormControl>
  );
}
