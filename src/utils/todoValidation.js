export function isValidTodoTitle(title) {
  return title.trim() !== "" && title.length <= 150;
}

export function getTodoTitleError(title) {
  if (title.trim() === "") return "Todo title cannot be empty.";
  if (title.length > 150) return "Todo title must be 150 characters or fewer.";
  return "";
}
