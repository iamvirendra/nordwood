import { doorPricing } from './doorPricing';

export const woodTypes = {
  'Plantation Teak': {
    name: 'Plantation Teak',
    description: 'Plantation teak doors in single- and double-leaf designs, with ten standard sizes for each.',
  },
  'Forest Teak': {
    name: 'Forest Teak',
    description: 'Forest teak doors in single- and double-leaf designs, sized for your opening.',
  },
  'Imported Teak': {
    name: 'Imported Teak',
    description: 'Imported teak doors in single- and double-leaf designs, with clearly priced standard sizes.',
  },
  'Malaysian Saal': {
    name: 'Malaysian Saal',
    description: 'Durable Malaysian saal wood suited to precise frames.',
    durability: 'High',
    color: 'Light Brown',
  },
  'Kapoor Sal': {
    name: 'Kapoor Sal',
    description: 'Premium kapoor sal wood selected for quality frames.',
    durability: 'High',
    color: 'Reddish Brown',
  },
  'Desi Sal': {
    name: 'Desi Sal',
    description: 'Local sal wood offering dependable character and value.',
    durability: 'Medium-High',
    color: 'Yellow Brown',
  },
};

export const standardSizes = {
  doors: doorPricing[0].single.map(([height, width, woodCFT]) => ({ height, width, woodCFT, label: `${height}ft x ${width}ft` })),
  singleDoors: doorPricing[0].single.map(([height, width, woodCFT]) => ({ height, width, woodCFT, label: `${height}ft x ${width}ft` })),
  doubleDoors: doorPricing[0].double.map(([height, width, woodCFT]) => ({ height, width, woodCFT, label: `${height}ft x ${width}ft` })),
  frames: [
    { width: 4, height: 2.5, label: '4 x 2.5 ft' },
    { width: 5, height: 2.5, label: '5 x 2.5 ft' },
    { width: 6, height: 2.5, label: '6 x 2.5 ft' },
    { width: 5, height: 3, label: '5 x 3 ft' },
  ],
  windows: [
    { width: 4, height: 3, label: '4 x 3 ft' },
    { width: 5, height: 3.5, label: '5 x 3.5 ft' },
    { width: 6, height: 4, label: '6 x 4 ft' },
  ],
};
