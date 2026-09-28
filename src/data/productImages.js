import suppliedImages from './suppliedImages.json';

// Folder labels establish a design category or material, not an exact priced SKU.
// Keep missing categories on their existing illustration instead of guessing.
const illustrations = {
  double: { src: '/images/nordwood-double-door.jpg', alt: 'Illustrative pair of wooden door leaves', label: 'Double-door design', kind: 'illustration' },
  DoorFrame: { src: '/images/nordwood-door-frame.jpg', alt: 'Illustrative wooden door frame', label: 'Frame design', kind: 'illustration' },
  WindowFrame: { src: '/images/nordwood-window-frame.jpg', alt: 'Illustrative wooden window frame', label: 'Frame design', kind: 'illustration' },
};

export const categoryGalleries = {
  Door: suppliedImages.singleDoors,
  Window: suppliedImages.windows,
  DoorFrame: [illustrations.DoorFrame],
  WindowFrame: [illustrations.WindowFrame],
};

const materialGallery = woodType => suppliedImages.materials[woodType] || [];

export const productGalleries = Object.fromEntries(
  ['Plantation Teak', 'Forest Teak', 'Imported Teak'].flatMap(woodType => [
    [`${woodType} Single Door`, [...suppliedImages.singleDoors, ...materialGallery(woodType)]],
    [`${woodType} Double Door`, [illustrations.double, ...materialGallery(woodType)]],
  ]),
);

export function getProductImages(name, category, woodType) {
  return productGalleries[name] || [...(categoryGalleries[category] || []), ...materialGallery(woodType)];
}

export function getImageLabel(image) {
  if (image.kind === 'material') return `${image.material} · ${image.label}`;
  if (image.kind === 'design') return 'Design reference';
  return 'Illustrative photo';
}
