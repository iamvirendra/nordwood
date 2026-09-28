import { blogImages } from '../data/blogImages';
import { brandLogo } from '../data/brand';
import { absoluteSiteUrl, defaultSeo } from './siteConfig';

const journalTitle = 'Wood Guides & Door Design Journal | NordWood';
const journalDescription = 'Explore NordWood guides to teak and sal wood, wooden doors, frames, sizes and finishes. Practical ideas for choosing woodwork for your home.';

export function getBlogSeo({ post, notFound = false } = {}) {
  if (notFound) return {
    title: 'Story not found | NordWood Journal',
    description: 'This journal story could not be found. Browse the NordWood journal for wood guides, door design ideas and planning advice.',
    robots: 'noindex, follow',
  };

  const canonical = absoluteSiteUrl(post ? `/blog/${encodeURIComponent(post.id)}` : '/blog');
  const cover = post ? blogImages[post.imageKeys[0]] : blogImages.workshop;
  const image = absoluteSiteUrl(cover.src);
  const title = post?.seo?.title || (post ? `${post.title} | NordWood Journal` : journalTitle);
  const description = post?.seo?.description || post?.excerpt || journalDescription;
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteSiteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: absoluteSiteUrl('/blog') },
      ...(post ? [{ '@type': 'ListItem', position: 3, name: post.title, item: canonical }] : []),
    ],
  };

  const structuredData = [breadcrumbs];
  if (post) structuredData.unshift({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    url: canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    headline: post.title,
    description,
    image: [image],
    articleSection: post.category,
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'NordWood',
      url: absoluteSiteUrl('/'),
      logo: {
        '@type': 'ImageObject',
        url: absoluteSiteUrl(brandLogo.src),
        width: brandLogo.width,
        height: brandLogo.height,
      },
    },
  });

  return { title, description, canonical, image, imageAlt: cover.alt, type: post ? 'article' : 'website', structuredData };
}

export { defaultSeo };
