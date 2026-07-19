(() => {
  const page = document.querySelector('.photos-page');
  if (!page) return;

  const cards = Array.from(page.querySelectorAll('.photo-card'));
  const form = page.querySelector('#photosExploreForm');
  const searchInput = page.querySelector('#photosSearch');
  const yearSelect = page.querySelector('#photosYear');
  const tagSelect = page.querySelector('#photosTag');
  const clearLink = page.querySelector('#photosClear');
  const surpriseButton = page.querySelector('#photosSurprise');
  const resultSummary = page.querySelector('#photosResultSummary');
  const filterStatus = page.querySelector('#photosFilterStatus');
  const filterStatusText = filterStatus && filterStatus.querySelector('.photos-filter-tag');
  const emptyState = page.querySelector('#photosEmpty');

  const viewer = page.querySelector('#photoViewer');
  const viewerImage = page.querySelector('#photoViewerImage');
  const viewerLocation = page.querySelector('#photoViewerLocation');
  const viewerDate = page.querySelector('#photoViewerDate');
  const viewerOriginal = page.querySelector('#photoViewerOriginal');
  const viewerNotes = page.querySelector('#photoViewerNotes');
  const viewerClose = page.querySelector('[data-photo-close]');
  const viewerPrevious = page.querySelector('[data-photo-prev]');
  const viewerNext = page.querySelector('[data-photo-next]');
  const viewerCopy = page.querySelector('[data-photo-copy]');

  let visibleCards = cards.slice();
  let activeCard = null;
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
      q: params.get('q') || params.get('place') || '',
      year: params.get('year') || '',
      tag: normalize(params.get('tag') || params.get('t'))
    };
  };

  const setControls = (state) => {
    if (searchInput) searchInput.value = state.q;
    if (yearSelect) yearSelect.value = state.year;
    if (tagSelect) {
      const exists = Array.from(tagSelect.options).some((option) => option.value === state.tag);
      tagSelect.value = exists ? state.tag : '';
    }
  };

  const controlState = () => ({
    q: normalize(searchInput && searchInput.value),
    year: yearSelect ? yearSelect.value : '',
    tag: normalize(tagSelect && tagSelect.value)
  });

  const updateUrl = (state) => {
    const url = new URL(window.location.href);
    [['q', state.q], ['year', state.year], ['tag', state.tag]].forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    });
    url.searchParams.delete('t');
    url.searchParams.delete('place');
    url.searchParams.delete('view');
    window.history.replaceState(null, '', url);
  };

  const applyFilters = (syncUrl = false) => {
    const state = controlState();
    visibleCards = [];

    cards.forEach((card) => {
      const tags = normalize(card.dataset.tags).split(',').filter(Boolean);
      const matchesSearch = !state.q || normalize(card.dataset.search).includes(state.q);
      const matchesYear = !state.year || card.dataset.year === state.year;
      const matchesTag = !state.tag || tags.includes(state.tag);
      const visible = matchesSearch && matchesYear && matchesTag;
      card.classList.toggle('is-hidden', !visible);
      if (visible) visibleCards.push(card);
    });

    const details = [];
    if (state.q) details.push(`matching “${state.q}”`);
    if (state.year) details.push(`from ${state.year}`);
    if (state.tag) details.push(`tagged #${state.tag}`);
    const countLabel = pluralize(visibleCards.length, 'photo');

    if (resultSummary) resultSummary.textContent = details.length ? `${countLabel} ${details.join(' · ')}` : `${countLabel} across the years`;
    if (filterStatus) filterStatus.hidden = details.length === 0;
    if (filterStatusText) filterStatusText.textContent = `${countLabel}${details.length ? ` ${details.join(' · ')}` : ''}`;
    if (emptyState) emptyState.hidden = visibleCards.length !== 0;
    if (syncUrl) updateUrl(state);
  };

  const queueFilter = () => {
    window.cancelAnimationFrame(filterFrame);
    filterFrame = window.requestAnimationFrame(() => applyFilters(true));
  };

  const linkForCard = (card) => `${window.location.origin}${window.location.pathname}${window.location.search}#${card.id}`;

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

  const renderViewer = (card) => {
    if (!card || !viewerImage) return;
    const sourceImage = card.querySelector('.photo-img');
    viewerImage.src = card.dataset.photoSrc || sourceImage.src;
    viewerImage.alt = sourceImage ? sourceImage.alt : 'Selected photo';
    if (viewerLocation) viewerLocation.textContent = card.dataset.photoLocation || 'A moment from the archive';
    if (viewerDate) viewerDate.textContent = card.dataset.photoDate || '';
    if (viewerOriginal) viewerOriginal.href = card.dataset.photoSrc || sourceImage.src;
    if (viewerNotes) {
      const noteTag = normalize(card.dataset.photoNoteTag);
      viewerNotes.hidden = !noteTag;
      viewerNotes.href = noteTag ? `/notes/?tag=${encodeURIComponent(noteTag)}` : '';
      viewerNotes.textContent = noteTag ? `Notes about #${noteTag}` : 'Related notes';
    }
    if (viewerPrevious) viewerPrevious.disabled = visibleCards.length < 2;
    if (viewerNext) viewerNext.disabled = visibleCards.length < 2;
    activeCard = card;
  };

  const openViewer = (card) => {
    if (!viewer || !card) return;
    if (!visibleCards.includes(card)) visibleCards = cards.filter((item) => !item.classList.contains('is-hidden'));
    renderViewer(card);
    document.body.classList.add('photo-viewer-open');
    if (typeof viewer.showModal === 'function' && !viewer.open) viewer.showModal();
    else viewer.setAttribute('open', '');
    const url = new URL(window.location.href);
    url.hash = card.id;
    window.history.replaceState(null, '', url);
  };

  const closeViewer = () => {
    if (!viewer) return;
    document.body.classList.remove('photo-viewer-open');
    if (typeof viewer.close === 'function' && viewer.open) viewer.close();
    else viewer.removeAttribute('open');
    if (activeCard) {
      const opener = activeCard.querySelector('[data-photo-open]');
      if (opener) opener.focus({ preventScroll: true });
    }
  };

  const moveViewer = (direction) => {
    if (!activeCard || visibleCards.length < 2) return;
    const current = visibleCards.indexOf(activeCard);
    const nextIndex = (current + direction + visibleCards.length) % visibleCards.length;
    renderViewer(visibleCards[nextIndex]);
    const url = new URL(window.location.href);
    url.hash = visibleCards[nextIndex].id;
    window.history.replaceState(null, '', url);
  };

  const initialState = readUrlState();
  setControls(initialState);
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
      setControls({ q: '', year: '', tag: '' });
      applyFilters(true);
      if (searchInput) searchInput.focus();
    });
  }

  page.querySelectorAll('.photo-tag, .photo-related').forEach((link) => {
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

  cards.forEach((card) => {
    const button = card.querySelector('[data-photo-open]');
    if (button) button.addEventListener('click', () => openViewer(card));
  });

  if (surpriseButton) {
    surpriseButton.addEventListener('click', () => {
      if (!visibleCards.length) return;
      openViewer(visibleCards[Math.floor(Math.random() * visibleCards.length)]);
    });
  }

  if (viewerClose) viewerClose.addEventListener('click', closeViewer);
  if (viewerPrevious) viewerPrevious.addEventListener('click', () => moveViewer(-1));
  if (viewerNext) viewerNext.addEventListener('click', () => moveViewer(1));
  if (viewerCopy) {
    viewerCopy.addEventListener('click', async () => {
      if (!activeCard) return;
      const original = viewerCopy.textContent;
      try {
        await copyText(linkForCard(activeCard));
        viewerCopy.textContent = 'Copied';
        window.setTimeout(() => { viewerCopy.textContent = original; }, 1200);
      } catch (_) {
        viewerCopy.textContent = 'Copy failed';
      }
    });
  }

  if (viewer) {
    viewer.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeViewer();
    });
    viewer.addEventListener('click', (event) => {
      if (event.target === viewer) closeViewer();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (!viewer || !viewer.open) return;
    if (event.key === 'ArrowLeft') moveViewer(-1);
    if (event.key === 'ArrowRight') moveViewer(1);
  });

  const hashCard = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
  if (hashCard && hashCard.classList.contains('photo-card')) openViewer(hashCard);

  window.addEventListener('popstate', () => {
    const state = readUrlState();
    setControls(state);
    applyFilters(false);
  });
})();
