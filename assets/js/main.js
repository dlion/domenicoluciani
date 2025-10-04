// Optional: add anchor links to headings and smooth-scroll on hash links
(function () {
  const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4');
  headings.forEach(function (h) {
    if (!h.textContent.trim()) return;
    if (!h.id) {
      h.id = h.textContent.trim().toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (h.querySelector('.heading-anchor')) return;

    const anchor = document.createElement('a');
    anchor.href = '#' + h.id;
    anchor.className = 'heading-anchor';
    anchor.setAttribute('aria-label', 'Copy link to "' + h.textContent.trim() + '"');
    anchor.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13.44 2.56a3.75 3.75 0 0 1 5.3 5.3l-2.12 2.12a.75.75 0 1 1-1.06-1.06l2.12-2.12a2.25 2.25 0 1 0-3.18-3.18l-2.12 2.12a.75.75 0 1 1-1.06-1.06l2.12-2.12Zm-6.88 6.88a.75.75 0 0 1 1.06 0l2.12 2.12a.75.75 0 0 1-1.06 1.06L6.56 10.5a.75.75 0 0 1 0-1.06Zm-1.06 1.06a.75.75 0 0 1 0 1.06l-2.12 2.12a2.25 2.25 0 1 0 3.18 3.18l2.12-2.12a.75.75 0 1 1 1.06 1.06l-2.12 2.12a3.75 3.75 0 1 1-5.3-5.3l2.12-2.12Zm8.25-2.12a.75.75 0 0 1 1.06 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06l5.25-5.25Z"/></svg>';

    h.classList.add('has-anchor');
    h.appendChild(anchor);

    h.addEventListener('click', function (event) {
      if (event.target.closest('.heading-anchor')) return;
      if (window.getSelection && window.getSelection().toString()) return;
      anchor.click();
    });
  });

  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', '#' + id);
    }
  });

  const prettifyLang = function (lang) {
    if (!lang) return '';
    const normalized = lang.toLowerCase();
    const map = {
      js: 'JS', javascript: 'JS', jsx: 'JSX',
      ts: 'TS', typescript: 'TS', tsx: 'TSX',
      go: 'Go', golang: 'Go',
      py: 'Python', python: 'Python',
      rb: 'Ruby', ruby: 'Ruby',
      rs: 'Rust', rust: 'Rust',
      java: 'Java', kotlin: 'Kotlin', swift: 'Swift',
      php: 'PHP',
      c: 'C', cpp: 'C++', cxx: 'C++', 'c++': 'C++',
      cs: 'C#', csharp: 'C#', 'c#': 'C#',
      objc: 'Obj-C', objectivec: 'Obj-C',
      scala: 'Scala',
      bash: 'Bash', sh: 'Shell', shell: 'Shell', zsh: 'Zsh', fish: 'Fish',
      sql: 'SQL', yaml: 'YAML', yml: 'YAML', json: 'JSON', toml: 'TOML', ini: 'INI',
      dockerfile: 'Docker', make: 'Make', makefile: 'Make',
      diff: 'Diff', html: 'HTML', xml: 'XML', css: 'CSS', scss: 'SCSS', sass: 'Sass',
      plaintext: 'Text', text: 'Text'
    };
    if (map[normalized]) return map[normalized];
    return normalized.replace(/\b\w/g, function (ch) {
      return ch.toUpperCase();
    }).replace(/-/g, ' ');
  };

  document.querySelectorAll('.highlighter-rouge').forEach(function (block) {
    const pre = block.querySelector('pre');
    let match = pre && pre.className && pre.className.match(/language-([\w#+-]+)/i);
    if (!match && block.className) {
      match = block.className.match(/language-([\w#+-]+)/i);
    }
    const langName = match && match[1] ? prettifyLang(match[1]) : '';
    if (langName) {
      block.setAttribute('data-lang', langName);
    }

    if (block.dataset.toolbar === 'ready') return;

    const highlight = block.querySelector('.highlight');
    if (!highlight) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';

    const meta = document.createElement('div');
    meta.className = 'code-meta';

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'code-toggle';
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.setAttribute('aria-label', 'Collapse code');
    toggleButton.innerHTML = '<svg viewBox="0 0 12 8" aria-hidden="true"><polyline points="1 1 6 7 11 1"></polyline></svg>';

    const langLabel = document.createElement('span');
    langLabel.className = 'code-lang';
    langLabel.textContent = langName || 'Code';

    meta.appendChild(toggleButton);
    meta.appendChild(langLabel);

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'code-copy';
    copyButton.dataset.label = 'Copy';
    copyButton.setAttribute('aria-label', 'Copy code');

    const copyIconWrapper = document.createElement('span');
    copyIconWrapper.className = 'code-copy-icon';
    copyIconWrapper.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="9" height="9" rx="2"></rect><path d="M4 13V5a2 2 0 0 1 2-2h8"/></svg>';

    const copySrText = document.createElement('span');
    copySrText.className = 'visually-hidden';
    copySrText.textContent = 'Copy code';

    copyButton.appendChild(copyIconWrapper);
    copyButton.appendChild(copySrText);

    toolbar.appendChild(meta);
    toolbar.appendChild(copyButton);

    block.insertBefore(toolbar, highlight);

    const updateCollapsedState = function (collapsed) {
      block.classList.toggle('is-collapsed', collapsed);
      toggleButton.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggleButton.setAttribute('aria-label', collapsed ? 'Expand code' : 'Collapse code');
      if (highlight) {
        highlight.setAttribute('aria-hidden', collapsed ? 'true' : 'false');
      }
    };

    updateCollapsedState(false);

    const resetCopyState = function () {
      copyButton.dataset.label = 'Copy';
      copyButton.classList.remove('copied');
      copyButton.setAttribute('aria-label', 'Copy code');
    };

    copyButton.addEventListener('click', function () {
      const codeElement = block.querySelector('.rouge-code pre code') || block.querySelector('.rouge-code pre');
      if (!codeElement) return;
      const text = codeElement.innerText;
      const finish = function (success) {
        if (!success) return;
        copyButton.dataset.label = 'Copied';
        copyButton.classList.add('copied');
        copyButton.setAttribute('aria-label', 'Code copied');
        setTimeout(resetCopyState, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          finish(true);
        }).catch(function () {
          finish(false);
        });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        const selected = document.getSelection && document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : null;
        textarea.select();
        try {
          const successful = document.execCommand('copy');
          finish(successful);
        } catch (err) {
          finish(false);
        }
        document.body.removeChild(textarea);
        if (selected) {
          const selection = document.getSelection();
          selection.removeAllRanges();
          selection.addRange(selected);
        }
      }
    });

    toggleButton.addEventListener('click', function () {
      const collapsed = block.classList.contains('is-collapsed');
      updateCollapsedState(!collapsed);
    });

    block.dataset.toolbar = 'ready';
  });

  var collectMermaidSources = function () {
    document.querySelectorAll('pre code.language-mermaid, code.language-mermaid').forEach(function (code) {
      var source = code.textContent.trim();
      if (!source) return;
      var container = document.createElement('div');
      container.className = 'mermaid';
      container.dataset.diagram = source;
      container.textContent = source;
      var pre = code.closest('pre');
      if (pre && typeof pre.replaceWith === 'function') {
        pre.replaceWith(container);
      } else if (code.parentNode) {
        code.parentNode.replaceChild(container, code);
      }
    });
  };

  var mermaidConfigFor = function (themeName) {
    var isDark = (themeName === 'dark');
    // Amber accent that works on both themes
    var amber500 = '#f59e0b';
    var amber400 = '#fbbf24';
    var amber300 = '#fcd34d';
    var textDark = '#e5e7eb';
    var textLight = '#111827';
    return {
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', 'Helvetica Neue', Arial",
        primaryColor: isDark ? '#1f2937' : '#fff7ed',
        secondaryColor: isDark ? '#111827' : '#fffbeb',
        tertiaryColor: isDark ? '#1f2937' : '#fef3c7',
        primaryTextColor: isDark ? textDark : textLight,
        lineColor: amber400,
        primaryBorderColor: amber500,
        clusterBkg: isDark ? '#111827' : '#fff7ed',
        clusterBorder: amber500,
        edgeLabelBackground: isDark ? '#334155' : '#fde68a',
        noteBkgColor: isDark ? '#374151' : '#fff7ed',
        noteBorderColor: amber500,
        activationBkgColor: isDark ? '#1f2937' : '#fff7ed',
        activationBorderColor: amber500
      }
    };
  };

  var renderMermaid = function (themeOverride) {
    if (typeof window.mermaid === 'undefined') return;
    collectMermaidSources();
    var containers = document.querySelectorAll('.mermaid');
    if (!containers.length) return;
    var themeName = themeOverride || (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    window.mermaid.initialize(mermaidConfigFor(themeName));
    containers.forEach(function (el) {
      var diagram = el.dataset.diagram || el.textContent.trim();
      if (!diagram) return;
      // Allow re-render on theme change
      el.removeAttribute('data-processed');
      el.textContent = diagram;
    });
    try {
      window.mermaid.run({ nodes: containers });
    } catch (err) {
      console.error('Mermaid render failed', err);
    }
  };

  renderMermaid();
  document.addEventListener('theme:change', function (event) {
    var nextTheme = event && event.detail ? event.detail : null;
    renderMermaid(nextTheme);
  });

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', header.classList.contains('open') ? 'true' : 'false');
    });
    header.querySelectorAll('.site-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Tags page enhancements: chip-driven filtering (+ support for query param t and hash)
  (function() {
    var page = document.querySelector('.tags-page');
    if (!page) return;
    var chips = Array.prototype.slice.call(document.querySelectorAll('.tag-chip'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('.tag-section'));

    function setActive(slug) {
      chips.forEach(function(c){ c.classList.toggle('is-active', c.dataset.tag === slug || (slug==='all' && c.dataset.tag==='all')); });
    }
    function showOnly(slug) {
      if (!slug || slug === 'all') {
        sections.forEach(function(sec){ sec.style.display = ''; });
        setActive('all');
        return;
      }
      sections.forEach(function(sec){ sec.style.display = (sec.dataset.tag === slug) ? '' : 'none'; });
      setActive(slug);
      // Scroll to visible section with slight offset
      var target = document.getElementById(slug);
      if (target) {
        var y = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }

    function getParam(name){
      var m = new URLSearchParams(window.location.search).get(name);
      return m ? m.toString() : null;
    }

    chips.forEach(function(chip){
      chip.addEventListener('click', function(e){
        var slug = chip.dataset.tag;
        showOnly(slug);
        if (history && history.replaceState) {
          var url = new URL(window.location.href);
          if (slug === 'all') { url.searchParams.delete('t'); }
          else { url.searchParams.set('t', slug); }
          history.replaceState(null, '', url.toString());
        }
        e.preventDefault();
      });
    });

    // Initial state: ?t=slug or #slug fallback
    var init = getParam('t') || (location.hash ? location.hash.slice(1) : 'all');
    showOnly(init);
  })();

})();
