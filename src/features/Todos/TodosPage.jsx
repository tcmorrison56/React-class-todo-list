import { useEffect, useReducer } from "react";
import TodoList from "./TodoList/TodoList";
import TodoForm from "./TodoForm";
import SortBy from "../../shared/SortBy";
import FilterInput from "../../shared/FilterInput";
import Logoff from "../Logoff";
import useDebounce from "../../utils/useDebounce";
import { useAuth } from "../../contexts/AuthContext";
import {
  TODO_ACTIONS,
  initialTodoState,
  todoReducer,
} from "../../reducers/todoReducer";

function TodosPage() {
  const [todoState, dispatch] = useReducer(todoReducer, initialTodoState);
  const debouncedFilterTerm = useDebounce(todoState.filterTerm, 300);
  const { token } = useAuth();

  // ---------- Filter handler function ----------
  const handleFilterChange = (newTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { term: newTerm } });
  };

  // ---------- Cache invalidation ------------

  // REPLACED WITH REDUCER DISPATCH?

  // ---------- Fetch todos on login ----------
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        dispatch({ type: TODO_ACTIONS.FETCH_START });
        const paramsObj = {
          sortBy: todoState.sortBy,
          sortDirection: todoState.sortDirection,
          limit: 100,
        };
        if (debouncedFilterTerm) {
          paramsObj.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObj);
        const response = await fetch(`/api/tasks?${params}`, {
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          const message =
            response.status === 401
              ? `Unauthorized: ${data?.message}`
              : `Unable to load todos: ${data?.message}`;

          throw new Error(message);
        }
        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: data.tasks },
        });
      } catch (error) {
        if (
          debouncedFilterTerm ||
          todoState.sortBy !== "createdAt" ||
          todoState.sortDirection !== "asc"
        ) {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: { error: null, filterError: error.message },
          });
        } else {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: { error: error.message, filterError: null },
          });
        }
      }
    };
    if (token) {
      fetchTodos();
    }
    return () => {
      dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
      // dispatch({ type: TODO_ACTIONS.RESET_FILTERS });
    };
  }, [
    token,
    todoState.sortBy,
    todoState.sortDirection,
    dispatch,
    debouncedFilterTerm,
  ]);

  // --------- Add todo function ---------
  async function addTodo(todoTitle) {
    const tempTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: tempTodo });

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });
      const data = await response.json();
      if (!response.ok) {
        const message =
          response.status === 401
            ? `Unauthorized: Please log in ${data?.message}`
            : `Failed to add Todo: ${data?.message}`;
        throw new Error(message);
      }

      if (response.ok) {
        dispatch({
          type: TODO_ACTIONS.ADD_TODO_SUCCESS,
          payload: { tempId: tempTodo.id, data: data },
        });
      }
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { error: error, tempId: tempTodo.id },
      });
    }
  }

  // ---------- Complete todo function ----------
  async function completeTodo(id) {
    const rollbackTodo = todoState.todoList.find((todo) => todo.id === id);
    const completedTodoList = todoState.todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { completedTodos: completedTodoList },
    });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
        body: JSON.stringify({ isCompleted: true }),
      });
      const data = await response.json();
      if (!response.ok) {
        const message =
          response.status === 401
            ? `Unauthorized: Please log in ${data?.message}`
            : `Failed to mark Todo complete: ${data?.message}`;
        throw new Error(message);
      }
      if (response.ok) {
        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
      }
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { rollbackTodo },
        error: error,
      });
    }
  }

  // ----------- Update todo function ----------
  async function updateTodo(editedTodo) {
    const rollbackTodo = editedTodo;
    const updatedTodos = todoState.todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo,
    );
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { updatedTodos },
    });
    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });
      if (!response.ok) {
        const message =
          response.status === 401
            ? "Unauthorized: Please log in"
            : "Failed to update Todo";
        throw new Error(message);
      }
      if (response.ok) {
        dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
      }
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { rollbackTodo, error },
      });
    }
  }

  return (
    <>
      {todoState.error && (
        <>
          <p>{todoState.error}</p>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>
            Clear Error
          </button>
        </>
      )}
      {todoState.filterError && (
        <div>
          <p>{todoState.filterError}</p>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
            Clear Filter Error
          </button>
          <button
            onClick={() => {
              dispatch({ type: TODO_ACTIONS.RESET_FILTERS });
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {todoState.isTodoListLoading && <p>Loading Todo List...</p>}
      <SortBy
        sortBy={todoState.sortBy}
        sortDirection={todoState.sortDirection}
        onSortByChange={(newSortBy) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: newSortBy,
              sortDirection: todoState.sortDirection,
            },
          })
        }
        onSortDirectionChange={(newSortDir) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: todoState.sortBy, sortDirection: newSortDir },
          })
        }
      />
      <FilterInput
        filterTerm={todoState.filterTerm}
        onFilterChange={handleFilterChange}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={todoState.dataVersion}
      />
      <Logoff />
    </>
  );
}

export default TodosPage;
