import { doorPricing } from './doorPricing';
import { getProductImages } from './productImages';
import otherProducts from './other-products.json';

// Preserve the six existing door URLs while assigning stable IDs to added sizes.
const existingDoorIds = { '7x2.5': 1, '7x3': 2, '7x3.5': 3, '7x4': 4, '8x3': 5, '8x4': 6 };

const doors = doorPricing.flatMap((wood, woodIndex) => ['single', 'double'].flatMap((type, typeIndex) => {
  const doorType = type === 'single' ? 'Single Door' : 'Double Door';
  const familyName = `${wood.woodType} ${doorType}`;
  const images = getProductImages(familyName, 'Door');
  return wood[type].map(([height, width, woodCFT, price], index) => ({
    id: (woodIndex === 0 && type === 'single' ? existingDoorIds[`${height}x${width}`] : null) || (1000 + woodIndex * 100 + typeIndex * 20 + index),
    name: `${familyName} - ${height}ft x ${width}ft`,
    category: 'Door',
    woodType: wood.woodType,
    doorType,
    height: `${height} ft`,
    width: `${width} ft`,
    heightFeet: height,
    widthFeet: width,
    woodCFT,
    price,
    image: images[0].src,
    images,
    illustrativeImages: true,
    description: `${wood.woodType} in a ${type === 'single' ? 'single-leaf' : 'double-leaf'} design. Choose the standard size for your space.`,
    details: `${familyName}. ${height} ft high × ${width} ft wide, with ${woodCFT} CFT of wood. Price shown is for the selected standard size. GST extra.`,
  }));
}));

// Existing frame/window prices are retained; the supplied workbook covers doors.
const otherWoodwork = otherProducts.map(product => {
  const images = getProductImages(product.name, product.category);
  return { ...product, images, image: images[0].src, illustrativeImages: true };
});

export const products = [...doors, ...otherWoodwork];
