import { useRef } from "react";
import { useState } from "react";
import TextInputWithLabel from "/src/shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../utils/todoValidation";

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
      <TextInputWithLabel
        value={workingTodoTitle}
        ref={inputRef}
        onChange={handleChangeTodo}
        elementId="todoTitle"
        labelText="Todo"
      />
      <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
