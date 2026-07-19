(() => {
  const page = document.querySelector('.notes-page');
  if (!page) return;

  const notes = Array.from(page.querySelectorAll('.note-item'));
  const monthHeadings = Array.from(page.querySelectorAll('[data-notes-month]'));
  const form = page.querySelector('#notesExploreForm');
  const searchInput = page.querySelector('#notesSearch');
  const moodSelect = page.querySelector('#notesMood');
  const yearSelect = page.querySelector('#notesYear');
  const tagSelect = page.querySelector('#notesTag');
  const clearLink = page.querySelector('#notesClear');
  const randomButton = page.querySelector('#notesRandom');
  const resultSummary = page.querySelector('#notesResultSummary');
  const filterStatus = page.querySelector('#notesFilterStatus');
  const filterStatusText = filterStatus && filterStatus.querySelector('.notes-filter-tag');
  const emptyState = page.querySelector('#notesEmpty');

  let visibleNotes = notes.slice();
  let filterFrame = 0;

  const normalize = (value) => (value || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
  const pluralize = (count, singular) => `${count} ${singular}${count === 1 ? '' : 's'}`;

  const readUrlState = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') || '',
      mood: params.get('mood') || '',
      year: params.get('year') || '',
      tag: normalize(params.get('tag') || params.get('t'))
    };
  };

  const setControls = (state) => {
    if (searchInput) searchInput.value = state.q || '';
    if (moodSelect) moodSelect.value = state.mood || '';
    if (yearSelect) yearSelect.value = state.year || '';
    if (tagSelect) {
      const tag = normalize(state.tag);
      const exists = Array.from(tagSelect.options).some((option) => option.value === tag);
      tagSelect.value = exists ? tag : '';
    }
  };

  const controlState = () => ({
    q: normalize(searchInput && searchInput.value),
    mood: moodSelect ? moodSelect.value : '',
    year: yearSelect ? yearSelect.value : '',
    tag: normalize(tagSelect && tagSelect.value)
  });

  const updateUrl = (state) => {
    const url = new URL(window.location.href);
    [['q', state.q], ['mood', state.mood], ['year', state.year], ['tag', state.tag]].forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    });
    url.searchParams.delete('t');
    window.history.replaceState(null, '', url);
  };

  const updateMonthVisibility = () => {
    monthHeadings.forEach((heading) => {
      let sibling = heading.nextElementSibling;
      let hasVisibleNote = false;
      while (sibling && !sibling.matches('[data-notes-month]')) {
        if (sibling.classList.contains('note-item') && !sibling.classList.contains('is-hidden')) hasVisibleNote = true;
        sibling = sibling.nextElementSibling;
      }
      heading.hidden = !hasVisibleNote;
    });
  };

  const applyFilters = (syncUrl = false) => {
    const state = controlState();
    visibleNotes = [];

    notes.forEach((note) => {
      const tags = normalize(note.dataset.tags).split(',').filter(Boolean);
      const matchesSearch = !state.q || normalize(note.dataset.search).includes(state.q);
      const matchesMood = !state.mood || note.dataset.mood === state.mood;
      const matchesYear = !state.year || note.dataset.year === state.year;
      const matchesTag = !state.tag || tags.includes(state.tag);
      const visible = matchesSearch && matchesMood && matchesYear && matchesTag;
      note.classList.toggle('is-hidden', !visible);
      if (visible) visibleNotes.push(note);
    });

    updateMonthVisibility();
    const details = [];
    if (state.q) details.push(`matching “${state.q}”`);
    if (state.mood) details.push(`${state.mood} mood`);
    if (state.year) details.push(`from ${state.year}`);
    if (state.tag) details.push(`tagged #${state.tag}`);
    const countLabel = pluralize(visibleNotes.length, 'note');

    if (resultSummary) resultSummary.textContent = details.length ? `${countLabel} ${details.join(' · ')}` : `${countLabel} in the garden`;
    if (filterStatus) filterStatus.hidden = details.length === 0;
    if (filterStatusText) filterStatusText.textContent = `${countLabel}${details.length ? ` ${details.join(' · ')}` : ''}`;
    if (emptyState) emptyState.hidden = visibleNotes.length !== 0;
    if (syncUrl) updateUrl(state);
  };

  const queueFilter = () => {
    window.cancelAnimationFrame(filterFrame);
    filterFrame = window.requestAnimationFrame(() => applyFilters(true));
  };

  const copyText = async (value) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  };

  const state = readUrlState();
  setControls(state);
  applyFilters(false);

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilters(true);
    });
    form.addEventListener('input', queueFilter);
    form.addEventListener('change', () => applyFilters(true));
  }

  if (clearLink) {
    clearLink.addEventListener('click', (event) => {
      event.preventDefault();
      setControls({ q: '', mood: '', year: '', tag: '' });
      applyFilters(true);
      if (searchInput) searchInput.focus();
    });
  }

  page.querySelectorAll('.note-tag').forEach((link) => {
    link.addEventListener('click', (event) => {
      const url = new URL(link.href);
      const tag = normalize(url.searchParams.get('tag') || url.searchParams.get('t'));
      if (!tag || !tagSelect) return;
      event.preventDefault();
      tagSelect.value = tag;
      applyFilters(true);
      page.querySelector('.explore-panel').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  });

  page.querySelectorAll('[data-copy-note]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.dataset.copyNote;
      const original = button.textContent;
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      try {
        await copyText(url);
        button.textContent = 'Copied';
        window.setTimeout(() => { button.textContent = original; }, 1200);
      } catch (_) {
        button.textContent = 'Copy failed';
      }
    });
  });

  page.querySelectorAll('.note-connections a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (target && target.classList.contains('is-hidden')) {
        setControls({ q: '', mood: '', year: '', tag: '' });
        applyFilters(true);
      }
    });
  });

  if (randomButton) {
    randomButton.addEventListener('click', () => {
      if (!visibleNotes.length) return;
      const note = visibleNotes[Math.floor(Math.random() * visibleNotes.length)];
      const url = new URL(window.location.href);
      url.hash = note.id;
      window.history.replaceState(null, '', url);
      note.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    });
  }

  page.querySelectorAll('.note-content img').forEach((image) => {
    image.loading = 'lazy';
    image.decoding = 'async';
  });

  window.addEventListener('popstate', () => {
    const nextState = readUrlState();
    setControls(nextState);
    applyFilters(false);
  });
})();
