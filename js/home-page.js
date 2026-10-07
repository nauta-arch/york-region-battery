document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('featured-listings');
  const featured = YRB.LISTINGS.slice(0, 3);
  container.innerHTML = featured.map(YRB.catalog.renderListingCard).join('');
});
