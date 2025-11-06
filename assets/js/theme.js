// Theme management (no-flash, full-document repaint, OS sync)
(function() {
  var KEY = 'theme';
  var DARK_BG = '#111726';
  var DARK_TEXT = '#e5eaf6';
  var LIGHT_BG = '#ffffff';
  var LIGHT_TEXT = '#111827';

  function currentTheme() {
    return (document.documentElement.getAttribute('data-theme') === 'dark') ? 'dark' : 'light';
  }

  function setMetaThemeColorFromCSS() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    try {
      var rootStyles = window.getComputedStyle(document.documentElement);
      var bg = rootStyles.getPropertyValue('--bg');
      bg = (bg || '').trim();
      if (bg) meta.setAttribute('content', bg);
    } catch (e) {}
  }

  function applyTheme(theme, persist) {
    var root = document.documentElement;
    var isDark = (theme === 'dark');
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    // Also mirror a utility class many themes expect
    root.classList.toggle('dark', isDark);

    // Paint immediately to avoid partial updates on long pages/Safari
    root.style.backgroundColor = isDark ? DARK_BG : LIGHT_BG;
    root.style.color = isDark ? DARK_TEXT : LIGHT_TEXT;
    // Hint UA controls (scrollbars, form controls)
    root.style.colorScheme = isDark ? 'dark' : 'light';

    // Force a layout flush to ensure the new paint is applied across the page
    // (addresses cases where offscreen areas keep the old background until scrolled)
    // eslint-disable-next-line no-unused-expressions
    root.offsetHeight;

    // Nudge composited elements (e.g., sticky header with backdrop-filter) to recompose
    var header = document.querySelector('.site-header');
    if (header) {
      try {
        header.style.backdropFilter = 'blur(6.001px)';
        // flush
        // eslint-disable-next-line no-unused-expressions
        header.offsetHeight;
      } catch (e) {}
      // Remove inline tweak to respect CSS
      header.style.backdropFilter = '';
    }

    if (persist) {
      try { localStorage.setItem(KEY, isDark ? 'dark' : 'light'); } catch(e) {}
    }

    try {
      document.dispatchEvent(new CustomEvent('theme:change', { detail: isDark ? 'dark' : 'light' }));
    } catch (e) {}

    // Update meta theme-color to better match the page background
    setMetaThemeColorFromCSS();
  }

  function preferredTheme() {
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function init() {
    // Apply immediately using preference (keeps in sync with early inline script)
    applyTheme(preferredTheme(), false);
    setMetaThemeColorFromCSS();

    // OS preference sync (only when there is no explicit stored choice)
    var hasStored = false;
    try { hasStored = !!localStorage.getItem(KEY); } catch(e) {}
    if (!hasStored && window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function(ev) { applyTheme(ev.matches ? 'dark' : 'light', false); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }

    // Wire the toggle button
    var btn = document.getElementById('themeToggle');
    if (btn) {
      var setLabel = function() {
        var cur = currentTheme();
        btn.setAttribute('aria-label', cur === 'dark' ? 'Switch to light' : 'Switch to dark');
      };
      btn.addEventListener('click', function() {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
        setLabel();
      });
      setLabel();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
