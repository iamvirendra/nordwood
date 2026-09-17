import { Link, Navigate, useLocation } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { blogImages } from '../data/blogImages';
import './Blog.css';

export default function Blog() {
  const { hash } = useLocation();
  const legacyStory = blogPosts.find(post => `#${post.id}` === hash);

  // Keep previously shared story links working after moving to individual pages.
  if (legacyStory) return <Navigate to={`/blog/${legacyStory.id}`} replace />;

  return (
    <div className="blog">
      <header className="blog-masthead">
        <div className="blog-masthead__title" data-page-enter>
          <p className="eyebrow">The NordWood journal</p>
          <h1>The art of<br /><em>living with wood.</em></h1>
        </div>
        <div className="blog-masthead__note" data-page-enter>
          <span className="blog-masthead__rule" aria-hidden="true" />
          <p>Good spaces begin with thoughtful details. A collection of ideas on wood, proportion and the pieces that make a home.</p>
          <span>Wood guides / Design notes / Planning</span>
        </div>
      </header>

      <section className="blog-listing" aria-label="Journal articles">
        <div className="blog-listing__intro">
          <p><strong>{String(blogPosts.length).padStart(2, '0')}</strong> stories, one considered home</p>
          <span>Ideas to take into your next project</span>
        </div>
        <div className="blog-grid">
          {blogPosts.map((post, index) => {
            const cover = blogImages[post.imageKeys[0]];
            return (
              <article key={post.id} className={`blog-card${index === 0 ? ' blog-card--featured' : ''}`} data-motion="rise">
                <Link className="blog-card__link" to={`/blog/${post.id}`} aria-labelledby={`${post.id}-title`}>
                  <div className="blog-card__cover">
                    <img src={cover.src} alt={cover.alt} width="1200" height="900" style={{ objectFit: cover.fit || 'cover' }} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
                  </div>
                  <div className="blog-card__content">
                    <div className="blog-card__meta"><span>{post.category}</span><span>{post.readTime}</span></div>
                    <h2 id={`${post.id}-title`}>{post.title}</h2>
                    <p>{post.excerpt}</p>
                    <div className="blog-card__footer" aria-hidden="true">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.2" /></svg>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
        <p className="blog-photo-note">Photography is illustrative. Final wood grain, colour and finish may vary.</p>
      </section>
    </div>
  );
}
