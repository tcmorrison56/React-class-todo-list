import styles from "./SortBy.module.css";

function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <>
      <div className={styles.group}>
        <label htmlFor="sortBy" className={styles.label}>
          Sort By
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className={styles.select}
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className={styles.group}>
        <label htmlFor="order" className={styles.label}>
          Order
        </label>
        <select
          id="order"
          value={sortDirection}
          onChange={(e) => onSortDirectionChange(e.target.value)}
          className={styles.select}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </>
  );
}

export default SortBy;
