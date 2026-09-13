import { useRef, useEffect } from "react";
import { useEditableTitle } from "../../../hooks/useEditableTitle";
import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import styles from "./TodoListItem.module.css";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  const {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit,
  } = useEditableTitle(todo.title);

  const editRef = useRef();

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
    }
  }, [isEditing]);

  function handleEdit(e) {
    updateTitle(e.target.value);
  }

  function handleUpdate(e) {
    if (isEditing === false) return;
    e.preventDefault();
    const finalTitle = finishEdit();
    onUpdateTodo({ ...todo, title: finalTitle });
  }

  function handleDelete(e) {
    e.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this todo item?",
    );
    if (confirmed) {
      onDeleteTodo(todo.id);
    }
  }

  return (
    <li className={styles.item}>
      <form
        onSubmit={handleUpdate}
        className={isEditing ? styles.editForm : styles.viewForm}
      >
        {isEditing ? (
          <>
            <TextInputWithLabel
              value={workingTitle}
              onChange={handleEdit}
              ref={editRef}
              elementId="editTodoTitle"
              labelText="Edit:"
            />
            <button
              onClick={cancelEdit}
              type="button"
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={!isValidTodoTitle(workingTitle)}
              className={styles.updateButton}
            >
              Update
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
                className={styles.checkbox}
                aria-label={`Mark "${todo.title}" as complete`}
              />
            </label>
            <span
              onClick={() => startEditing()}
              className={`${styles.title} ${todo.isCompleted ? styles.completed : ""}`}
            >
              {todo.title}
            </span>
            <button
              type="button"
              onClick={handleDelete}
              className={styles.deleteButton}
              aria-label="Delete todo"
            >
              &times;
            </button>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
