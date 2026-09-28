import { useEffect } from 'react';
import { defaultSeo, getBlogSeo } from '../seo/blogSeo';
import { applyHeadMetadata } from '../seo/headMetadata';

export default function BlogSeo({ post, notFound = false }) {
  useEffect(() => {
    applyHeadMetadata(getBlogSeo({ post, notFound }));
    // An article's canonical, schema and noindex state must not follow visitors
    // into another route. Pre-rendered and client-created tags share this owner.
    return () => applyHeadMetadata(defaultSeo);
  }, [post, notFound]);
  return null;
}
