# Door construction references

The September 2026 construction references inform the website's photographic craft presentation. Three supplied illustrations are copied unchanged into `public/images/craft/`; metadata is centralized in `src/data/craftImages.js`.

| Supplied file in Downloads | Website asset | Placement |
| --- | --- | --- |
| `WhatsApp Image 2026-09-04 at 21.00.56.jpeg` | `panel-door-cutaway.jpg` (1086 × 1448) | Single-door construction card |
| `WhatsApp Image 2026-09-04 at 21.03.18.jpeg` | `panel-door-exploded.jpg` (1122 × 1402) | Single-door construction card |
| `WhatsApp Image 2026-09-04 at 22.40.26.jpeg` | `door-exploded-reference.jpg` (1203 × 1308) | Homepage interactive photographic assembly |

The two square campaign compositions (`21.15.56` and `23.11.30`) are visual direction rather than published product photos. They inform the warm timber, cream and deep-green treatment. Their embedded advertising, older alternate logo, performance statements and contact graphics are not copied into the site. The supplied wood-disc PNG remains the primary logo.

`src/components/DoorAssembly.jsx` isolates individual photographic parts through native SVG clip paths. The source JPEG remains intact. One clean panel detail is reused where the original illustration has annotation text printed across the wood; the animation is a construction study, not an exact manufacturing model. Assembled/exploded buttons animate the parts, while a keyboard-accessible range control lets visitors inspect intermediate positions. There is no video, autoplay, timer, or ongoing animation loop. Site and system reduced-motion preferences remove transitions.

`TimberCraft` preserves the `#approach` navigation anchor and presents the interactive assembly between the section heading and contact link. The former reference sidebar, three image cards and enlargement dialog have been removed.

`DoorConstructionNote` appears only for `Door` products with `doorType === 'Single Door'`. It is educational content outside the product photograph gallery. It must not be added to unrelated windows, frames or double-door images.

These are illustrative construction studies, not verified specifications for all NordWood products. Embedded labels, plywood/core descriptions, joint types and thickness figures must not automatically become catalog claims. The source diagrams include some imperfect leader lines and labels. Confirm exact materials, dimensions, construction and finish for each design separately. Existing category/species image mapping, pricing, product IDs and cart behavior remain independent of this feature.

On desktop widths of 1024px and above, the craft section uses the viewport height below the 87px sticky header. The interactive study fills a single column between the heading and footer. The SVG scales to its available height without cropping. Windows shorter than 521px may scroll to keep controls readable. Mobile and tablet retain the stacked heading, assembly and footer layout.
