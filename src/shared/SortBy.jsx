function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  function handleSortByChange(event) {
    onSortByChange(event.targer.value);
  }

  function handleSortDirectionChange(event) {
    onSortDirectionChange(event.target.value);
  }

  return (
    <>
      <label htmlFor="sortBy">Sort By</label>
      <select id="sortBy" value={sortBy} onChange={handleSortByChange}>
        <option value="createdAt">Created At</option>
        <option value="title">Title</option>
      </select>
      <label htmlFor="order">Order</label>
      <select
        id="order"
        value={sortDirection}
        onChange={handleSortDirectionChange}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </>
  );
}

export default SortBy;
