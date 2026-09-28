import { brandWordmark } from '../data/brand';
import './BrandWordmark.css';

export default function BrandWordmark({ className = '', decorative = false, loading = 'lazy' }) {
  return (
    <span className={`brand-wordmark ${className}`.trim()}>
      <img
        src={brandWordmark.src}
        width={brandWordmark.width}
        height={brandWordmark.height}
        alt={decorative ? '' : brandWordmark.alt}
        loading={loading}
        decoding="async"
      />
    </span>
  );
}
