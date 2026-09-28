import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createServer } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const template = await readFile(resolve(output, 'index.html'), 'utf8');
const vite = await createServer({ root, mode: 'production', server: { middlewareMode: true, hmr: false, ws: false }, logLevel: 'error' });

try {
  const { blogPosts } = await vite.ssrLoadModule('/src/data/blogPosts.js');
  const { getBlogSeo } = await vite.ssrLoadModule('/src/seo/blogSeo.js');
  const { replaceHtmlMetadata } = await vite.ssrLoadModule('/src/seo/headMetadata.js');
  const { default: Blog } = await vite.ssrLoadModule('/src/pages/Blog.jsx');
  const { default: BlogDetail } = await vite.ssrLoadModule('/src/pages/BlogDetail.jsx');
  const { default: Header } = await vite.ssrLoadModule('/src/components/Header.jsx');
  const { default: Footer } = await vite.ssrLoadModule('/src/components/Footer.jsx');
  const routes = [{ pathname: '/blog', post: undefined }, ...blogPosts.map(post => ({ pathname: `/blog/${post.id}`, post }))];
  assert.equal(new Set(routes.map(route => route.pathname)).size, routes.length, 'Duplicate journal route');
  for (const post of blogPosts) assert.match(post.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Article IDs must be safe route slugs');

  for (const { pathname, post } of routes) {
    // Render a small browser-independent shell. main.jsx intentionally mounts
    // the interactive app with createRoot rather than hydrating this snapshot:
    // local bag contents and motion preferences can differ from build-time state.
    const markup = renderToString(createElement(MemoryRouter, { initialEntries: [pathname] },
      createElement('div', { className: 'app' },
        createElement(Header, { cartCount: 0 }),
        createElement('main', { className: 'main-content' },
          createElement(Routes, null,
            createElement(Route, { path: '/blog', element: createElement(Blog) }),
            createElement(Route, { path: '/blog/:id', element: createElement(BlogDetail) }),
          ),
        ),
        createElement(Footer),
      ),
    ));
    assert.ok(template.includes('<div id="root"></div>'), 'The build HTML root placeholder changed');
    const html = replaceHtmlMetadata(template, getBlogSeo({ post })).replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
    const directory = resolve(output, pathname.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, 'index.html'), html);
  }

  console.log(`Pre-rendered the journal and ${blogPosts.length} articles with page metadata.`);
} finally {
  await vite.close();
}
