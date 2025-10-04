<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:rss="http://purl.org/rss/1.0/" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" />

  <xsl:template match="/rss">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          <xsl:value-of select="channel/title" /> — RSS
        </title>
        <style>
          /* Minimal, standalone light theme to match the site */
          :root {
            --bg: #ffffff;
            --text: #0f172a;        /* slate-900 */
            --muted: #64748b;       /* slate-500 */
            --border: #e5e7eb;      /* gray-200 */
            --surface-1: #f8fafc;   /* slate-50 */
            --link: #2563eb;        /* blue-600 */
          }
          * { box-sizing: border-box; }
          html { color-scheme: light; }
          body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
            line-height: 1.6;
          }
          a { color: var(--link); }
          .rss-wrap { max-width: 920px; margin: 28px auto; padding: 0 18px 36px; }
          .rss-header { display:flex; align-items:baseline; justify-content:space-between; gap:10px; margin-bottom: 10px; }
          .rss-header h1 { margin:0; font-size: 1.8rem; letter-spacing: -0.01em; }
          .rss-sub { color: var(--muted); text-decoration: none; }
          .rss-note { margin: 6px 0 18px; color: var(--muted); }
          .rss-list { list-style:none; padding:0; margin:18px 0 0; display:grid; gap:14px; }
          .rss-intro { margin: 6px 0 14px; }
          .rss-intro .lead { margin: 0 0 4px; font-weight: 600; }
          .rss-intro .subs { margin: 0; color: var(--muted); }
          .rss-item {
            border: 1px solid var(--border);
            border-radius: 14px;
            background: var(--surface-1);
            padding: 14px 14px 12px;
            box-shadow: 0 10px 26px rgba(15,23,42,.06);
          }
          .rss-item a { color: var(--link); text-decoration: none; }
          .rss-item a:hover { text-decoration: underline; }
          .rss-item h2 { margin:0 0 6px; font-size:1.15rem; line-height:1.35; }
          .rss-item .meta { color: var(--muted); font-size:.92rem; }
          .rss-item p { margin: 8px 0 0; }
        </style>
      </head>
      <body>
        <main class="rss-wrap">
          <header class="rss-header">
            <h1><xsl:value-of select="channel/title" /></h1>
          </header>
          <p class="rss-note"><xsl:value-of select="channel/description" /></p>
          <xsl:variable name="self" select="channel/atom:link/@href"/>
          <section class="rss-intro">
            <p class="lead">This RSS feed for the Domenico Luciani website.</p>
            <p class="subs">You can subscribe this RSS feed by
              <a href="https://feedly.com/i/subscription/feed/{$self}">Feedly</a>,
              <a href="https://www.inoreader.com/feed/{$self}">Inoreader</a>,
              <a href="https://www.newsblur.com/?url={$self}">NewsBlur</a>,
              <a href="https://follow.it/">Follow</a>,
              <a href="{$self}">RSS Reader</a> or
              <a href="{$self}">View Source</a>.
            </p>
          </section>
          <ul class="rss-list">
            <xsl:for-each select="channel/item">
              <li class="rss-item">
                <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
                <div class="meta"><xsl:value-of select="pubDate" /></div>
                <p><xsl:value-of select="description" /></p>
              </li>
            </xsl:for-each>
          </ul>
        </main>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
