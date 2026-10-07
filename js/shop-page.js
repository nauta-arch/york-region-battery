document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('catalog-grid');
  const empty = document.getElementById('catalog-empty');
  const categorySelect = document.getElementById('filter-category');
  const sourceSelect = document.getElementById('filter-source');
  const conditionSelect = document.getElementById('filter-condition');
  const resetButton = document.getElementById('filter-reset');

  function applyFilters() {
    const filters = {
      category: categorySelect.value,
      source: sourceSelect.value,
      condition: conditionSelect.value
    };
    const filtered = YRB.catalog.filterListings(YRB.LISTINGS, filters);
    YRB.catalog.renderCatalog(grid, empty, filtered);
  }

  categorySelect.addEventListener('change', applyFilters);
  sourceSelect.addEventListener('change', applyFilters);
  conditionSelect.addEventListener('change', applyFilters);
  resetButton.addEventListener('click', () => {
    categorySelect.value = 'all';
    sourceSelect.value = 'all';
    conditionSelect.value = 'all';
    applyFilters();
  });

  applyFilters();
});
