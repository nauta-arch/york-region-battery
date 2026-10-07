window.YRB = window.YRB || {};

YRB.format = {
  price(listing) {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: listing.currency || 'CAD'
    }).format(listing.price);
  },

  conditionLabel(condition) {
    return condition === 'tested' ? 'Tested & Graded' : 'As-Is Salvage';
  },

  conditionClass(condition) {
    return condition === 'tested' ? 'badge badge--tested' : 'badge badge--asis';
  },

  mailtoLink(listing) {
    const subject = encodeURIComponent(`Inquiry: ${listing.name}`);
    return `mailto:lucasnauta@gmail.com?subject=${subject}`;
  },

  telLink() {
    return 'tel:+14378980642';
  }
};
