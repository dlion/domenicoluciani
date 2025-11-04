// Minimal same-origin prefetch for nav links
(function() {
  try {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || (conn.effectiveType && /2g/i.test(conn.effectiveType)))) {
      return; // respect data saver / slow connections
    }
  } catch (e) {}

  var prefetched = new Set();
  var head = document.head || document.getElementsByTagName('head')[0];

  function isSameOrigin(href) {
    try { return new URL(href, location.href).origin === location.origin; }
    catch (e) { return false; }
  }

  function prefetch(href) {
    if (!href || prefetched.has(href) || !isSameOrigin(href)) return;
    prefetched.add(href);
    // Try rel=prefetch
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = 'document';
    head.appendChild(link);
    // Fallback fetch warms cache on browsers that ignore prefetch for documents
    try { fetch(href, { credentials: 'same-origin', mode: 'no-cors' }); } catch (e) {}
  }

  function wire(el) {
    if (!el || !el.href || !isSameOrigin(el.href)) return;
    el.addEventListener('pointerenter', function() { prefetch(el.href); }, { passive: true });
    el.addEventListener('touchstart', function() { prefetch(el.href); }, { passive: true });
  }

  function idlePrefetchNav() {
    var navLinks = document.querySelectorAll('.site-nav a[href]');
    navLinks.forEach(function(a){ prefetch(a.href); });
  }

  function init() {
    document.querySelectorAll('a[href]').forEach(wire);
    if ('requestIdleCallback' in window) {
      requestIdleCallback(idlePrefetchNav, { timeout: 2000 });
    } else {
      setTimeout(idlePrefetchNav, 1200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

