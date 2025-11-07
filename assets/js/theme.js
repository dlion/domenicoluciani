(function() {
  const root = document.documentElement;

  function getCSSValue(name) {
    try { return (window.getComputedStyle(root).getPropertyValue(name) || '').trim(); }
    catch (e) { return ''; }
  }

  function setThemeColor(finalColor) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return true;
    const bg = getCSSValue('--bg');
    if (bg) meta.setAttribute('content', bg);
    const text = getCSSValue('--text');
    if (bg) root.style.backgroundColor = bg;
    if (text) root.style.color = text;
    root.style.colorScheme = finalColor;
    return true;
  }

  function applyTheme(isDark, persist) {
    var finalColor = isDark ? 'dark' : 'light'
    root.setAttribute('data-theme', finalColor);
    setThemeColor(finalColor);
    if (persist) { try { localStorage.setItem('appearance', finalColor); } catch {} }
    try { document.dispatchEvent(new CustomEvent('theme:change', { detail: finalColor })); } catch {}
  }

  var stored = null;
  try { stored = localStorage.getItem('appearance') || localStorage.getItem('theme'); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(theme == 'dark', false);

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        applyTheme(root.getAttribute('data-theme') !== 'dark', true);
      });
    }
  }, { once: true });
})();

