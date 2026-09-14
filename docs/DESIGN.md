# NordWood visual system

The site uses a cream-led palette: soft cream `#F4F0E6`, charcoal `#2C302E`, warm champagne `#E8D8B6`, and near-black `#111111`. Cream leads the navigation, page introductions, product areas, and craft study. Charcoal provides structure in buttons, the footer, and the brief woodworking intro. Champagne is reserved for quiet accents, surfaces, and details against dark imagery. Natural wood photography and illustrations retain their material colours.

Edit shared colour tokens in `src/styles/global.css`. Pale champagne is too light for small text on cream, so `--accent-ink` provides a readable bronze tone for those details. `--muted` is for light surfaces and `--muted-dark` for charcoal.

Motion is implemented with CSS, SVG, IntersectionObserver, and the browser animation API, without an animation dependency. `src/motion` owns route entrances, scroll reveals, gallery/interaction motion, and the saved preference. Mark new sections with `data-motion="rise"` or `data-motion="image"`; use `data-page-enter` on stable page-introduction elements.

The homepage intro runs briefly on the first home visit and can be skipped or replayed. The six-second timber study plays when visible, pauses offscreen or in a hidden tab, and has stage/replay controls. The utility-bar motion switch persists locally. The device's reduced-motion preference takes priority and always shows static content.
