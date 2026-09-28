import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const supplied = readJson('src/data/suppliedImages.json');
const provenance = readJson('docs/image-sources.json');
const materialFolders = {
  'Plantation Teak': '1oMOTUISRUITK9XqL9CwshS5EZa_q79pG',
  'Forest Teak': '1u5y3rw5AQqgEOMZNh-Snbi1wilvHAViZ',
  'Kapoor Sal': '1MB0eVSJ_CbJCTPDaEQ6PXl2Fh9wPqgrN',
  'Desi Sal': '1cW9EVjr5DEbC9ZbKtlV8YPKFaMJ0vcrh',
};
const imported = [...supplied.singleDoors, ...supplied.windows, ...Object.values(supplied.materials).flat()];
const sourceByPath = new Map(provenance.assets.map(image => [image.src, image]));
assert.equal(sourceByPath.size, provenance.assets.length, 'Duplicate source records');
assert.equal(new Set(imported.map(image => image.src)).size, imported.length, 'Duplicate imported paths');
assert.equal(imported.length, provenance.assets.length, 'Every imported image needs provenance');

function checkAsset(image) {
  assert.ok(image.src.startsWith('/images/'), `Nonlocal image: ${image.src}`);
  assert.ok(image.alt?.trim(), `Missing image description: ${image.src}`);
  const bytes = readFileSync(resolve(root, 'public', image.src.slice(1)));
  assert.ok(bytes.length > 0, `Empty image: ${image.src}`);
  return bytes;
}

