import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'public');
const vite = await createServer({ root, mode: 'production', server: { middlewareMode: true, hmr: false, ws: false }, logLevel: 'error' });

try {
  const { createSitemap, createRobots, sitemapPaths } = await vite.ssrLoadModule('/src/seo/sitemap.js');
  await mkdir(output, { recursive: true });
  await writeFile(resolve(output, 'sitemap.xml'), createSitemap());
  await writeFile(resolve(output, 'robots.txt'), createRobots());
  console.log(`Generated public/sitemap.xml with ${sitemapPaths.length} URLs and public/robots.txt.`);
} finally {
  await vite.close();
}
