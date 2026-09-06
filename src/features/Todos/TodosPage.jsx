import { useEffect, useReducer } from "react";
import TodoList from "./TodoList/TodoList";
import TodoForm from "./TodoForm";
import SortBy from "../../shared/SortBy";
import useDebounce from "../../utils/useDebounce";
import FilterInput from "../../shared/FilterInput";
import {
  TODO_ACTIONS,
  initialTodoState,
  todoReducer,
} from "../../reducers/todoReducer";

function TodosPage({ token }) {
  const [todoState, dispatch] = useReducer(todoReducer, initialTodoState);
  const debouncedFilterTerm = useDebounce(todoState.filterTerm, 300);
  // const todoList = todoState.todoList.tasks;

  // ---------- Filter handler function ----------
  const handleFilterChange = (newTerm) => {
    // setFilterTerm(newTerm);
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { term: newTerm } });
  };

  // ---------- Cache invalidation ------------

  // REPLACED WITH REDUCER DISPATCH?

  // const invalidateCache = useCallback(() => {
  //   setDataVersion((prev) => prev + 1);
  // }, []);

  // ---------- Fetch todos on login ----------
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // setIsTodoListLoading(true);
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
        // setTodoList(data.tasks);
        // setFilterError("");
        console.log(data);
        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { data: data.tasks },
        });
      } catch (error) {
        if (
          debouncedFilterTerm ||
          todoState.sortBy !== "createdAt" ||
          todoState.sortDirection !== "desc"
        ) {
          // setFilterError(`Error filtering/sorting todos: ${error.message}`);
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: { error: null, filterError: error },
          });
        } else {
          // setError(`Error fetching todos: ${error.message}`);
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: { error: error, filterError: null },
          });
        }
        // setError(`Error: ${error.name} | ${error.message}`);
      }
    };
    if (token) {
      fetchTodos();
    }
    return () => {
      // setError("");
      // setIsTodoListLoading(false);
      dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
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
    // setError("");
    const tempTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    // setTodoList((previous) => [tempTodo, ...previous]);
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
        // --- Roll back todo by removing the todo with the temp todo id ---
        // setTodoList((previous) =>
        //   previous.filter((todo) => todo.id !== tempTodo.id),
        // );
        const message =
          response.status === 401
            ? `Unauthorized: Please log in ${data?.message}`
            : `Failed to add Todo: ${data?.message}`;
        throw new Error(message);
      }

      if (response.ok) {
        // setTodoList((previous) =>
        //   previous.map((todo) => {
        //     if (todo.id === tempTodo.id) {
        //       return data;
        //     } else {
        //       return todo;
        //     }
        //   }),
        // );
        // invalidateCache();
        dispatch({
          type: TODO_ACTIONS.ADD_TODO_SUCCESS,
          payload: { tempId: tempTodo.id, data: data },
        });
      }
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { error: error },
      });
    }
  }

  // ---------- Complete todo function ----------
  async function completeTodo(id) {
    // setError("");
    console.log(todoState.todoList);
    const rollbackTodo = todoState.todoList.find((todo) => todo.id === id);
    const completedTodoList = todoState.todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });
    // setTodoList(completedTodoList);
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
        // setTodoList((previous) =>
        //   previous.map((todo) =>
        //     todo.id === rollbackTodo.id ? { ...rollbackTodo } : todo,
        //   ),
        // );
        if (response.status === 401) {
          throw new Error(`Unauthorized: Please log in ${data?.message}`);
        } else {
          throw new Error(`Failed to mark Todo complete: ${data?.message}`);
        }
      }
      if (response.ok) {
        // invalidateCache();
        dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
      }
    } catch (error) {
      // setError(`Error: ${error.name} | ${error.message}`);
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { rollbackTodo },
        error: error,
      });
    }
  }

  // ----------- Update todo function ----------
  async function updateTodo(editedTodo) {
    // setError("");
    const rollbackTodo = editedTodo;
    console.log(todoState.todoList, todoState);
    const updatedTodos = todoState.todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo,
    );
    // setTodoList(updatedTodos);
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
        // setTodoList((previous) =>
        //   previous.map((todo) =>
        //     todo.id === rollbackTodo.id ? { ...rollbackTodo } : todo,
        //   ),
        // );
        const message =
          response.status === 401
            ? "Unauthorized: Please log in"
            : "Failed to update Todo";
        throw new Error(message);
      }
      if (response.ok) {
        // invalidateCache();
        dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
      }
    } catch (error) {
      // setError(`Error: ${error.name} | ${error.message}`);
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
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>
            Clear Filter Error
          </button>
          <button
            onClick={() => {
              // setFilterTerm("");
              // setSortBy("createdAt");
              // setSortDirection("desc");
              // setFilterError("");
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
    </>
  );
}

export default TodosPage;
