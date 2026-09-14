import { products } from './products';
import { woodTypes } from './specifications';

export const categoryConfig = [
  {
    value: 'Door',
    label: 'Doors',
    eyebrow: 'Entry & interior',
    description: 'Statement doors made to set the tone of a space.',
  },
  {
    value: 'Window',
    label: 'Windows',
    eyebrow: 'Light & air',
    description: 'Timeless windows that invite daylight in.',
  },
  {
    value: 'DoorFrame',
    label: 'Door frames',
    eyebrow: 'The foundation',
    description: 'Strong, precise frames finished for a lasting fit.',
  },
  {
    value: 'WindowFrame',
    label: 'Window frames',
    eyebrow: 'Fine details',
    description: 'Complete frame kits for beautifully finished openings.',
  },
];

export function getCategoryLabel(category) {
  return categoryConfig.find(item => item.value === category)?.label || category;
}

export function normalizeSize(value = '') {
  return value
    .toLowerCase()
    .replace(/feet?/g, 'ft')
    .replace(/[×]/g, 'x')
    .replace(/\s+/g, '')
    .trim();
}

export function getVariantSizeLabel(product) {
  if (product.height && product.width) {
    return `${product.height.replace(/\s+/g, '')} x ${product.width.replace(/\s+/g, '')}`;
  }

  if (product.size) {
    return product.size;
  }

  const namedSize = product.name.match(/\s+-\s+(Standard|Premium)$/i);
  return namedSize ? namedSize[1] : '';
}

export function getProductFamilyTitle(product) {
  return product.name
    .replace(/\s+-\s+[\d.]+\s*(?:ft)?\s*[x×]\s*[\d.]+\s*(?:ft)?$/i, '')
    .trim();
}

export function getProductFamilyKey(product) {
  return [product.category, product.woodType || 'Unspecified', getProductFamilyTitle(product)]
    .join('::');
}

export function getProductFamilies(sourceProducts = products) {
  const families = new Map();

  sourceProducts.forEach(product => {
    const key = getProductFamilyKey(product);
    const family = families.get(key);

    if (family) {
      family.variants.push(product);
      return;
    }

    families.set(key, {
      ...product,
      key,
      name: getProductFamilyTitle(product),
      variants: [product],
    });
  });

  return [...families.values()].map(family => {
    const variants = [...family.variants].sort((a, b) => {
      if (Number.isFinite(a.heightFeet) && Number.isFinite(b.heightFeet)) {
        return a.heightFeet - b.heightFeet || a.widthFeet - b.widthFeet;
      }
      const sizeA = normalizeSize(getVariantSizeLabel(a));
      const sizeB = normalizeSize(getVariantSizeLabel(b));
      return sizeA.localeCompare(sizeB, undefined, { numeric: true });
    });
    const lowestPriceVariant = variants.reduce((lowest, variant) =>
      variant.price < lowest.price ? variant : lowest,
    variants[0]);

    return {
      ...family,
      ...lowestPriceVariant,
      name: family.name,
      variants,
    };
  });
}

export function getProductFamilyById(id, sourceProducts = products) {
  return getProductFamilies(sourceProducts).find(family =>
    family.variants.some(product => product.id === Number(id)),
  );
}

export function getWoodTypesForCategory(category, sourceProducts = products) {
  const categoryProducts = sourceProducts.filter(product => product.category === category);
  const names = [...new Set(categoryProducts.map(product => product.woodType).filter(Boolean))];

  return names.map(name => ({
    name,
    count: categoryProducts.filter(product => product.woodType === name).length,
    details: woodTypes[name],
  }));
}

export function getSizeOptions(product, variants = []) {
  const actualVariants = variants.length ? variants : [product];
  return actualVariants.map(variant => ({
    label: getVariantSizeLabel(variant),
    available: true,
    id: variant.id,
    price: variant.price,
    woodCFT: variant.woodCFT,
  }));
}
