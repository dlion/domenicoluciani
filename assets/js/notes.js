(() => {
  const page = document.querySelector('.notes-page');
  if (!page) return;

  const notes = Array.from(page.querySelectorAll('.note-item'));
  const filter = page.querySelector('.notes-filter');
  const filterTag = page.querySelector('.notes-filter-tag');

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
    notes.forEach((note) => {
      const tags = (note.dataset.tags || '').split(',').filter(Boolean);
      const show = !active || tags.includes(active);
      note.classList.toggle('is-hidden', !show);
    });
  };

  applyFilter(getTag());
})();
