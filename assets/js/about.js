/* About page: searchable place directory synchronized with the Leaflet map. */
(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function normalizeText(value) {
    return (value || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  function escapeHtml(value) {
    return (value || '').toString().replace(/[&<>'"]/g, function(character) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character];
    });
  }

  ready(function() {
    var places = Array.isArray(window.ABOUT_PLACES) ? window.ABOUT_PLACES : [];
    var countries = window.ABOUT_COUNTRIES || {};
    var search = document.getElementById('placesSearch');
    var count = document.getElementById('placesCount');
    var empty = document.getElementById('placesEmpty');
    var entries = Array.prototype.slice.call(document.querySelectorAll('[data-place-entry]'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('[data-place-group]'));
    var markerByName = new Map();

    function filterDirectory() {
      var query = normalizeText(search && search.value);
      var visible = 0;
      entries.forEach(function(entry) {
        var matches = !query || normalizeText(entry.dataset.placeSearch).includes(query);
        entry.hidden = !matches;
        if (matches) visible += 1;
      });
      groups.forEach(function(group) {
        var hasVisible = Boolean(group.querySelector('[data-place-entry]:not([hidden])'));
        group.hidden = !hasVisible;
        if (query && hasVisible) group.open = true;
      });
      if (count) count.textContent = visible + (visible === 1 ? ' place' : ' places');
      if (empty) empty.hidden = visible !== 0;
    }

    if (search) search.addEventListener('input', filterDirectory);
    filterDirectory();

    var el = document.getElementById('placesMap');
    if (!el || !window.L || !places.length) return;

    var theme = document.documentElement.getAttribute('data-theme') || 'light';
    var lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      noWrap: true,
      maxZoom: 8
    });
    var darkTiles = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles © Esri — Esri, DeLorme, NAVTEQ', maxZoom: 8, noWrap: true }
    );

    var worldBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));
    var map = L.map(el, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
      keyboard: true,
      maxBounds: worldBounds,
      maxBoundsViscosity: 0.9
    });
    var currentTiles = theme === 'dark' ? darkTiles : lightTiles;
    currentTiles.addTo(map);
    map.setMinZoom(2);

    var kindColors = { living: '#22c55e', lived: '#f59e0b', visited: '#60a5fa' };
    var bounds = [];

    places.forEach(function(place) {
      var lat = parseFloat(place.lat);
      var lon = parseFloat(place.lon);
      if (isNaN(lat) || isNaN(lon)) return;
      var color = kindColors[place.kind] || '#60a5fa';
      var country = countries[place.country] || place.country;
      var label = (place.name || '') + (country ? ', ' + country : '');
      var marker;

      if (place.kind === 'living') {
        var html = '<span class="live-dot" style="--live-color:' + color + '"></span>';
        marker = L.marker([lat, lon], {
          icon: L.divIcon({ className: 'pin-live', html: html, iconSize: [28, 28], iconAnchor: [14, 14] }),
          zIndexOffset: 1500,
          keyboard: true,
          title: label
        });
      } else {
        marker = L.circleMarker([lat, lon], {
          radius: place.kind === 'lived' ? 7.5 : 6,
          color: '#fff',
          weight: place.kind === 'lived' ? 2 : 1.5,
          fillColor: color,
          fillOpacity: .95
        });
      }

      var photoUrl = '/photos/?place=' + encodeURIComponent(place.name || '');
      marker.bindTooltip(label, { direction: 'top' });
      marker.bindPopup('<strong>' + escapeHtml(label) + '</strong><br><a href="' + photoUrl + '">Explore related photos</a>');
      marker.addTo(map);
      markerByName.set(normalizeText(place.name), marker);
      bounds.push([lat, lon]);
    });

    if (bounds.length === 1) map.setView(bounds[0], 8);
    else map.fitBounds(bounds, { padding: [20, 20] });

    entries.forEach(function(entry) {
      var button = entry.querySelector('.place-focus');
      if (!button) return;
      button.addEventListener('click', function() {
        var marker = markerByName.get(normalizeText(button.dataset.placeName));
        if (!marker) return;
        var target = marker.getLatLng();
        var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) map.setView(target, Math.max(map.getZoom(), 6));
        else map.flyTo(target, Math.max(map.getZoom(), 6), { duration: .65 });
        marker.openPopup();
        el.focus({ preventScroll: true });
      });
    });

    var hint = document.getElementById('placesMapHint');
    function enableScrollZoom() {
      map.scrollWheelZoom.enable();
      if (hint) hint.textContent = 'Map zoom enabled · press Escape to release.';
    }
    function disableScrollZoom() {
      map.scrollWheelZoom.disable();
      if (hint) hint.textContent = 'Select the map before zooming.';
    }

    el.addEventListener('click', enableScrollZoom, { once: true });
    el.addEventListener('focusin', enableScrollZoom);
    el.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        disableScrollZoom();
        el.blur();
      }
    });

    document.addEventListener('theme:change', function(event) {
      var next = event && event.detail ? event.detail : 'light';
      map.removeLayer(currentTiles);
      currentTiles = next === 'dark' ? darkTiles : lightTiles;
      currentTiles.addTo(map);
    });
  });
})();
