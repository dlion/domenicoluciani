// Appearance logic adapted from the referenced site, wired to this theme.
(function() {
  const root = document.documentElement;
  // We rely on inline bootstrap for initial paint; no need to recompute here.

  function getCSSValue(name) {
    try { return (window.getComputedStyle(root).getPropertyValue(name) || '').trim(); }
    catch (e) { return ''; }
  }

  function setThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return true;
    const bg = getCSSValue('--bg');
    if (bg) meta.setAttribute('content', bg);
    return true;
  }

  function applyTheme(isDark, persist) {
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    // Keep UA chrome color and any inline-first-paint styles in sync
    setThemeColor();
    try {
      const bg = getCSSValue('--bg');
      const text = getCSSValue('--text');
      if (bg) root.style.backgroundColor = bg;
      if (text) root.style.color = text;
      root.style.colorScheme = isDark ? 'dark' : 'light';
    } catch {}
    if (persist) { try { localStorage.setItem('appearance', isDark ? 'dark' : 'light'); } catch {} }
    try { document.dispatchEvent(new CustomEvent('theme:change', { detail: isDark ? 'dark' : 'light' })); } catch {}
  }

  // Auto appearance from OS preference only when user has not set an explicit choice
  const hasUserPref = (() => { try { return localStorage.getItem('appearance') != null; } catch { return false; } })();
  if (!hasUserPref) {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && mq.addEventListener) mq.addEventListener('change', (e) => applyTheme(e.matches, false));
    else if (mq && mq.addListener) mq.addListener((e) => applyTheme(e.matches, false));
  }

  function init() {
    setThemeColor();
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const nextIsDark = root.getAttribute('data-theme') !== 'dark';
        applyTheme(nextIsDark, true);
      });
    }
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
