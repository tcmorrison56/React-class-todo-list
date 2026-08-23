import { useMemo } from "react";
import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion }) {
  const filteredTodoList = useMemo(() => {
    console.log(`Recalculating filtered todos(v${dataVersion})`);
    const filteredTodos = todoList.filter((todo) => todo.isCompleted === false);
    return { version: dataVersion, todos: filteredTodos };
  }, [todoList, dataVersion]);
  return filteredTodoList.todos.length === 0 ? (
    <p>Add todo above to get started</p>
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
