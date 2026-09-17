const references = {
  plantation: {
    title: 'FAO / FRIM — Silviculture and management of teak plantations',
    url: 'https://www.fao.org/4/x4565e/x4565e04.htm',
  },
  teak: {
    title: 'FAO — Management of teak plantations',
    url: 'https://www.fao.org/4/ac773e/ac773e08.htm',
  },
  teakUses: {
    title: 'FAO — Teak properties and uses',
    url: 'https://www.fao.org/4/n6845e/n6845e02.htm',
  },
  teakProperties: {
    title: 'USDA Forest Products Laboratory — Teak technical fact sheet',
    url: 'https://dendro.cnre.vt.edu/dendrology/woodtech/tectona_grandis.pdf',
  },
  names: {
    title: 'FAO — Wood properties and the meaning of trade names',
    url: 'https://www.fao.org/4/j8289e/J8289E03.htm',
  },
  handbook: {
    title: 'USDA Forest Products Laboratory — Wood Handbook',
    url: 'https://research.fs.usda.gov/fpl/wood-handbook',
  },
  finishing: {
    title: 'USDA Forest Products Laboratory — Finishing wood',
    url: 'https://research.fs.usda.gov/treesearch/62269',
  },
  malaysianTimbers: {
    title: 'FRIM — A Dictionary of Malaysian Timbers',
    url: 'https://shop.frim.gov.my/a-dictionary-of-malaysian-timbers-3rdedition',
  },
  kapur: {
    title: 'FRIM — Kapur timber: properties and drying considerations',
    url: 'https://info.frim.gov.my/infocenter_applications/web/pdf/ttb/TTB97.pdf',
  },
  kapurUses: {
    title: 'FRIM — Timber Notes: Kapur characteristics and uses',
    url: 'https://info.frim.gov.my/infocenter/booksonline/ttb/TTBNO11.PDF',
  },
  sal: {
    title: 'Singapore NParks — Sal (Shorea robusta)',
    url: 'https://www.nparks.gov.sg/florafaunaweb/flora/6/7/6720',
  },
  seasoning: {
    title: 'ICFRE Forest Research Institute — Wood seasoning and testing services',
    url: 'https://fri.icfre.gov.in/services/',
  },
  salProperties: {
    title: 'K. A. Chowdhury — Indian wood anatomy: Sal identification',
    url: 'https://era.ed.ac.uk/server/api/core/bitstreams/8909a6f7-f0b6-49c2-a817-4513537b74b9/content',
  },
  salSeasoning: {
    title: 'FAO — Nepal Boat Building Programme: timber properties',
    url: 'https://www.fao.org/4/l3251e/L3251E06.htm',
  },
};

