import { useState, useEffect } from "react";
import TodoList from "./TodoList";
import TodoForm from "../TodoForm";

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      try {
        setIsTodoListLoading(true);
        const params = new URLSearchParams({ limit: 100 });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
          console.log(data);
        } else if (response.status === 401) {
          setError(`Unauthorized: ${data?.message}`);
        } else {
          setError(data?.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        console.log("finally");
      }
    }
  }, [token]);

  function addTodo(todoTitle) {
    const newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    setTodoList((previous) => [newTodo, ...previous]);
  }

  function completeTodo(id) {
    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodoList);
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo,
    );
    setTodoList(updatedTodos);
  }
  return (
    <>
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
