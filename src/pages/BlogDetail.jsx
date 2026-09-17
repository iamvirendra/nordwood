import { Link, useParams } from 'react-router-dom';
import BlogCarousel from '../components/BlogCarousel';
import { blogPosts } from '../data/blogPosts';
import { blogImages } from '../data/blogImages';
import './BlogDetail.css';

function JournalArrow({ back = false }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d={back ? 'M20 12H4m6-6-6 6 6 6' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BlogDetail() {
  const { id } = useParams();
  const postIndex = blogPosts.findIndex(post => post.id === id);
  const post = blogPosts[postIndex];

  if (!post) {
    return (
      <div className="blog-detail blog-detail--not-found">
        <div className="blog-detail__empty" data-page-enter>
          <p className="blog-detail__eyebrow">The NordWood journal</p>
          <h1>Story not found.</h1>
          <p>We couldn’t find a story at this address. Return to the journal to explore the collection of design notes, materials and planning ideas.</p>
          <Link to="/blog" className="blog-detail__back"><JournalArrow back /> Back to journal</Link>
        </div>
      </div>
    );
  }

  const nextPost = blogPosts[(postIndex + 1) % blogPosts.length];

  return (
    <div className={`blog-detail${post.woodType ? ' blog-detail--wood-guide' : ''}`}>
      <div className="blog-detail__inner">
        <nav className="blog-detail__navigation" aria-label="Journal navigation">
          <Link to="/blog" className="blog-detail__back"><JournalArrow back /> Back to journal</Link>
          {post.woodType ? <Link to="/#wood-types" className="blog-detail__back">All wood types <JournalArrow /></Link> : <span>The NordWood journal</span>}
        </nav>

        <article key={post.id} className="blog-detail__article" aria-labelledby="blog-detail-title">
          <header className="blog-detail__header" data-page-enter>
            <div className="blog-detail__meta">
              <span className="blog-detail__number" aria-label={`Story ${postIndex + 1}`}>{String(postIndex + 1).padStart(2, '0')}</span>
              <span>{post.category}</span>
              <span className="blog-detail__read-time">{post.readTime}</span>
            </div>
            <h1 id="blog-detail-title">{post.title}</h1>
            <p className="blog-detail__excerpt">{post.excerpt}</p>
          </header>

          <div className="blog-detail__body">
            <div className="blog-detail__gallery" data-motion="image">
              <BlogCarousel key={post.id} images={post.imageKeys.map(imageKey => blogImages[imageKey])} title={post.title} priority />
              <p className="blog-detail__photo-note">Photography is illustrative. Final wood grain, colour and finish may vary.</p>
            </div>

            <div className="blog-detail__copy" data-motion="rise">
              {post.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {post.sections?.map(section => (
                <section key={section.id} id={section.id} className="blog-detail__section" aria-labelledby={`${section.id}-title`}>
                  <h2 id={`${section.id}-title`}>{section.title}</h2>
                  {section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  {section.bullets?.length > 0 && <ul>{section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}
                </section>
              ))}
              <aside className="blog-detail__takeaway" aria-label="A detail to remember">
                <span>A detail to remember</span>
                <p>{post.takeaway}</p>
              </aside>
              {post.woodType && <div className="blog-detail__wood-action"><p>Bring the material into your home.</p><Link to={`/shop?${new URLSearchParams({ category: post.shopCategory, wood: post.woodType })}`}>Explore {post.woodType} <JournalArrow /></Link></div>}
              {post.sources?.length > 0 && <section className="blog-detail__sources" aria-label="Further reading"><h2>Further reading</h2><ul>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} <span aria-hidden="true">↗</span></a></li>)}</ul></section>}
            </div>
          </div>
        </article>

        {nextPost.id !== post.id && (
          <nav className="blog-detail__next" aria-label="Next journal story" data-motion="rise">
            <Link to={`/blog/${nextPost.id}`}>
              <span className="blog-detail__next-label">Next story <span>{nextPost.category} / {nextPost.readTime}</span></span>
              <span className="blog-detail__next-title">{nextPost.title}</span>
              <span className="blog-detail__next-arrow"><JournalArrow /></span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
