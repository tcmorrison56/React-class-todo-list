import { useRef, useEffect } from "react";
import { useEditableTitle } from "../../hooks/useEditableTitle";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../utils/todoValidation";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
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

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              value={workingTitle}
              onChange={handleEdit}
              ref={editRef}
              elementId="todoTitle"
              labelText="Todo"
            />
            <button onClick={cancelEdit} type="button">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={!isValidTodoTitle(workingTitle)}
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
              />
            </label>
            <span onClick={() => startEditing()}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
