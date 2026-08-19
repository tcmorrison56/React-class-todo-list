import { useState, useEffect } from "react";
import TodoList from "./TodoList/TodoList";
import TodoForm from "./TodoForm";

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsTodoListLoading(true);
        const params = new URLSearchParams({ limit: 100 });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
          setTodoList(data.tasks);
        } else if (response.status === 401) {
          setError(`Unauthorized: ${data?.message}`);
        } else {
          setError(`Unable to load todos: ${data?.message}`);
        }
      } catch (error) {
        setError(`Error: ${error.name} | ${error.message}`);
      } finally {
        setIsTodoListLoading(false);
      }
    };
    if (token) {
      fetchTodos();
    }
  }, [token]);

  // Add todo function
  async function addTodo(todoTitle) {
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
        // Roll back todo by removing the todo with the temp todo id
        const rollbackTodos = todoList.filter(
          (todo) => todo.id !== tempTodo.id,
        );
        setTodoList(rollbackTodos);
        if (response.status === 401) {
          setError(`Unauthorized: Please log in ${data?.message}`);
        } else {
          setError(`Failed to add Todo: ${data?.message}`);
        }
      }
      if (response.ok) {
        const finalTodos = todoList.map((todo) => {
          if (todo.id === tempTodo.id) {
            return data;
          } else {
            return todo;
          }
        });
        setTodoList(finalTodos);
      }
    } catch (error) {
      //add error message
      setError(`Error: ${error.name} | ${error.message}`);
    }
  }

  // Complete todo function
  async function completeTodo(id) {
    const rollbackTodo = todoList.find((todo) => todo.id === id);
    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodoList);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
        body: JSON.stringify({ isCompleted: true }),
      });
      const data = await response.json();
      if (!response.ok) {
        const rollbackTodos = todoList.map((todo) =>
          todo.id === rollbackTodo.id ? { ...rollbackTodo } : todo,
        );
        setTodoList(rollbackTodos);
        if (response.status === 401) {
          setError(`Unauthorized: Please log in ${data?.message}`);
        } else {
          setError(`Failed to mark Todo completed: ${data?.message}`);
        }
      }
    } catch (error) {
      setError(`Error: ${error.name} | ${error.message}`);
    }
  }

  // Update todo function
  async function updateTodo(editedTodo) {
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
        const rollbackTodos = todoList.map((todo) =>
          todo.id === rollbackTodo.id ? { ...rollbackTodo } : todo,
        );
        setTodoList(rollbackTodos);
        if (response.status === 401) {
          setError("Unauthorized: Please log in");
        } else {
          setError("Failed to mark Todo completed");
        }
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

      {isTodoListLoading && <p>Loading Todo List...</p>}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </>
  );
}

export default TodosPage;
