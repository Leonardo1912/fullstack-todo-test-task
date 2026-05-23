"use client";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import type { Category } from "@/types/category";

export type TodoFormValues = {
  text: string;
  categoryId: string;
};

type TodoFormProps = {
  categories: Category[];
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmit: (values: TodoFormValues) => Promise<boolean>;
};

export function TodoForm({
  categories,
  disabled = false,
  isSubmitting = false,
  onSubmit
}: TodoFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<TodoFormValues>({
    defaultValues: {
      text: "",
      categoryId: ""
    }
  });

  async function submit(values: TodoFormValues) {
    const wasCreated = await onSubmit(values);

    if (wasCreated) {
      reset();
    }
  }

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(submit)}
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", sm: "1fr 220px auto" }
      }}
    >
      <TextField
        disabled={disabled || isSubmitting}
        error={Boolean(errors.text)}
        fullWidth
        helperText={errors.text?.message}
        label="Task"
        placeholder="Add task"
        {...register("text", {
          required: "Task text is required.",
          validate: (value) => value.trim().length > 0 || "Task text is required."
        })}
      />

      <Controller
        control={control}
        name="categoryId"
        rules={{ required: "Category is required." }}
        render={({ field }) => (
          <FormControl
            disabled={disabled || isSubmitting}
            error={Boolean(errors.categoryId)}
            fullWidth
          >
            <InputLabel id="todo-category-label">Category</InputLabel>
            <Select label="Category" labelId="todo-category-label" {...field}>
              {categories.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.categoryId?.message}</FormHelperText>
          </FormControl>
        )}
      />

      <Button disabled={disabled || isSubmitting} type="submit" variant="contained">
        {isSubmitting ? "Adding" : "Add"}
      </Button>

      {categories.length === 0 ? (
        <FormHelperText sx={{ gridColumn: "1 / -1" }}>
          Seed categories before creating todos.
        </FormHelperText>
      ) : null}
    </Box>
  );
}
