(() => {
  const page = document.querySelector('.photos-page');
  if (!page) return;

  const photos = Array.from(page.querySelectorAll('.photo-card'));
  const filter = page.querySelector('.photos-filter');
  const filterTag = page.querySelector('.photos-filter-tag');

  const getTag = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('t') || params.get('tag') || '';
  };

  const applyFilter = (tag) => {
    const active = tag || '';
    if (filter) {
      filter.hidden = !active;
      if (active && filterTag) filterTag.textContent = `#${active}`;
    }
    photos.forEach((photo) => {
      const tags = (photo.dataset.tags || '').split(',').filter(Boolean);
      const show = !active || tags.includes(active);
      photo.classList.toggle('is-hidden', !show);
    });
  };

  applyFilter(getTag());
})();
