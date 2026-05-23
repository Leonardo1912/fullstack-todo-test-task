"use client";

import { Alert, Box, Button, Container, Paper, Snackbar, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SyntheticEvent } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { TodoForm, type TodoFormValues } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { useTodoUndoActions } from "@/hooks/useTodoUndoActions";
import { getCategories } from "@/services/categoriesApi";
import { createTodo, getTodos } from "@/services/todosApi";
import type { Category } from "@/types/category";
import type { Todo } from "@/types/todo";

export function TodoApp() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const selectedCategoryFilter = useMemo(
    () => (selectedCategoryId === "" ? undefined : selectedCategoryId),
    [selectedCategoryId]
  );

  const loadTodos = useCallback(async (categoryId?: number) => {
    const loadedTodos = await getTodos(categoryId);
    setTodos(loadedTodos);
  }, []);

  const {
    activeSnackbar,
    closeSnackbar,
    completeTodo,
    requestDeleteTodo,
    undoActiveAction,
    visibleTodos
  } = useTodoUndoActions({
    todos,
    setTodos,
    onError: setActionError
  });

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [loadedCategories, loadedTodos] = await Promise.all([getCategories(), getTodos()]);

        if (!isMounted) {
          return;
        }

        setCategories(loadedCategories);
        setTodos(loadedTodos);
      } catch (error) {
        if (isMounted) {
          setLoadError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    let isMounted = true;

    async function loadFilteredTodos() {
      setLoadError(null);

      try {
        const loadedTodos = await getTodos(selectedCategoryFilter);

        if (isMounted) {
          setTodos(loadedTodos);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(getErrorMessage(error));
        }
      }
    }

    loadFilteredTodos();

    return () => {
      isMounted = false;
    };
  }, [isLoading, selectedCategoryFilter]);

  async function handleCreateTodo(values: TodoFormValues) {
    setIsCreating(true);
    setFormError(null);

    try {
      await createTodo({
        text: values.text,
        categoryId: Number(values.categoryId)
      });
      await loadTodos(selectedCategoryFilter);
      return true;
    } catch (error) {
      setFormError(getErrorMessage(error));
      return false;
    } finally {
      setIsCreating(false);
    }
  }

  function handleSnackbarClose(_event: SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") {
      return;
    }

    closeSnackbar();
  }

  return (
    <Container maxWidth="md">
      <Box component="main" sx={{ py: { xs: 4, sm: 6 } }}>
        <Box sx={{ display: "grid", gap: 3 }}>
          <Box>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
              Todo Categories
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Keep active tasks organized by category.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: { xs: 2, sm: 3 }
            }}
          >
            <TodoForm
              categories={categories}
              disabled={isLoading || categories.length === 0}
              isSubmitting={isCreating}
              onSubmit={handleCreateTodo}
            />
          </Paper>

          {formError ? <Alert severity="error">{formError}</Alert> : null}
          {actionError ? (
            <Alert severity="error" onClose={() => setActionError(null)}>
              {actionError}
            </Alert>
          ) : null}

          <Box sx={{ maxWidth: 320 }}>
            <CategoryFilter
              categories={categories}
              disabled={isLoading}
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
            />
          </Box>

          {isLoading ? <LoadingState /> : null}
          {loadError ? <ErrorState message={loadError} /> : null}
          {!isLoading && !loadError && visibleTodos.length === 0 ? <EmptyState /> : null}
          {!isLoading && !loadError && visibleTodos.length > 0 ? (
            <TodoList todos={visibleTodos} onComplete={completeTodo} onDelete={requestDeleteTodo} />
          ) : null}
        </Box>
      </Box>
      <Snackbar
        action={
          <Button color="secondary" size="small" onClick={undoActiveAction}>
            Undo
          </Button>
        }
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        autoHideDuration={5000}
        message={activeSnackbar?.message}
        open={Boolean(activeSnackbar)}
        onClose={handleSnackbarClose}
      />
    </Container>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}
