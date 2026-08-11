import { useRef } from "react";
import { useState } from "react";

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  const handleChangeTodo = (event) => {
    setWorkingTodoTitle(event.target.value);
  };

  const handleAddTodo = (event) => {
    event.preventDefault();

    // Should the if statement contain todoTitle or workingTodoTitle?
    if (workingTodoTitle && workingTodoTitle !== "") {
      onAddTodo(workingTodoTitle);
      setWorkingTodoTitle("");
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        value={workingTodoTitle}
        ref={inputRef}
        type="text"
        id="todoTitle"
        name="todoTitle"
        placeholder={"Todo text"}
        onChange={handleChangeTodo}
        required
      />
      <button type="submit" disabled={!workingTodoTitle.trim()}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
