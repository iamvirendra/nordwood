// Share exactly the same tags between pre-rendered HTML and client navigation.
export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function getHeadEntries(seo) {
  const entries = [
    { tag: 'title', text: seo.title },
    { tag: 'meta', attributes: { name: 'description', content: seo.description } },
  ];
  if (seo.robots) entries.push({ tag: 'meta', attributes: { name: 'robots', content: seo.robots } });
  if (seo.canonical) entries.push({ tag: 'link', attributes: { rel: 'canonical', href: seo.canonical } });
  if (seo.type) {
    for (const [property, content] of Object.entries({
      'og:type': seo.type,
      'og:site_name': 'NordWood',
      'og:locale': 'en_IN',
      'og:title': seo.title,
      'og:description': seo.description,
      'og:url': seo.canonical,
      'og:image': seo.image,
      'og:image:alt': seo.imageAlt,
    })) if (content) entries.push({ tag: 'meta', attributes: { property, content } });
    for (const [name, content] of Object.entries({
      'twitter:card': 'summary_large_image',
      'twitter:title': seo.title,
      'twitter:description': seo.description,
      'twitter:image': seo.image,
      'twitter:image:alt': seo.imageAlt,
    })) if (content) entries.push({ tag: 'meta', attributes: { name, content } });
  }
  if (seo.structuredData?.length) entries.push({
    tag: 'script',
    attributes: { type: 'application/ld+json' },
    text: serializeJsonLd(seo.structuredData),
  });
  return entries;
}

export function renderHeadMetadata(seo) {
  return getHeadEntries(seo).map(({ tag, attributes = {}, text }) => {
    const attrs = Object.entries(attributes).map(([key, value]) => ` ${key}="${escapeHtml(value)}"`).join('');
    if (tag === 'meta' || tag === 'link') return `<${tag} data-nordwood-seo${attrs}>`;
    return `<${tag} data-nordwood-seo${attrs}>${tag === 'script' ? text : escapeHtml(text)}</${tag}>`;
  }).join('\n    ');
}

export function applyHeadMetadata(seo, targetDocument = document) {
  targetDocument.head.querySelectorAll('[data-nordwood-seo]').forEach(element => element.remove());
  const fragment = targetDocument.createDocumentFragment();
  for (const { tag, attributes = {}, text } of getHeadEntries(seo)) {
    const element = targetDocument.createElement(tag);
    element.setAttribute('data-nordwood-seo', '');
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    if (text !== undefined) element.textContent = text;
    fragment.appendChild(element);
  }
  targetDocument.head.appendChild(fragment);
}

export function replaceHtmlMetadata(html, seo) {
  // Only tags owned by this module are replaced; fonts, favicons and bundle tags stay intact.
  const cleaned = html.replace(/<(title|script)\b(?=[^>]*\bdata-nordwood-seo(?:\s|=|>))[^>]*>[\s\S]*?<\/\1>\s*|<(?:meta|link)\b(?=[^>]*\bdata-nordwood-seo(?:\s|=|>))[^>]*>\s*/gi, '');
  return cleaned.replace('</head>', `    ${renderHeadMetadata(seo)}\n  </head>`);
}
