export const TODO_ACTIONS = {
  // fetch operations
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",

  // add todo operations
  ADD_TODO_START: "ADD_TODO_START",
  ADD_TODO_SUCCESS: "ADD_TODO_SUCCESS",
  ADD_TODO_ERROR: "ADD_TODO_ERROR",

  // complete todo operations
  COMPLETE_TODO_START: "COMPLETE_TODO_START",
  COMPLETE_TODO_SUCCESS: "COMPLETE_TODO_SUCCESS",
  COMPLETE_TODO_ERROR: "COMPLETE_TODO_SUCCESS",

  // update todo operations
  UPDATE_TODO_START: "UPDATE_TODO_START",
  UPDATE_TODO_SUCCESS: "UPDATE_TODO_SUCCESS",
  UPDATE_TODO_ERROR: "UPDATE_TODO_SUCCESS",

  // ui operations
  SET_SORT: "SET_SORT",
  SET_FILTER: "SET_FILTER",
  CLEAR_ERROR: "CLEAR_ERROR",
  RESET_FILTERS: "RESET_FILTERS",
};

export const initialTodoState = {
  todoList: [],
  error: "",
  filterError: "",
  isTodoListLoading: true,
  sortBy: "createdAt",
  sortDirection: "asc",
  filterTerm: "",
  dataVersion: 0,
};

export function todoReducer(state, action) {
  console.log("Dispatched action:", action.type, action.payload);
  switch (action.type) {
    // fetch todo operations
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: "",
        filterError: "",
      };

    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        isTodoListLoading: false,
        todoList: action.payload.data,
      };

    case TODO_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        isTodoListLoading: false,
        error: action.payload.error,
        filterError: action.payload.filterError,
      };

    // add todo operations
    case TODO_ACTIONS.ADD_TODO_START:
      return {
        ...state,
        todoList: [action.payload, ...state.todoList],
        error: "",
      };

    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.tempId ? action.payload.data : todo,
        ),
      };

    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        error: action.payload.error,
        todoList: state.todoList.filter(
          (todo) => todo.id !== action.payload.tempId,
        ),
      };

    // complete todo operations
    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        error: "",
        todoList: action.payload.completedTodos,
      };

    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };

    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.rollbackTodo.id
            ? { ...action.payload.rollbackTodo }
            : todo,
        ),
        error: action.payload.error,
      };

    // update todo operations
    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        error: "",
        todoList: action.payload.updatedTodos,
      };

    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };

    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.error,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.rollbackTodo.id
            ? { ...action.payload.rollbackTodo }
            : todo,
        ),
      };

    // ui operations
    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection,
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filterTerm: action.payload.term,
      };

    case TODO_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: "",
        filterError: "",
        isTodoListLoading: false,
      };

    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        sortBy: "createdAt",
        sortDirection: "desc",
        filterTerm: "",
        filterError: "",
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
