window.YRB = window.YRB || {};

YRB.catalog = {
  filterListings(listings, filters) {
    const { category = 'all', condition = 'all' } = filters || {};
    return listings.filter((item) => {
      const categoryMatches = category === 'all' || item.category === category;
      const conditionMatches = condition === 'all' || item.condition === condition;
      return categoryMatches && conditionMatches;
    });
  },

  renderListingCard(listing) {
    const priceText = YRB.format.price(listing);
    const badgeClass = YRB.format.conditionClass(listing.condition);
    const badgeLabel = YRB.format.conditionLabel(listing.condition);
    const specRows = Object.entries(listing.specs)
      .map(([key, value]) => `<tr><th>${key}</th><td>${value}</td></tr>`)
      .join('');

    return `
      <article class="listing-card" data-category="${listing.category}" data-condition="${listing.condition}">
        <img class="listing-card__image" src="${listing.image}" alt="" loading="lazy">
        <div class="listing-card__body">
          <span class="${badgeClass}">${badgeLabel}</span>
          <h3 class="listing-card__title">${listing.name}</h3>
          <p class="listing-card__price">${priceText} &middot; ${listing.qtyAvailable} available</p>
          <table class="listing-card__specs">${specRows}</table>
          <p class="listing-card__description">${listing.description}</p>
          <div class="listing-card__actions">
            <a class="button button--primary" href="${YRB.format.mailtoLink(listing)}">Email about this listing</a>
            <a class="button button--secondary" href="${YRB.format.telLink()}">Call / Text</a>
          </div>
        </div>
      </article>
    `;
  },

  renderCatalog(containerEl, emptyEl, listings) {
    if (!listings.length) {
      containerEl.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    containerEl.innerHTML = listings.map(YRB.catalog.renderListingCard).join('');
  }
};
