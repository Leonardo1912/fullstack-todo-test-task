"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { Category } from "@/types/category";

type CategoryFilterProps = {
  categories: Category[];
  disabled?: boolean;
  value: number | "";
  onChange: (categoryId: number | "") => void;
};

export function CategoryFilter({
  categories,
  disabled = false,
  value,
  onChange
}: CategoryFilterProps) {
  function handleChange(event: SelectChangeEvent<string>) {
    const nextValue = event.target.value;
    onChange(nextValue === "" ? "" : Number(nextValue));
  }

  return (
    <FormControl disabled={disabled} fullWidth>
      <InputLabel id="category-filter-label">Category</InputLabel>
      <Select
        label="Category"
        labelId="category-filter-label"
        value={value === "" ? "" : String(value)}
        onChange={handleChange}
      >
        <MenuItem value="">All categories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={String(category.id)}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
