import { useRef, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../utils/todoValidation.js";
import styles from "./TodoForm.module.css";

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  const handleChangeTodo = (event) => {
    setWorkingTodoTitle(event.target.value);
  };

  const handleAddTodo = (event) => {
    event.preventDefault();

    if (isValidTodoTitle(workingTodoTitle)) {
      onAddTodo(workingTodoTitle);
      setWorkingTodoTitle("");
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo} className={styles.form}>
      <TextInputWithLabel
        value={workingTodoTitle}
        ref={inputRef}
        onChange={handleChangeTodo}
        elementId="todoTitle"
        labelText="Todo"
      />
      <button
        type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}
        className={styles.button}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
