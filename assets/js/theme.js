// Appearance logic adapted from the referenced site, wired to this theme.
(function() {
  const root = document.documentElement;
  const sitePreference = root.getAttribute('data-default-appearance') || 'light';
  let userPreference = null;
  try { userPreference = localStorage.getItem('appearance'); } catch (e) {}

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

  function applyClass(isDark) {
    root.classList.toggle('dark', isDark);
    // Keep data-theme to drive our CSS variables
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    setThemeColor();
  }

  // Initial preference
  if ((sitePreference === 'dark' && userPreference === null) || userPreference === 'dark') {
    applyClass(true);
  }

  // Auto appearance from OS preference
  if (root.getAttribute('data-auto-appearance') === 'true') {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && mq.matches && userPreference !== 'light') {
      applyClass(true);
    }
    if (mq && mq.addEventListener) mq.addEventListener('change', (e) => applyClass(e.matches));
    else if (mq && mq.addListener) mq.addListener((e) => applyClass(e.matches));
  }

  function init() {
    setThemeColor();
    const toggles = document.querySelectorAll('#themeToggle, [id^="appearance-switcher"]');
    toggles.forEach((el) => {
      el.addEventListener('click', () => {
        const nextIsDark = !root.classList.contains('dark');
        applyClass(nextIsDark);
        try { localStorage.setItem('appearance', nextIsDark ? 'dark' : 'light'); } catch (e) {}
      });
      el.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();
        try { localStorage.removeItem('appearance'); } catch (e) {}
      });
    });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
