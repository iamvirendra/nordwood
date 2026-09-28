import suppliedImages from './suppliedImages.json';

const materialEntries = Object.entries(suppliedImages.materials);
const materialImageKey = (woodType, image, index) => {
  const coverKey = `wood-${woodType.toLowerCase().replaceAll(' ', '-')}`;
  const filename = image.src.split('/').pop().replace(/\.[^.]+$/, '');
  return index === 0 ? coverKey : `${coverKey}-${filename}`;
};

// Keep existing cover keys; additional keys follow the source filenames.
export const suppliedWoodImageKeys = Object.fromEntries(
  materialEntries.map(([woodType, images]) => [
    woodType,
    images.map((image, index) => materialImageKey(woodType, image, index)),
  ]),
);

const suppliedWoodImages = Object.fromEntries(
  materialEntries.flatMap(([woodType, images]) => images.map((image, index) => [
    materialImageKey(woodType, image, index),
    {
      ...image,
      caption: `${woodType}: ${image.label.toLowerCase()}. Compare this material reference with a current sample.`,
    },
  ])),
);

// Supplied material/design references and the remaining editorial illustrations.
export const blogImages = {
  ...suppliedWoodImages,
  'wood-imported-teak': {
    src: '/images/wood-imported-teak.jpg',
    alt: 'Illustrative teak samples showing warm timber tones and fine grain',
    caption: 'Teak tones vary. An approved sample is the best reference for your project.',
  },
  'wood-malaysian-saal': {
    src: '/images/wood-malaysian-saal.jpg',
    alt: 'Illustrative light brown hardwood sample for the Malaysian Saal material guide',
    caption: 'A representative hardwood study; confirm the species and appearance of the supplied timber.',
  },
  entry: {
    src: '/images/nordwood-teak-entry.jpg',
    alt: 'Tall timber entrance door beside warm plaster walls and a quiet courtyard',
    caption: 'An entrance considered as part of the whole room.',
  },
  detail: {
    src: '/images/nordwood-timber-detail.jpg',
    alt: 'Close view of warm wood grain, a door edge and metal hardware',
    caption: 'Grain, edges and finishes give a piece its character.',
  },
  workshop: {
    src: '/images/blog-workshop.jpg',
    alt: 'Teak boards, a wooden hand plane and joinery samples on a sunlit workbench',
    caption: 'A workshop study in timber, tools and careful joinery.',
  },
  'window-light': {
    src: '/images/blog-window-light.jpg',
    alt: 'A timber framed window casting daylight across a cream interior',
    caption: 'Natural light brings warmth to the wood and surrounding walls.',
  },
  'single-door': {
    ...suppliedImages.singleDoors[0],
    caption: 'A supplied single-door design reference. Confirm the wood selection and finish for your order.',
  },
  'double-door': {
    src: '/images/nordwood-double-door.jpg',
    alt: 'Illustrative pair of timber door leaves meeting within one frame',
    caption: 'Two leaves create a different rhythm within an opening.',
    fit: 'contain',
  },
  'door-frame': {
    src: '/images/nordwood-door-frame.jpg',
    alt: 'Illustrative timber door frame showing its outline and joints',
    caption: 'The frame forms the transition between the door and the wall.',
    fit: 'contain',
  },
  window: {
    ...suppliedImages.windows[0],
    caption: 'A supplied window design reference. Confirm the wood selection and finish for your order.',
  },
  'window-frame': {
    src: '/images/nordwood-window-frame.jpg',
    alt: 'Illustrative wooden window frame with visible timber construction',
    caption: 'Consider the window surround alongside neighbouring woodwork.',
    fit: 'contain',
  },
};
