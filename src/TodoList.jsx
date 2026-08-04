import TodoListItem from "./TodoListItem.jsx";

function TodoList({ todoList, onCompleteTodo }) {
  const filteredTodoList = todoList.filter(
    (todo) => todo.isCompleted === false,
  );
  return filteredTodoList.length === 0 ? (
    <p>Add todo above to get started</p>
  ) : (
    <ul>
      {filteredTodoList.map((todo) => (
        <TodoListItem
          todo={todo}
          key={todo.id}
          onCompleteTodo={onCompleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