export const woodGuides = [
  {
    id: 'plantation-teak-guide',
    woodType: 'Plantation Teak',
    category: 'Wood guides',
    title: 'Plantation Teak: character, uses and care',
    excerpt: 'A closer look at planted teak, from the grain you choose to the door you live with.',
    summary: 'Planted teak, considered through its grain, finish and everyday use.',
    paragraphs: [
      'Plantation teak is teak grown in planted stands. The species is Tectona grandis; plantation describes how it is grown, rather than a separate wood species or a finished-product grade. In the NordWood collection, it is one of the options for single and double doors. Start with the opening you are furnishing, then compare the actual timber, construction and finish available for that door.',
    ],
    sections: [
      {
        id: 'character',
        title: 'Read the grain and the selection',
        paragraphs: [
          'Teak heartwood ranges through golden and brown tones, often with darker streaks, while sapwood is paler. Its generally straight grain can be wavy, and the surface has an oily feel. Teak is known for modest movement in service and natural heartwood durability. These are species characteristics; the selected timber and door construction still matter.',
          'Plantation management and the age of a tree can influence the timber it produces. Research discussed by FAO also challenges the assumption that faster-grown teak is automatically weaker. For a buyer, the useful conclusion is to judge the selected material. Ask to see several pieces together, including any pale sapwood, so you understand the range of colour and pattern proposed for your order.',
          'Lay a finished sample beside the floor and wall colour. A door fills a much larger area than a small sample, so view a full-door reference as well. Decide whether you enjoy visible variation or prefer a quieter arrangement across the panels.',
        ],
      },
      {
        id: 'uses',
        title: 'Where it belongs in the home',
        paragraphs: [
          'Teak has a long history in furniture and joinery. For this collection, consider plantation teak for an interior door, a main entrance or a pair of doors where you want the timber to be part of the room’s material palette. An exposed entrance needs its own discussion about weather, construction and finish; the wood name alone does not settle those requirements.',
        ],
      },
      {
        id: 'selection',
        title: 'Compare the complete door',
        paragraphs: [
          'Keep the size and configuration constant when comparing teak options. Review the panel arrangement, finished thickness, selected faces, fittings and scope of supply together. For several rooms, ask how the pieces will be visually coordinated. A useful order note describes the look you want and includes an approved sample, rather than relying on the word plantation to communicate colour or quality.',
        ],
      },
      {
        id: 'finish-and-care',
        title: 'Plan the finish and everyday care',
        paragraphs: [
          'Choose the coating with the maker for the actual location. Ask for a sample with the proposed sheen and a written care recommendation. Before installation, have the installer confirm that the timber and site are ready, then agree the fitting clearances and hardware. Keep the finish specification with your order so any later touch-up uses a compatible product.',
          'Use a soft cloth for routine dusting, attend to spills promptly and follow the coating maker’s cleaning guidance. At an entrance, periodically look over the lower edge, exposed faces and joints. Renew the finish according to its condition and the specified maintenance instructions.',
        ],
      },
      {
        id: 'before-ordering',
        title: 'Bring these questions to your enquiry',
        paragraphs: ['A short written brief makes the comparison easier for everyone involved.'],
        bullets: [
          'What is the documented timber source, and what does the selected grade include?',
          'Can I approve the current grain, colour range and finished sample?',
          'What seasoning, hardware, fitting and care details apply to this door?',
        ],
      },
    ],
    takeaway: 'Choose plantation teak by the actual selection, the intended location and the complete door specification.',
    readTime: '3 min read',
    imageKeys: ['wood-plantation-teak', 'single-door', 'detail'],
    sources: [references.plantation, references.teakProperties, references.finishing],
    shopCategory: 'Door',
  },
  {
    id: 'forest-teak-guide',
    woodType: 'Forest Teak',
    category: 'Wood guides',
    title: 'Forest Teak: understanding the material',
    excerpt: 'Look beyond the name to the grain, selection and details that shape a teak door.',
    summary: 'A closer look at teak selection, natural variation and considered door design.',
    paragraphs: [
      'Forest Teak is the name of a teak option in the NordWood door collection. Teak itself is Tectona grandis. The word forest should lead to a conversation about the supplied timber’s documented source; it does not establish a particular country, tree age or quality grade. The most useful comparison begins with the piece you can inspect and the opening where it will be used.',
    ],
    sections: [
      {
        id: 'character',
        title: 'Make room for natural variation',
        paragraphs: [
          'Teak’s golden-brown heartwood darkens with exposure and contrasts with paler sapwood. Its grain is usually straight, sometimes wavy, with a coarse texture and an oily feel. Natural heartwood resistance to decay and relatively small movement are reasons for its use in joinery. Neither characteristic makes a finished door immune to moisture or maintenance needs.',
          'Look at the direction of the grain, the transitions between boards and the balance of the completed design. A broad panel can make a pattern prominent; a more divided arrangement changes how the same timber is read. Those choices give the material a distinct presence without requiring an elaborate profile.',
          'View the sample in daylight and under the lighting planned for the room. Include the frame and handle in that comparison. If several doors appear together along a hallway, review them as a group and agree the degree of colour variation you are comfortable with.',
        ],
      },
      {
        id: 'uses',
        title: 'Choose its place in the plan',
        paragraphs: [
          'Forest Teak is offered here in single and double door configurations. It can be considered for a principal entrance, a room door or an opening intended to become a visual focal point. Start with how you move through that opening. Record which leaf will be used daily, which way it should swing and how close the surrounding furniture sits.',
          'For a door receiving direct sun or rain, share photographs of the approach and overhang. Ask the maker to assess the proposed door construction and coating for that exposure before confirming the selection.',
        ],
      },
      {
        id: 'selection',
        title: 'Keep appearance and specification together',
        paragraphs: [
          'Ask what the supplier means by Forest Teak for the current order and request the relevant source documentation. Confirm the wood selection, panel construction, finished dimensions and any permitted repairs or variation. A higher-sounding trade name is not a substitute for these details. Record the same information for any alternative so your comparison remains meaningful.',
        ],
      },
      {
        id: 'finish-and-care',
        title: 'Finish, fit and keep the details',
        paragraphs: [
          'Ask for the proposed finish on an actual sample and review its sheen from an angle. Have your installer confirm the frame, hinge arrangement and required clearances for the finished door. Settle the timing of installation alongside the rest of the room’s work so a newly finished piece can be protected during completion.',
          'Keep the finish name, colour reference and care instructions together. Clean gently using the recommended method, and check exposed edges as part of ordinary household upkeep. If the door begins rubbing or its finish changes, ask the installer or finisher to assess it before making adjustments.',
        ],
      },
      {
        id: 'before-ordering',
        title: 'A useful final check',
        paragraphs: ['Use the approved sample and the written specification as a pair.'],
        bullets: [
          'What source and species information accompanies this selection?',
          'Which grain and colour variations are included in the approved appearance?',
          'Are the frame, fittings, finish and installation included in the quoted scope?',
        ],
      },
    ],
    takeaway: 'Let the documented timber selection and the finished door details define your choice of Forest Teak.',
    readTime: '3 min read',
    imageKeys: ['wood-forest-teak', 'double-door', 'entry'],
    sources: [references.teakProperties, references.plantation, references.finishing],
    shopCategory: 'Door',
  },
  {
    id: 'imported-teak-guide',
    woodType: 'Imported Teak',
    category: 'Wood guides',
    title: 'Imported Teak: from source to doorway',
    excerpt: 'Understand what an import label tells you, then choose the material for your space.',
    summary: 'Understand the source, compare the sample and plan a well-fitted teak door.',
    paragraphs: [
      'Imported Teak is a supply description used in our door collection. It is not a separate botanical species or a single country of origin. Teak, Tectona grandis, is grown in several parts of the world, including plantations outside its native range. For a useful comparison, connect the catalogue name to the actual species, source, selection and finished product offered for your project.',
    ],
    sections: [
      {
        id: 'character',
        title: 'The sample tells the visual story',
        paragraphs: [
          'Teak combines golden-to-brown heartwood, often streaked, with paler sapwood and a usually straight grain. It has an oily surface character, good heartwood decay resistance and comparatively small movement in service. It can be worked to a smooth finish. Its oily nature makes preparation and adhesive or coating compatibility useful points to settle with the maker.',
          'Import status does not specify one colour or grain pattern. Compare current samples and look at the whole face rather than one attractive detail. If the door will sit beside an existing wooden floor or cabinet, bring that reference into the discussion instead of trying to match from memory.',
          'A simple reference board can include the door sample, wall colour, proposed metalwork and a photograph of the room. Use it to decide whether the door should blend into the space or become a warmer, more visible feature.',
        ],
      },
      {
        id: 'uses',
        title: 'Match the door to everyday use',
        paragraphs: [
          'Teak’s established uses include furniture, cabinetry and joinery. NordWood offers Imported Teak in single and double doors, so begin with the configuration and dimensions your opening needs. A double entrance invites a different discussion about leaf sizes, handles and everyday access from a single bedroom door. Make those decisions before comparing prices across wood options.',
          'For an exterior location, include the amount of shelter and the direction of weather exposure in your brief. Have the supplier confirm the suitability of the complete assembly, including finish and fittings.',
        ],
      },
      {
        id: 'selection',
        title: 'Ask precise questions about supply',
        paragraphs: [
          'Request the botanical name and documented country of origin for the supplied material. Trade names sometimes overlap, so a familiar word alone is not a full identification. Ask how the timber has been selected and seasoned, and which source records are available. If a certification is important to the project, request the applicable documentation for the actual product.',
        ],
      },
      {
        id: 'finish-and-care',
        title: 'Complete the handover thoughtfully',
        paragraphs: [
          'Agree a finish sample, installation plan and care method before the door arrives. Keep a written record of the selected size, finished thickness, hardware and included work. On delivery, compare the door with the agreed selection and ask the installer to review its fit before any final adjustment or finishing work.',
          'After installation, use the cleaning products recommended for the chosen coating. Check that handles and hinges remain secure and that the door opens comfortably. Keep an offcut or approved sample if available; it provides a useful reference when planning adjacent joinery or discussing a future touch-up.',
        ],
      },
      {
        id: 'before-ordering',
        title: 'Keep the comparison consistent',
        paragraphs: ['Compare the same configuration and measured requirement across each teak option.'],
        bullets: [
          'What species, source and current selection does Imported Teak describe?',
          'Does the quotation include the agreed finish and hardware?',
          'What are the delivery, fitting and ongoing care arrangements?',
        ],
      },
    ],
    takeaway: 'Treat imported as the start of a sourcing conversation, then choose by the material and door specification.',
    readTime: '3 min read',
    imageKeys: ['wood-imported-teak', 'single-door', 'workshop'],
    sources: [references.teakProperties, references.teak, references.names],
    shopCategory: 'Door',
  },
  {
    id: 'malaysian-saal-guide',
    woodType: 'Malaysian Saal',
    category: 'Wood guides',
    title: 'Malaysian Saal: choosing timber for a frame',
    excerpt: 'A practical guide to the material, dimensions and finish around an opening.',
    summary: 'A frame-focused guide to timber identity, selection and fitting details.',
    paragraphs: [
      'Malaysian Saal is a trade name used for a frame option in the NordWood catalogue. A trade name alone does not establish the botanical species, and it should not be assumed to mean the same timber as Indian sal, Shorea robusta. Begin by confirming what the supplied material is. Then consider the frame as a complete piece of joinery, with its own dimensions, finish and installation details.',
    ],
    sections: [
      {
        id: 'character',
        title: 'Look at the material around the door',
        paragraphs: [
          'There is no single verified grain, hardness or durability profile that can be assigned to this catalogue label. Malaysian timber references distinguish many separate woods, each with its own appearance and working properties. Once the species is identified, the useful characteristics to compare are movement with moisture, machining quality, fixing performance and suitability for the intended exposure.',
          'The frame is often the narrowest wooden surface in a doorway, but it outlines the entire opening. Review a current sample beside the proposed door leaf and wall finish. Ask to see both an unfinished and a finished face when available. This gives you a better basis for selecting colour and sheen than the trade name or a photograph alone.',
          'Decide whether the frame should closely match the door or form a deliberate border. Include any architrave, skirting or adjacent window surround in the same view. A simple sketch helps keep those relationships clear.',
        ],
      },
      {
        id: 'uses',
        title: 'Start with the frame requirement',
        paragraphs: [
          'In this collection, Malaysian Saal is a material to consider for door frames. Discuss the door that the frame will carry, its hardware and the surrounding wall construction. For an existing opening, photographs of both sides are useful. For a new opening, ask your carpenter to distinguish the wall opening, frame dimensions and finished clear passage in the drawing.',
          'Any proposal for a wet, exposed or more demanding location should be reviewed against the identified species and the actual assembly. Avoid borrowing performance figures from another timber with a similar name.',
        ],
      },
      {
        id: 'selection',
        title: 'Confirm the timber and the section',
        paragraphs: [
          'Ask for the botanical or recognised commercial species name, origin information and selection details. Malaysian timber references cover many different species with different properties; the location in a trade label cannot supply those details. For the frame itself, record the section size, rebate, overall dimensions and any joints. Request current photographs showing the lengths proposed for the work.',
        ],
      },
      {
        id: 'finish-and-care',
        title: 'Make fitting part of the specification',
        paragraphs: [
          'Wood responds to changes in moisture, so ask the installer to assess the timber and site before fitting. Agree the fixing arrangement, door clearances and finishing sequence. Have the supplier identify any treatment already applied and recommend a compatible coating for the confirmed species and location.',
          'At handover, keep the coating reference and care instructions. Dust the frame with a soft cloth and attend to water around the threshold. During normal cleaning, check the lower ends, joints and hinge area. Small changes are easier to discuss when you can refer back to the original installation photographs.',
        ],
      },
      {
        id: 'before-ordering',
        title: 'Three details to settle first',
        paragraphs: ['A precise frame enquiry includes the material identity and a labelled drawing.'],
        bullets: [
          'Which species is supplied under the Malaysian Saal name?',
          'What are the frame section, rebate and finished opening dimensions?',
          'What seasoning, treatment, finish and installation work is included?',
        ],
      },
    ],
    takeaway: 'Confirm the species behind the trade name, then specify the frame around the door and its location.',
    readTime: '3 min read',
    imageKeys: ['wood-malaysian-saal', 'door-frame', 'window-frame'],
    sources: [references.names, references.malaysianTimbers, references.handbook],
    shopCategory: 'DoorFrame',
  },
  {
    id: 'kapoor-sal-guide',
    woodType: 'Kapoor Sal',
    category: 'Wood guides',
    title: 'Kapoor Sal: a closer look at frame selection',
    excerpt: 'Understand the name and the practical details that make a considered frame choice.',
    summary: 'Explore the trade name, inspect the timber and plan a precise frame.',
    paragraphs: [
      'Kapoor Sal is the name of a frame option in the NordWood collection. Confirm the supplied species before applying a technical description to it. Malaysian references use kapur for timbers from Dryobalanops species; this does not by itself establish that every product sold as Kapoor Sal is that timber. A clear material identification makes the remaining decisions about use, processing and finish much more useful.',
    ],
    sections: [
      {
        id: 'character',
        title: 'Read the actual timber',
        paragraphs: [
          'Where the material is confirmed as kapur, FRIM describes reddish-brown heartwood with clearly lighter yellow-brown sapwood. The texture is moderately coarse and even, and the grain can be straight or interlocked. Kapur is classed as a medium hardwood in Malaysian timber references. Its substantial appearance can make a simple frame feel clearly defined beside a quieter wall.',
          'Working properties vary within the group: cutting and planing can range from moderately easy to somewhat difficult. This is a practical reason to review the machined sample, especially the rebate and visible arrises, alongside the door leaf. Judge the finish after preparation as well as the raw timber colour.',
          'For confirmed kapur, FRIM notes a tendency toward surface checking and end splitting. This makes inspection of the actual lengths and their drying condition a useful part of selection, especially near the joints and ends that will be worked.',
        ],
      },
      {
        id: 'uses',
        title: 'Consider the complete opening',
        paragraphs: [
          'FRIM lists kapur uses that include door and window frames, furniture and heavy-duty flooring. These help explain its place in practical joinery. In this collection, consider Kapoor Sal for a door frame using the confirmed timber identity and the requirements of the opening. Durability information should be matched to the actual species and exposure.',
          'Share the door configuration, hardware proposal and wall construction. Include whether the opening is internal, sheltered or exposed to weather. Ask the installer to coordinate the frame section, rebate and fixing details with the door that will be fitted into it.',
        ],
      },
      {
        id: 'selection',
        title: 'Ask about preparation and treatment',
        paragraphs: [
          'Request the seasoning information and review the lengths for the agreed selection. FRIM describes kapur as difficult to treat with preservatives, so a treatment claim needs detail about the actual process and supplied material. Ask what has been done, why it suits the intended use and what documents accompany it. Do not infer treatment from colour or smell.',
        ],
      },
      {
        id: 'finish-and-care',
        title: 'Give the finish a clear brief',
        paragraphs: [
          'Discuss the desired appearance and exposure with the finisher, then approve a sample of the proposed coating system. Confirm how cut ends, rebates and hardware recesses will be handled during fitting. Keep the sequence of carpentry and finishing clear so everyone knows which surfaces need attention before the frame is closed into the surrounding work.',
          'For upkeep, follow the chosen finish’s cleaning and renewal instructions. Keep the lower frame area free from standing water, and look over joints and exposed edges during routine cleaning. Record any visible change with a photograph before requesting advice from the installer or finisher.',
        ],
      },
      {
        id: 'before-ordering',
        title: 'Questions that make the order clearer',
        paragraphs: ['Keep the answers with the approved frame drawing.'],
        bullets: [
          'What botanical or recognised species name identifies this Kapoor Sal?',
          'How have the lengths been dried, selected and inspected?',
          'What finish, treatment and fitting details suit this particular opening?',
        ],
      },
    ],
    takeaway: 'Identify the material first, then review its preparation and the complete frame specification.',
    readTime: '3 min read',
    imageKeys: ['wood-kapoor-sal', 'door-frame', 'detail'],
    sources: [references.kapur, references.kapurUses, references.finishing],
    shopCategory: 'DoorFrame',
  },
  {
    id: 'desi-sal-guide',
    woodType: 'Desi Sal',
    category: 'Wood guides',
    title: 'Desi Sal: planning a considered timber frame',
    excerpt: 'Get to know sal, then bring its selection, fitting and finish into the same plan.',
    summary: 'Sal frames, with attention to seasoning, fit and finish.',
    paragraphs: [
      'Sal is the common name associated with Shorea robusta, a tree native to the Indian subcontinent. Desi Sal is the name used for this frame option in the NordWood catalogue. Confirm the actual species and source when discussing an order; the word desi does not establish a particular region, grade or condition. For a frame, the timber choice and the carpentry specification belong in the same conversation.',
    ],
    sections: [
      {
        id: 'character',
        title: 'A material to see in context',
        paragraphs: [
          'Sal is a hard, heavy wood with brown heartwood and a lighter, narrow sapwood band. Its grain is commonly interlocked, sometimes producing a ribbon-like figure, and the texture is coarse. These visible qualities give it a different character from a fine, uniform-looking timber. A finished sample shows how that texture will read along the frame.',
          'FAO’s timber assessment describes sal as dense, durable and slow to season. Its history in construction reflects that robust material character, while careful preparation remains important for fitted joinery. The practical appeal is a substantial frame whose proportions and finish can be kept simple. Judge the actual selection beside the door it will surround.',
          'If nearby windows or skirting will also be timber, include them in a wider photograph. Matching every surface exactly is not essential to a coherent room, but the relationship should be intentional. Approve the sample under the lighting in which you will usually see it.',
        ],
      },
      {
        id: 'uses',
        title: 'Give the frame its own brief',
        paragraphs: [
          'Consider Desi Sal for the door-frame requirements listed in this collection. Begin with the door leaf, its configuration and the wall opening. The frame needs its own dimensions and details even when it is ordered alongside a door. Ask the carpenter to show the section, rebate and finished clear opening in one labelled drawing.',
          'For a main entrance, add information about shelter, sunlight and rain. For a renovation, include photographs of the existing opening and surrounding finishes. These details allow the supplier and installer to assess the proposed material and assembly for the actual location.',
        ],
      },
      {
        id: 'selection',
        title: 'Make seasoning part of the discussion',
        paragraphs: [
          'Wood exchanges moisture with its surroundings, and changes in moisture can affect dimensions. Ask how the proposed frame lengths have been seasoned and how their readiness for the site will be checked. Inspect the current material with the supplier, including the ends and joint positions. Agree what condition and visible variation are acceptable before the frame is prepared.',
        ],
      },
      {
        id: 'finish-and-care',
        title: 'Plan the work around installation',
        paragraphs: [
          'Settle the finishing sequence with the carpenter and finisher. Ask which surfaces will be coated before fitting, how fresh cuts will be handled and what protection is needed while other work continues. Choose the appearance from a finished sample and keep the product reference with the order. Any treatment included should be described separately from the decorative finish.',
          'During everyday use, clean according to the coating instructions and keep water from collecting around the lower ends of the frame. Check the hinge area, joints and door clearance from time to time. If something changes, a short description and a photograph help the installer assess it without unnecessary adjustment.',
        ],
      },
      {
        id: 'before-ordering',
        title: 'Bring the specification together',
        paragraphs: ['Keep the wood selection, drawing and finish sample together through the project.'],
        bullets: [
          'What species, source and timber selection are being supplied?',
          'How are seasoning and suitability for the installation site confirmed?',
          'Are the frame dimensions, finish, fittings and installation scope agreed?',
        ],
      },
    ],
    takeaway: 'Choose Desi Sal with a clear frame drawing, an inspected timber selection and an agreed finishing plan.',
    readTime: '3 min read',
    imageKeys: ['wood-desi-sal', 'door-frame', 'workshop'],
    sources: [references.salProperties, references.salSeasoning, references.handbook],
    shopCategory: 'DoorFrame',
  },
];
