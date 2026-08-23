export default function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  function handleByChange(event) {
    onSortByChange(event.target.value);
  }

  function handleDirectionChange(event) {
    onSortDirectionChange(event.target.value);
  }

  return (
    <form>
      <label>
        Sort By
        <select value={sortBy} onChange={handleByChange}>
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </select>
      </label>
      <label>
        Order
        <select value={sortDirection} onChange={handleDirectionChange}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </label>
    </form>
  );
}
