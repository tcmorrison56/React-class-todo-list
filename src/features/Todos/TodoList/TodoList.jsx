import { useMemo } from "react";
import TodoListItem from "./TodoListItem";

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  dataVersion,
  statusFilter = "active",
}) {
  // console.log(todoList, dataVersion);
  const filteredTodoList = useMemo(() => {
    let filteredTodos;
    switch (statusFilter) {
      case "completed":
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;
      case "active":
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;
      case "all":
        filteredTodos = todoList;
        break;
    }

    return { version: dataVersion, todos: filteredTodos };
  }, [todoList, dataVersion, statusFilter]);

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case "completed":
        return "No completed todos yet. Complete some tasks to see them here.";
      case "active":
        return "No active todos. Add a todo above to get started.";
      case "all":
      default:
        return "Add todo above to get started.";
    }
  };

  return filteredTodoList.todos.length === 0 ? (
    <p>{getEmptyMessage()}</p>
  ) : (
    <ul>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          todo={todo}
          key={todo.id}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