for (const image of imported) {
  const source = sourceByPath.get(image.src);
  assert.ok(source, `Missing provenance: ${image.src}`);
  assert.ok(image.width > 0 && image.height > 0, `Missing dimensions: ${image.src}`);
  const bytes = checkAsset(image);
  assert.equal(bytes.length, source.bytes, `Changed file size: ${image.src}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256, `Changed original image: ${image.src}`);
  if (image.src.endsWith('.webp')) {
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', `Invalid WebP: ${image.src}`);
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', `Invalid WebP: ${image.src}`);
  } else {
    assert.equal(bytes.readUInt16BE(0), 0xffd8, `Invalid JPEG: ${image.src}`);
  }
}
for (const image of supplied.singleDoors) {
  assert.equal(sourceByPath.get(image.src).sourceFolderId, '1V2IrJB5g4JTlm0YZ_WXY-UbHHGmJbYEZ');
  assert.equal(image.kind, 'design');
  assert.equal(image.material, undefined, 'Single-door design must not claim a wood species');
}
for (const image of supplied.windows) {
  assert.equal(sourceByPath.get(image.src).sourceFolderId, '183yq03iUnJvGUJQwBNCsZTzK4xQ9WT4L');
  assert.equal(image.kind, 'design');
  assert.equal(image.material, undefined, 'Window design must not claim a wood species');
}
for (const [wood, images] of Object.entries(supplied.materials)) {
  assert.ok(materialFolders[wood], `Unreviewed material mapping: ${wood}`);
  for (const image of images) {
    assert.equal(image.material, wood);
    assert.equal(image.kind, 'material');
    assert.equal(sourceByPath.get(image.src).sourceFolderId, materialFolders[wood], `Wrong source folder for ${wood}`);
  }
}

const vite = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, logLevel: 'error' });
try {
  const { products } = await vite.ssrLoadModule('/src/data/products.js');
  const { getProductFamilies } = await vite.ssrLoadModule('/src/data/catalog.js');
  const { categoryGalleries } = await vite.ssrLoadModule('/src/data/productImages.js');
  const { woodGuides } = await vite.ssrLoadModule('/src/data/woodGuides.js');
  const { blogPosts } = await vite.ssrLoadModule('/src/data/blogPosts.js');
  const { blogImages } = await vite.ssrLoadModule('/src/data/blogImages.js');
  const singlePaths = new Set(supplied.singleDoors.map(image => image.src));
  const windowPaths = new Set(supplied.windows.map(image => image.src));
  const usedPaths = new Set();

  assert.equal(products.length, 69, 'Catalog variant count changed');
  assert.equal(new Set(products.map(product => product.id)).size, 69, 'Duplicate product IDs');
  assert.equal(products.filter(product => product.doorType === 'Single Door').length, 30);
  assert.equal(products.filter(product => product.doorType === 'Double Door').length, 30);
  for (const product of products) {
    assert.ok(product.images.length, `Empty gallery: ${product.name}`);
    assert.equal(product.image, product.images[0].src, `Card/gallery mismatch: ${product.name}`);
    assert.equal(product.illustrativeImages, product.images.some(image => image.kind === 'illustration'));
    assert.ok(product.price > 0 && product.imageLabel, `Missing price or photo label: ${product.name}`);
    for (const image of product.images) {
      checkAsset(image);
      usedPaths.add(image.src);
      if (image.kind === 'material') assert.equal(image.material, product.woodType, `Cross-species image: ${product.name}`);
      if (singlePaths.has(image.src)) assert.equal(product.doorType, 'Single Door', `Single-door image assigned to ${product.name}`);
      if (windowPaths.has(image.src)) assert.equal(product.category, 'Window', `Window image assigned to ${product.name}`);
    }
    if (product.doorType === 'Single Door') assert.ok(singlePaths.has(product.image));
    if (product.doorType === 'Double Door') assert.equal(product.image, '/images/nordwood-double-door.jpg');
    if (product.category === 'Window') assert.ok(windowPaths.has(product.image));
    if (product.category === 'DoorFrame' || product.category === 'WindowFrame') assert.equal(product.images[0].kind, 'illustration', 'Stock must not represent a completed frame');
  }
  assert.ok(singlePaths.has(categoryGalleries.Door[0].src));
  assert.ok(windowPaths.has(categoryGalleries.Window[0].src));
  for (const guide of woodGuides) {
    const expected = supplied.materials[guide.woodType];
    if (!expected) continue;
    assert.deepEqual(guide.imageKeys.map(key => blogImages[key]?.src), expected.map(image => image.src), `Wrong material guide: ${guide.woodType}`);
    for (const key of guide.imageKeys) assert.equal(blogImages[key].material, guide.woodType);
  }
  for (const post of blogPosts) for (const key of post.imageKeys) {
    assert.ok(blogImages[key], `Missing blog image ${key} in ${post.id}`);
    checkAsset(blogImages[key]);
    usedPaths.add(blogImages[key].src);
  }
  for (const image of imported) assert.ok(usedPaths.has(image.src), `Imported but unused: ${image.src}`);
  for (const family of getProductFamilies(products)) for (const variant of family.variants) {
    assert.deepEqual(variant.images, family.images, `Inconsistent size gallery: ${variant.name}`);
  }

  const { default: ProductDetail } = await vite.ssrLoadModule('/src/pages/ProductDetail.jsx');
  const { default: BlogDetail } = await vite.ssrLoadModule('/src/pages/BlogDetail.jsx');
  const { default: Shop } = await vite.ssrLoadModule('/src/pages/Shop.jsx');
  const renderRoute = (url, route, Component) => renderToStaticMarkup(
    createElement(MemoryRouter, { initialEntries: [url] },
      createElement(Routes, null,
        createElement(Route, { path: route, element: createElement(Component, { onAddToCart() {} }) }),
      ),
    ),
  );
  for (const product of products) {
    const markup = renderRoute(`/product/${product.id}`, '/product/:id', ProductDetail);
    for (const image of product.images) assert.ok(markup.includes(`src="${image.src}"`), `Unrendered product image: ${product.name}`);
  }
  for (const post of blogPosts) {
    const markup = renderRoute(`/blog/${post.id}`, '/blog/:id', BlogDetail);
    assert.ok(markup.includes(`src="${blogImages[post.imageKeys[0]].src}"`), `Unrendered article cover: ${post.id}`);
  }
  for (const category of Object.keys(categoryGalleries)) {
    const markup = renderRoute(`/shop?category=${category}`, '/shop', Shop);
    for (const family of getProductFamilies(products.filter(product => product.category === category))) {
      assert.ok(markup.includes(`src="${family.image}"`), `Unrendered shop image: ${family.name}`);
    }
  }
  console.log(`Verified ${imported.length} original assets, all ${products.length} catalog variants, ${woodGuides.length} wood guides and ${blogPosts.length} articles; rendered every product/article and all 4 shop categories.`);
} finally {
  await vite.close();
}
