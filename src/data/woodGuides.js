import seoBlogContent from './seoBlogContent.json';
import { suppliedWoodImageKeys } from './blogImages';

// Catalogue identity and image mapping stay independent of the source article copy.
const guideSelections = [
  {
    "id": "plantation-teak-guide",
    "woodType": "Plantation Teak",
    "category": "Wood guides",
    "takeaway": "Choose plantation teak by the actual selection, the intended location and the complete door specification.",
    "imageKeys": [
      "wood-plantation-teak",
      "wood-plantation-teak-03-plantation-teak-sawn-timber",
      "wood-plantation-teak-01-plantation-teak-round-logs",
      "wood-plantation-teak-02-plantation-teak-log-detail",
      "wood-plantation-teak-05-plantation-teak-timber-selection"
    ],
    "shopCategory": "Door"
  },
  {
    "id": "forest-teak-guide",
    "woodType": "Forest Teak",
    "category": "Wood guides",
    "takeaway": "Let the documented timber selection and the finished door details define your choice of Forest Teak.",
    "imageKeys": [
      "wood-forest-teak",
      "wood-forest-teak-warehouse-logs-wide",
      "wood-forest-teak-outdoor-logs-wide",
      "wood-forest-teak-depot-detail-wide"
    ],
    "shopCategory": "Door"
  },
  {
    "id": "imported-teak-guide",
    "woodType": "Imported Teak",
    "category": "Wood guides",
    "takeaway": "Treat imported as the start of a sourcing conversation, then choose by the material and door specification.",
    "imageKeys": [
      "wood-imported-teak",
      "single-door",
      "workshop"
    ],
    "shopCategory": "Door"
  },
  {
    "id": "malaysian-saal-guide",
    "woodType": "Malaysian Saal",
    "category": "Wood guides",
    "takeaway": "Confirm the species behind the trade name, then specify the frame around the door and its location.",
    "imageKeys": [
      "wood-malaysian-saal",
      "door-frame",
      "window-frame"
    ],
    "shopCategory": "DoorFrame"
  },
  {
    "id": "kapoor-sal-guide",
    "woodType": "Kapoor Sal",
    "category": "Wood guides",
    "takeaway": "Identify the material first, then review its preparation and the complete frame specification.",
    "imageKeys": [
      "wood-kapoor-sal",
      "wood-kapoor-sal-04-kapur-actual-chaukhat-stock",
      "wood-kapoor-sal-03-kapur-actual-sawn-flat-sections",
      "wood-kapoor-sal-01-kapur-actual-round-logs",
      "wood-kapoor-sal-02-kapur-actual-log-lengths"
    ],
    "shopCategory": "DoorFrame"
  },
  {
    "id": "desi-sal-guide",
    "woodType": "Desi Sal",
    "category": "Wood guides",
    "takeaway": "Choose Desi Sal with a clear frame drawing, an inspected timber selection and an agreed finishing plan.",
    "imageKeys": [
      "wood-desi-sal",
      "wood-desi-sal-04-sawn-saal-timber-stack",
      "wood-desi-sal-01-raw-saal-log-stack",
      "wood-desi-sal-02-saal-log-end-grain",
      "wood-desi-sal-03-saal-sawn-timber-pile",
      "wood-desi-sal-04-saal-sawn-faces-from-video"
    ],
    "shopCategory": "DoorFrame"
  }
];

export const woodGuides = guideSelections.map(guide => ({
  ...guide,
  ...seoBlogContent[guide.id],
  imageKeys: suppliedWoodImageKeys[guide.woodType] || guide.imageKeys,
}));
