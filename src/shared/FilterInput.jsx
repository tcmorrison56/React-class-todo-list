function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div>
      <label htmlFor="filterInput">Search Todos</label>
      <input
        type="text"
        id="filterInput"
        value={filterTerm}
        onChange={onFilterChange(event.target.value)}
        placeholder="Search by title..."
      />
    </div>
  );
}

export default FilterInput;
