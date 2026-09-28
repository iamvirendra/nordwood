# Website image mapping

The nine supplied Drive folders were inspected on 28 September 2026. The imported files are unchanged copies of the supplied WebP/JPG images. `image-sources.json` records their Drive IDs, filenames, dimensions and checksums; `src/data/suppliedImages.json` is the shared runtime registry.

| Supplied folder | Website use |
| --- | --- |
| Logo | Keep the previously selected `1000002194-Photoroom.png` as the main logo. The alternative logo is not substituted. |
| Doors → Single doors → webp | Nine complete single-leaf designs: general Doors tile, all three single-door families, and single-door editorial references. These are design references, not photographs proving wood species. |
| Doors → Jali doors | Inspected separately. Not assigned to solid-door products because the catalog has no priced Jali family. |
| Windows | Three window designs: Windows category, window product galleries and window editorial references. Not assigned to bare window-frame kits. |
| Kapur Wood | Five material photos mapped to the existing **Kapoor Sal** label: matching guide and Kapoor Sal product gallery detail views. Chaukhat stock is timber stock, not a completed frame/rebate reference. |
| Desi Sal | Six photos mapped only to Desi Sal: matching guide and product material detail views. |
| Plantation Teak | Five photos mapped only to Plantation Teak: matching guide and door/window material detail views. |
| Forest teak | Four distinct wide photos mapped only to Forest Teak: matching guide and door material detail views. Square/vertical crops are alternatives of the same subjects and are not repeated. |
| Chaukhats | Folder is empty. Existing finished-frame illustrations remain. |
| Other images | Folder is empty. No replacement assigned. |

No supplied image shows a confirmed double-door pair. Double-door illustrations therefore remain; the single-door designs are never used as double-door product images. No Imported Teak or Malaysian Saal material folder was supplied, so their material-guide illustrations remain. Window frames keep their existing illustration because complete-window photos do not establish a frame-kit design.

The single-door file named `door-08-asymmetric-five-panel-unpolished.webp` visibly has one tall panel plus five stacked panels. Its displayed label is **Asymmetric panel design**, avoiding the inaccurate filename count.

Prices, product IDs, sizes, wood volumes and cart behavior are preserved. Run `npm run check:images` to verify asset integrity, category/material separation and the full catalog's image assignments.
