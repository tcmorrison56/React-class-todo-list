import { useState, useEffect, useCallback } from "react";
import TodoList from "./TodoList/TodoList";
import TodoForm from "./TodoForm";
import SortBy from "../../shared/SortBy";
import useDebounce from "../../utils/useDebounce";
import FilterInput from "../../shared/FilterInput";

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterTerm, setFilterTerm] = useState("");
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState("");

  // ---------- Filter handler function ----------
  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  // ---------- Cache invalidation ------------
  const invalidateCache = useCallback(() => {
    console.log("Invalidating memo cache after todo mutation");
    setDataVersion((prev) => prev + 1);
  }, []);

  // ---------- Fetch todos on login ----------
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsTodoListLoading(true);
        const paramsObj = { sortBy, sortDirection, limit: 100 };
        if (debouncedFilterTerm) {
          paramsObj.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObj);
        const response = await fetch(`/api/tasks?${params}`, {
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
          setTodoList(data.tasks);
          setFilterError("");
        } else if (response.status === 401) {
          setError(`Unauthorized: ${data?.message}`);
        } else {
          setError(`Unable to load todos: ${data?.message}`);
        }
      } catch (error) {
        if (
          debouncedFilterTerm ||
          sortBy !== "createdAt" ||
          sortDirection !== "desc"
        ) {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
        // setError(`Error: ${error.name} | ${error.message}`);
      } finally {
        setIsTodoListLoading(false);
      }
    };
    if (token) {
      fetchTodos();
    }
    return () => {
      setError("");
      setIsTodoListLoading(false);
    };
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  // --------- Add todo function ---------
  async function addTodo(todoTitle) {
    setError("");
    const tempTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    setTodoList((previous) => [tempTodo, ...previous]);

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
        setTodoList((previous) =>
          previous.filter((todo) => todo.id !== tempTodo.id),
        );
        if (response.status === 401) {
          throw new Error(`Unauthorized: Please log in ${data?.message}`);
        } else {
          throw new Error(`Failed to add Todo: ${data?.message}`);
        }
      }
      if (response.ok) {
        setTodoList((previous) =>
          previous.map((todo) => {
            if (todo.id === tempTodo.id) {
              return data;
            } else {
              return todo;
            }
          }),
        );
        invalidateCache();
      }
    } catch (error) {
      setError(`Error: ${error.name} | ${error.message}`);
    }
  }

  // ---------- Complete todo function ----------
  async function completeTodo(id) {
    setError("");
    const rollbackTodo = todoList.find((todo) => todo.id === id);
    const completedTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });
    setTodoList(completedTodoList);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
        body: JSON.stringify({ isCompleted: true }),
      });
      const data = await response.json();
      if (!response.ok) {
        setTodoList((previous) =>
          previous.map((todo) =>
            todo.id === rollbackTodo.id ? { ...rollbackTodo } : todo,
          ),
        );
        if (response.status === 401) {
          throw new Error(`Unauthorized: Please log in ${data?.message}`);
        } else {
          throw new Error(`Failed to mark Todo complete: ${data?.message}`);
        }
      }
      if (response.ok) {
        invalidateCache();
      }
    } catch (error) {
      setError(`Error: ${error.name} | ${error.message}`);
    }
  }

  // ----------- Update todo function ----------
  async function updateTodo(editedTodo) {
    setError("");
    const rollbackTodo = editedTodo;
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo,
    );
    setTodoList(updatedTodos);
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
        setTodoList((previous) =>
          previous.map((todo) =>
            todo.id === rollbackTodo.id ? { ...rollbackTodo } : todo,
          ),
        );
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in");
        } else {
          throw new Error("Failed to update Todo");
        }
      }
      if (response.ok) {
        invalidateCache();
      }
    } catch (error) {
      setError(`Error: ${error.name} | ${error.message}`);
    }
  }

  return (
    <>
      {error && (
        <>
          <p>{error}</p>
          <button onClick={() => setError("")}>Clear Error</button>
        </>
      )}
      {filterError && (
        <div>
          <p>{filterError.message}</p>
          <button onClick={() => setFilterError("")}>Clear Filter Error</button>
          <button
            onClick={() => {
              setFilterTerm("");
              setSortBy("createdAt");
              setSortDirection("desc");
              setFilterError("");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading Todo List...</p>}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </>
  );
}

export default TodosPage;
