// Replace each family's three entries with your own product photographs.
// All size variants inherit these images; a family can contain more than three.
const studioImages = {
  single: '/images/nordwood-door.jpg',
  double: '/images/nordwood-double-door.jpg',
  DoorFrame: '/images/nordwood-door-frame.jpg',
  Window: '/images/nordwood-window.jpg',
  WindowFrame: '/images/nordwood-window-frame.jpg',
};

const placeholderGallery = (src, name) => [
  { src, alt: `Illustrative studio design of ${name}`, label: 'Design view' },
  { src: '/images/nordwood-timber-detail.jpg', alt: 'Illustrative close-up of teak grain and timber joinery', label: 'Timber detail' },
  { src: '/images/nordwood-teak-entry.jpg', alt: 'Architectural inspiration showing a warm teak entrance', label: 'Inspiration' },
];

export const productGalleries = {
  'Plantation Teak Single Door': placeholderGallery(studioImages.single, 'a plantation teak single door'),
  'Plantation Teak Double Door': placeholderGallery(studioImages.double, 'a plantation teak double door'),
  'Forest Teak Single Door': placeholderGallery(studioImages.single, 'a forest teak single door'),
  'Forest Teak Double Door': placeholderGallery(studioImages.double, 'a forest teak double door'),
  'Imported Teak Single Door': placeholderGallery(studioImages.single, 'an imported teak single door'),
  'Imported Teak Double Door': placeholderGallery(studioImages.double, 'an imported teak double door'),
};

export function getProductImages(name, category) {
  return productGalleries[name] || placeholderGallery(studioImages[category] || studioImages.single, name);
}
