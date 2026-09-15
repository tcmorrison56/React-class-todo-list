import { useMemo } from "react";
import TodoListItem from "./TodoListItem";
import styles from "./TodoList.module.css";

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  onDeleteTodo,
  dataVersion,
  statusFilter = "active",
  filterTerm,
}) {
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
      default:
        filteredTodos = [
          ...todoList.filter((todo) => !todo.isCompleted),
          ...todoList.filter((todo) => todo.isCompleted),
        ];
        break;
    }

    return { version: dataVersion, todos: filteredTodos };
  }, [todoList, dataVersion, statusFilter]);

  const getEmptyMessage = () => {
    if (filterTerm.trim() !== "") {
      return "No Todos match your current filter.";
    }
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
    <p className={styles.emptyMessage}>{getEmptyMessage()}</p>
  ) : (
    <ul className={styles.list}>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          todo={todo}
          key={todo.id}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
