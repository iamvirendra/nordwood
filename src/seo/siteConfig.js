const configuredOrigin = import.meta.env?.VITE_SITE_URL || 'https://www.nordwood.in';
const site = new URL(configuredOrigin);

if (!['https:', 'http:'].includes(site.protocol) || site.username || site.password || site.pathname !== '/' || site.search || site.hash) {
  throw new Error('VITE_SITE_URL must be an absolute site origin, such as https://www.nordwood.in.');
}

// The default comes from the supplied brand artwork, not a verified deployment.
export const siteOrigin = site.origin;
export const absoluteSiteUrl = pathname => new URL(pathname, `${siteOrigin}/`).href;

export const defaultSeo = {
  title: 'NordWood — Crafted for living',
  description: 'Discover NordWood doors, frames, and windows. Natural timber, considered details, and woodwork made to your measure in Lucknow, India.',
};
