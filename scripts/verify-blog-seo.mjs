import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const vite = await createServer({ root, mode: 'production', server: { middlewareMode: true, hmr: false, ws: false }, logLevel: 'error' });
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };
const decodeHtml = value => value.replace(/&(?:amp|lt|gt|quot|#39|#x27);/g, entity => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'" })[entity]);

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match ? decodeHtml(match[1]) : undefined;
}

function oneMeta(head, kind, value, route) {
  const tags = [...head.matchAll(/<meta\b[^>]*>/gi)].map(match => match[0]).filter(tag => attribute(tag, kind) === value);
  check(tags.length === 1, `${route}: expected exactly one ${value} meta tag`);
  return attribute(tags[0], 'content');
}

// A minimal DOM contract tests replacement/removal without adding a browser or
// test dependency. Native rendering and React effect timing are separate checks.
function mockHeadDocument() {
  const nodes = [];
  const head = {
    querySelectorAll: () => [...nodes],
    appendChild(fragment) { nodes.push(...fragment.nodes); },
  };
  return {
    head,
    nodes,
    createDocumentFragment: () => ({ nodes: [], appendChild(element) { this.nodes.push(element); } }),
    createElement: tag => ({
      tag, attributes: {}, textContent: '',
      setAttribute(name, value) { this.attributes[name] = value; },
      remove() { const index = nodes.indexOf(this); if (index !== -1) nodes.splice(index, 1); },
    }),
  };
}

try {
  const { blogPosts } = await vite.ssrLoadModule('/src/data/blogPosts.js');
  const { products } = await vite.ssrLoadModule('/src/data/products.js');
  const { getProductFamilies, getProductFamilyById } = await vite.ssrLoadModule('/src/data/catalog.js');
  const { defaultSeo, getBlogSeo } = await vite.ssrLoadModule('/src/seo/blogSeo.js');
  const { absoluteSiteUrl, siteOrigin } = await vite.ssrLoadModule('/src/seo/siteConfig.js');
  const { applyHeadMetadata, serializeJsonLd } = await vite.ssrLoadModule('/src/seo/headMetadata.js');
  const routes = [{ pathname: '/blog' }, ...blogPosts.map(post => ({ pathname: `/blog/${post.id}`, post }))];
  const titles = new Set();
  const descriptions = new Set();
  const rootHtml = await readFile(resolve(output, 'index.html'), 'utf8');
  check(rootHtml.includes(defaultSeo.title), 'Root HTML retains the baseline site title');
  check(!rootHtml.includes('rel="canonical"') && !rootHtml.includes('application/ld+json'), 'Root HTML does not inherit article canonical or schema');
  const stylesheet = [...rootHtml.matchAll(/<link\b[^>]*>/gi)].map(match => match[0]).find(tag => attribute(tag, 'rel') === 'stylesheet');
  check(Boolean(stylesheet), 'The production HTML has an attached stylesheet');
  const stylesheetUrl = attribute(stylesheet, 'href');
  const css = await readFile(resolve(output, stylesheetUrl.slice(1)), 'utf8');
  for (const selector of ['.blog-detail', '.blog-card', '.blog-carousel', '.header', '.footer']) check(css.includes(selector), `Built stylesheet includes ${selector}`);

  for (const { pathname, post } of routes) {
    const html = await readFile(resolve(output, pathname.slice(1), 'index.html'), 'utf8');
    const head = html.split('</head>')[0];
    const expected = getBlogSeo({ post });
    check(head.includes(stylesheetUrl), `${pathname}: initial HTML retains the production stylesheet`);
    check([...html.matchAll(/<h1\b/gi)].length === 1, `${pathname}: initial HTML has one H1`);
    const titleTags = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
    check(titleTags.length === 1, `${pathname}: exactly one document title`);
    const title = decodeHtml(titleTags[0][1]);
    check(title === expected.title, `${pathname}: title matches article metadata`);
    check(!titles.has(title), `${pathname}: duplicate document title`);
    titles.add(title);
    const description = oneMeta(head, 'name', 'description', pathname);
    check(description === expected.description, `${pathname}: description matches article metadata`);
    check(!descriptions.has(description), `${pathname}: duplicate description`);
    descriptions.add(description);
    const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)].map(match => match[0]).filter(tag => attribute(tag, 'rel') === 'canonical');
    check(canonicals.length === 1 && attribute(canonicals[0], 'href') === expected.canonical, `${pathname}: one correct absolute canonical`);
    check(oneMeta(head, 'property', 'og:url', pathname) === expected.canonical, `${pathname}: social URL matches canonical`);
    check(oneMeta(head, 'property', 'og:title', pathname) === expected.title, `${pathname}: social title matches`);
    check(oneMeta(head, 'property', 'og:description', pathname) === expected.description, `${pathname}: social description matches`);
    check(oneMeta(head, 'property', 'og:type', pathname) === (post ? 'article' : 'website'), `${pathname}: appropriate social type`);
    check(oneMeta(head, 'name', 'twitter:card', pathname) === 'summary_large_image', `${pathname}: large-image social card`);
    check(oneMeta(head, 'name', 'twitter:title', pathname) === expected.title, `${pathname}: Twitter title matches`);
    const imageUrl = oneMeta(head, 'property', 'og:image', pathname);
    check(imageUrl === expected.image && new URL(imageUrl).origin === siteOrigin, `${pathname}: absolute local social image`);
    check(oneMeta(head, 'name', 'twitter:image', pathname) === imageUrl, `${pathname}: social images agree`);
    check((await stat(resolve(root, 'public', new URL(imageUrl).pathname.slice(1)))).size > 0, `${pathname}: social image file exists`);
    check(!/name="robots"[^>]*content="[^"]*noindex/.test(head), `${pathname}: valid article is indexable`);
    check(!head.includes('docs.google.com'), `${pathname}: private source-document links excluded from metadata`);
    const schemas = [...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    check(schemas.length === 1, `${pathname}: one structured-data block`);
    const graph = JSON.parse(schemas[0][1]);
    const breadcrumb = graph.find(item => item['@type'] === 'BreadcrumbList');
    check(breadcrumb?.itemListElement.at(-1).item === expected.canonical, `${pathname}: breadcrumb resolves to current page`);
    const article = graph.find(item => item['@type'] === 'BlogPosting');
    if (post) {
      check(article?.headline === post.title && article.mainEntityOfPage['@id'] === expected.canonical, `${pathname}: article schema matches visible story`);
      check(!article.datePublished && !article.dateModified, `${pathname}: no invented publication dates`);
      check(!article.author, `${pathname}: no author is inferred from the publisher`);
      const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
      check(h1s.length === 1 && decodeHtml(h1s[0][1]) === post.title, `${pathname}: initial HTML contains one matching H1`);
      check(html.includes('<article') && html.includes('class="blog-detail__copy"'), `${pathname}: full article markup is present without JavaScript`);
      if (post.paragraphs?.[0]) check(decodeHtml(html).includes(post.paragraphs[0]), `${pathname}: initial HTML includes article prose`);
    } else {
      check(!article, 'Listing must not pretend to be an article');
      for (const story of blogPosts) check(html.includes(`href="/blog/${story.id}"`), `Listing links to ${story.id} without JavaScript`);
    }
    check(/<script\b[^>]*type="module"[^>]*src="\/assets\//.test(html), `${pathname}: interactive app bundle remains attached`);
  }

  const sitemap = await readFile(resolve(output, 'sitemap.xml'), 'utf8');
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decodeHtml(match[1]));
  check(locations.length === new Set(locations).size, 'Sitemap URLs are unique');
  const families = getProductFamilies();
  const expectedPaths = ['/', '/shop', '/contact', ...routes.map(item => item.pathname), ...families.map(product => `/product/${product.id}`)];
  check(locations.length === expectedPaths.length, 'Sitemap covers public pages, articles and one preferred URL per product family');
  for (const route of expectedPaths) check(locations.includes(absoluteSiteUrl(route)), `Sitemap includes ${route}`);
  for (const product of products) {
    const family = getProductFamilyById(product.id);
    check(family && locations.includes(absoluteSiteUrl(`/product/${family.id}`)), `Product variant ${product.id} has its catalogue family represented`);
  }
  check(locations.every(value => { const url = new URL(value); return url.origin === siteOrigin && !url.search && !url.hash; }), 'Sitemap has only absolute site URLs without filter queries or fragments');
  check(!locations.some(value => ['/cart', '/about'].includes(new URL(value).pathname)), 'Sitemap excludes transactional cart and duplicate home alias');
  check(sitemap === await readFile(resolve(root, 'public/sitemap.xml'), 'utf8'), 'Build serves the current generated public sitemap');
  check(!sitemap.includes('<lastmod>'), 'Sitemap does not invent modification dates');
  const robots = await readFile(resolve(output, 'robots.txt'), 'utf8');
  check(robots.includes('Allow: /') && robots.includes(`Sitemap: ${absoluteSiteUrl('/sitemap.xml')}`), 'Robots permits crawl and names the sitemap');
  check(robots === await readFile(resolve(root, 'public/robots.txt'), 'utf8'), 'Build serves the current generated public robots file');

  const maliciousText = '</script><script>alert("x")</script>&\u2028';
  const serialized = serializeJsonLd({ headline: maliciousText });
  check(!serialized.includes('<') && JSON.parse(serialized).headline === maliciousText, 'JSON-LD safely round-trips script delimiters and unicode');
  const documentMock = mockHeadDocument();
  applyHeadMetadata(getBlogSeo({ post: blogPosts[0] }), documentMock);
  applyHeadMetadata(getBlogSeo({ post: blogPosts.at(-1) }), documentMock);
  check(documentMock.nodes.filter(node => node.tag === 'title').length === 1, 'Article navigation replaces the document title');
  check(documentMock.nodes.filter(node => node.attributes.rel === 'canonical').length === 1, 'Article navigation leaves one canonical');
  check(documentMock.nodes.find(node => node.attributes.rel === 'canonical').attributes.href.endsWith(blogPosts.at(-1).id), 'Article navigation changes canonical to the selected article');
  applyHeadMetadata(getBlogSeo({ notFound: true }), documentMock);
  check(documentMock.nodes.some(node => node.attributes.name === 'robots' && node.attributes.content === 'noindex, follow'), 'Missing articles receive noindex');
  check(!documentMock.nodes.some(node => node.attributes.rel === 'canonical' || node.tag === 'script'), 'Missing articles remove canonical and article schema');
  applyHeadMetadata(defaultSeo, documentMock);
  check(documentMock.nodes.length === 2 && documentMock.nodes[0].textContent === defaultSeo.title, 'Leaving the journal restores only baseline title and description');
  check(!documentMock.nodes.some(node => node.attributes.name === 'robots'), 'Noindex does not leak to another route');
  console.log(`Verified ${routes.length} pre-rendered journal pages, metadata/schema, sitemap, safe JSON-LD and head replacement (${checks} checks).`);
} finally {
  await vite.close();
}
