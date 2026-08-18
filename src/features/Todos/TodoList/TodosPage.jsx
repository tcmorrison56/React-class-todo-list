import { useState, useEffect } from "react";
import TodoList from "./TodoList";
import TodoForm from "../TodoForm";

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
          setError(data?.message);
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
    const currentTodos = todoList;
    const tempTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    setTodoList((previous) => [tempTodo, ...previous]);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
        credentials: "include",
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });
      if (!response.ok) {
        setTodoList(currentTodos);
        setError("Unable to add Todo");
      }
      if (response.ok) {
        const data = await response.json();
        setTodoList([data, ...currentTodos]);
      }
    } catch (error) {
      //add error message
      setError(`Error: ${error.name} | ${error.message}`);
    }
  }

  // Complete todo function
  async function completeTodo(id) {
    // const currentTodo = todoList.find((todo) => todo.id === id);
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
      console.log(response);
      if (!response.ok) {
        const resetTodoList = todoList.map((todo) => {
          if (todo.id === id) {
            return { ...todo, isCompleted: false };
          } else {
            return todo;
          }
        });
        setTodoList(resetTodoList);
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
        setError("Unable to update Todo");
        const rollbackTodos = todoList.map((todo) =>
          todo.id === rollbackTodo.id ? { ...rollbackTodo } : todo,
        );
        setTodoList(rollbackTodos);
      }
    } catch (error) {
      setError(`Error: ${error.name} | ${error.message}`);
    }
  }
  return (
    <>
      {error && <p>{error}</p>}
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
