import styles from "./FilterInput.module.css";

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className={styles.group}>
      <label htmlFor="filterInput" className={styles.label}>
        Search Todos
      </label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search by title..."
        className={styles.input}
      />
    </div>
  );
}

export default FilterInput;
