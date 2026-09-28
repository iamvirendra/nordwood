import { blogPosts } from '../data/blogPosts';
import { getProductFamilies } from '../data/catalog';
import { absoluteSiteUrl } from './siteConfig';

// /about currently renders Home, /cart is transactional, and shop filters/hash
// anchors are alternate views rather than additional sitemap destinations.
// Match ProductCard links: one preferred URL per family, with sizes selectable
// on that page instead of listing near-identical size variants separately.
export const sitemapPaths = [
  '/',
  '/shop',
  '/contact',
  '/blog',
  ...blogPosts.map(post => `/blog/${encodeURIComponent(post.id)}`),
  ...getProductFamilies().map(product => `/product/${encodeURIComponent(product.id)}`),
];

const escapeXml = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[character]);

export function createSitemap() {
  if (new Set(sitemapPaths).size !== sitemapPaths.length) throw new Error('Duplicate sitemap destination');
  const entries = sitemapPaths.map(pathname => `  <url>\n    <loc>${escapeXml(absoluteSiteUrl(pathname))}</loc>\n  </url>`);
  // Last-modified dates are omitted until genuine per-page dates are available.
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}

export function createRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteSiteUrl('/sitemap.xml')}\n`;
}
