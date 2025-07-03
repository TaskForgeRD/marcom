export function paginate<T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  return {
    paginatedData: data.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    total: data.length,
  };
}
