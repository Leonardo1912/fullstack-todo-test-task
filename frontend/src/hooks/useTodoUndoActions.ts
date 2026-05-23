"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { AxiosError } from "axios";
import { deleteTodo, updateTodo } from "@/services/todosApi";
import type { Todo } from "@/types/todo";

const UNDO_TIMEOUT_MS = 5000;

type PendingActionType = "complete" | "delete";

type PendingAction = {
  type: PendingActionType;
  todo: Todo;
  timerId: number;
};

type SnackbarItem = {
  id: number;
  type: PendingActionType;
  message: string;
};

type UseTodoUndoActionsParams = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  onError: (message: string) => void;
};

export function useTodoUndoActions({ todos, setTodos, onError }: UseTodoUndoActionsParams) {
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<number>>(() => new Set());
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);
  const isMountedRef = useRef(true);
  const pendingActionsRef = useRef<Map<number, PendingAction>>(new Map());
  const activeSnackbar = snackbars[0] ?? null;

  const visibleTodos = useMemo(
    () => todos.filter((todo) => !pendingDeleteIds.has(todo.id)),
    [pendingDeleteIds, todos]
  );

  const enqueueSnackbar = useCallback((item: SnackbarItem) => {
    setSnackbars((currentSnackbars) => [...currentSnackbars, item]);
  }, []);

  const showNextSnackbar = useCallback(() => {
    setSnackbars((currentSnackbars) => currentSnackbars.slice(1));
  }, []);

  const clearPendingAction = useCallback((todoId: number) => {
    const pendingAction = pendingActionsRef.current.get(todoId);

    if (!pendingAction) {
      return;
    }

    window.clearTimeout(pendingAction.timerId);
    pendingActionsRef.current.delete(todoId);
    setPendingDeleteIds((ids) => {
      if (!ids.has(todoId)) {
        return ids;
      }

      const nextIds = new Set(ids);
      nextIds.delete(todoId);
      return nextIds;
    });
  }, []);

  const removeSnackbar = useCallback((todoId: number) => {
    setSnackbars((currentSnackbars) => currentSnackbars.filter((item) => item.id !== todoId));
  }, []);

  const completeTodo = useCallback(
    async (todo: Todo) => {
      clearPendingAction(todo.id);
      removeSnackbar(todo.id);

      const originalTodo = todo;

      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) =>
          currentTodo.id === todo.id ? { ...currentTodo, completed: true } : currentTodo
        )
      );

      try {
        const updatedTodo = await updateTodo(todo.id, { completed: true });

        if (!isMountedRef.current) {
          return;
        }

        setTodos((currentTodos) =>
          currentTodos.map((currentTodo) =>
            currentTodo.id === todo.id
              ? { ...updatedTodo, category: currentTodo.category }
              : currentTodo
          )
        );

        const timerId = window.setTimeout(async () => {
          pendingActionsRef.current.delete(todo.id);

          try {
            await deleteTodo(todo.id);

            if (!isMountedRef.current) {
              return;
            }

            setTodos((currentTodos) =>
              currentTodos.filter((currentTodo) => currentTodo.id !== todo.id)
            );
            removeSnackbar(todo.id);
          } catch (error) {
            if (!isMountedRef.current) {
              return;
            }

            setTodos((currentTodos) =>
              currentTodos.map((currentTodo) =>
                currentTodo.id === todo.id ? originalTodo : currentTodo
              )
            );
            onError(getErrorMessage(error));
          }
        }, UNDO_TIMEOUT_MS);

        pendingActionsRef.current.set(todo.id, {
          type: "complete",
          todo: originalTodo,
          timerId
        });
        enqueueSnackbar({
          id: todo.id,
          type: "complete",
          message: "Todo completed"
        });
      } catch (error) {
        if (!isMountedRef.current) {
          return;
        }

        setTodos((currentTodos) =>
          currentTodos.map((currentTodo) =>
            currentTodo.id === todo.id ? originalTodo : currentTodo
          )
        );
        onError(getErrorMessage(error));
      }
    },
    [clearPendingAction, enqueueSnackbar, onError, removeSnackbar, setTodos]
  );

  const requestDeleteTodo = useCallback(
    (todo: Todo) => {
      clearPendingAction(todo.id);
      removeSnackbar(todo.id);

      setPendingDeleteIds((ids) => new Set(ids).add(todo.id));

      const timerId = window.setTimeout(async () => {
        pendingActionsRef.current.delete(todo.id);
        setPendingDeleteIds((ids) => {
          const nextIds = new Set(ids);
          nextIds.delete(todo.id);
          return nextIds;
        });

        try {
          await deleteTodo(todo.id);

          if (!isMountedRef.current) {
            return;
          }

          setTodos((currentTodos) =>
            currentTodos.filter((currentTodo) => currentTodo.id !== todo.id)
          );
          removeSnackbar(todo.id);
        } catch (error) {
          if (!isMountedRef.current) {
            return;
          }

          setTodos((currentTodos) => addOrReplaceTodo(currentTodos, todo));
          onError(getErrorMessage(error));
        }
      }, UNDO_TIMEOUT_MS);

      pendingActionsRef.current.set(todo.id, {
        type: "delete",
        todo,
        timerId
      });
      enqueueSnackbar({
        id: todo.id,
        type: "delete",
        message: "Todo deleted"
      });
    },
    [clearPendingAction, enqueueSnackbar, onError, removeSnackbar, setTodos]
  );

  const undoActiveAction = useCallback(async () => {
    if (!activeSnackbar) {
      return;
    }

    const pendingAction = pendingActionsRef.current.get(activeSnackbar.id);

    if (!pendingAction) {
      removeSnackbar(activeSnackbar.id);
      return;
    }

    window.clearTimeout(pendingAction.timerId);
    pendingActionsRef.current.delete(activeSnackbar.id);
    removeSnackbar(activeSnackbar.id);

    if (pendingAction.type === "complete") {
      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) =>
          currentTodo.id === pendingAction.todo.id
            ? { ...pendingAction.todo, completed: false }
            : currentTodo
        )
      );

      try {
        const restoredTodo = await updateTodo(pendingAction.todo.id, { completed: false });

        if (!isMountedRef.current) {
          return;
        }

        setTodos((currentTodos) =>
          currentTodos.map((currentTodo) =>
            currentTodo.id === pendingAction.todo.id
              ? { ...restoredTodo, category: currentTodo.category ?? pendingAction.todo.category }
              : currentTodo
          )
        );
      } catch (error) {
        if (!isMountedRef.current) {
          return;
        }

        onError(getErrorMessage(error));
      }

      return;
    }

    setPendingDeleteIds((ids) => {
      const nextIds = new Set(ids);
      nextIds.delete(pendingAction.todo.id);
      return nextIds;
    });
    setTodos((currentTodos) => addOrReplaceTodo(currentTodos, pendingAction.todo));
  }, [activeSnackbar, onError, removeSnackbar, setTodos]);

  const closeSnackbar = useCallback(() => {
    showNextSnackbar();
  }, [showNextSnackbar]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      pendingActionsRef.current.forEach((pendingAction) => {
        window.clearTimeout(pendingAction.timerId);
      });
      pendingActionsRef.current.clear();
    };
  }, []);

  return {
    activeSnackbar,
    closeSnackbar,
    completeTodo,
    requestDeleteTodo,
    undoActiveAction,
    visibleTodos
  };
}

function addOrReplaceTodo(todos: Todo[], todo: Todo) {
  const hasTodo = todos.some((currentTodo) => currentTodo.id === todo.id);

  if (hasTodo) {
    return todos.map((currentTodo) => (currentTodo.id === todo.id ? todo : currentTodo));
  }

  return [...todos, todo].sort(
    (firstTodo, secondTodo) =>
      new Date(secondTodo.createdAt).getTime() - new Date(firstTodo.createdAt).getTime()
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
