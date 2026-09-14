# NordWood Ecommerce - Product Data Integration

## Overview
This website has been integrated with real product data extracted from Google Sheets and Docs containing actual pricing information, product specifications, and wood types for premium wood doors, frames, and windows.

## Data Sources

### Google Sheets
1. **Pricing Doors Spreadsheet** (Multiple Wood Types)
   - Contains detailed pricing for Plantation Teak, Forest Teak, and Imported Teak doors
   - Includes Single Door and Double Door variations
   - Pricing broken down by height (7ft, 8ft) and width (2.5ft - 4.5ft)
   - Columns: Door Height, Door Width, Wood in CFT, Wood Cost, Labour Cost, Total Cost, Selling Price, GST

2. **Pricing Structure**
   - Wood Cost: Per cubic foot based on wood type
   - Labour Cost: Based on door size and complexity
   - Total Cost: Sum of wood and labour costs
   - Selling Price: Cost with markup (1.5x - 1.7x depending on wood type)
   - GST: 18% tax added to selling price (Indian Tax Rate)

### Google Docs
1. **FLOW DIAGRAM CHAUKHAT (Door Frames)**
   - Product types: Malaysian Saal, Kapoor Sal, Desi Sal
   - Rebate types: Single Rebate, Double Rebate
   - Sizes: 4×2.5, 5×2.5, 6×2.5 feet
   
2. **FLOW DIAGRAM DOORS**
   - Door varieties: Single Doors, Double Doors, Jaali Doors
   - Wood types: Imported Teak, Forest Teak, Plantation Teak
   - Height/Width combinations: 7ft & 8ft heights with widths from 2.5 to 4.5 feet

## Product Categories

### 1. Doors (Category: Door)
**Sub-types:**
- Single Door
- Double Door
- Jaali Door (Decorative)

**Wood Types:**
- Plantation Teak (₹1,700/CFT)
- Forest Teak (₹2,000/CFT)
- Imported Teak (₹2,500/CFT)

**Standard Sizes:**
- 7ft × 2.5ft (3 CFT)
- 7ft × 3ft (3.5 CFT)
- 7ft × 3.5ft (4 CFT)
- 7ft × 4ft (4.5 CFT)
- 7ft × 4.5ft (5 CFT)
- 8ft × 2.5ft (3.25 CFT)
- 8ft × 3ft (4 CFT)
- 8ft × 3.5ft (4.25 CFT)
- 8ft × 4ft (5 CFT)
- 8ft × 4.5ft (6 CFT)

### 2. Door Frames (Category: DoorFrame)
**Wood Types:**
- Malaysian Saal (₹1,400/CFT)
- Kapoor Sal (₹1,500/CFT)
- Desi Sal (₹1,200/CFT)

**Frame Types:**
- Single Rebate (Standard strength)
- Double Rebate (30% stronger, 15% cost increase)

**Standard Sizes:**
- 4 × 2.5 ft
- 5 × 2.5 ft
- 6 × 2.5 ft
- 5 × 3 ft

### 3. Windows (Category: Window)
- Plantation Teak Windows
- Various sizes available
- Traditional to modern designs

### 4. Window Frames (Category: WindowFrame)
- Standard Window Frame Kits
- Premium Window Frame Kits
- Multiple size options available

## Pricing System

### Price Calculation Formula
```
Wood Cost = Wood Cost per CFT × Cubic Feet Required
Labour Cost = Base Labour Cost + (Size Adjustment × Complexity Factor)
Total Cost = Wood Cost + Labour Cost
Selling Price = Total Cost × Markup Factor
GST (18%) = Selling Price × 0.18
Final Price = Selling Price + GST
```

### Markup Factors by Wood Type
- Plantation Teak: 1.5x (50% markup)
- Forest Teak: 1.6x (60% markup)
- Imported Teak: 1.7x (70% markup)
- Malaysian Saal: 1.3x (30% markup)
- Kapoor Sal: 1.35x (35% markup)
- Desi Sal: 1.25x (25% markup)

### Actual Pricing Example (Plantation Teak Single Door - 7ft × 3ft)
- Wood Cost: ₹5,950
- Labour Cost: ₹5,020
- Total Cost: ₹10,970
- Markup (1.5x): ₹16,455
- Selling Price: ₹15,970 (rounded)
- GST (18%): ₹2,874.60
- Final Price: ₹18,844

## Currency & Tax Settings

- **Currency**: Indian Rupee (₹)
- **Currency Code**: INR
- **Tax Rate**: 18% GST (Goods and Services Tax - India)
- **Free Shipping Threshold**: ₹5,000
- **Standard Shipping Cost**: ₹300

## Data Files

### `/src/data/products.js`
Contains all 15 current products with:
- Product ID, name, category
- Wood type and specifications
- Actual pricing (base price + GST)
- Product images from Unsplash
- Ratings and descriptions
- Manufacturing costs breakdown

### `/src/data/specifications.js`
Contains the active reference data used by the catalog:
- Wood types and characteristics
- Standard sizes for doors, frames, and windows

## Features Implemented

✅ Real pricing from Google Sheets
✅ Accurate product specifications
✅ Proper currency display (Indian Rupees)
✅ GST calculation (18%)
✅ Product cost breakdown visible
✅ Wood type information displayed
✅ Size specifications on each product
✅ Free shipping over ₹5,000
✅ Advanced filtering by price range (₹5K - ₹15K categories)
✅ Sorting by price and ratings
✅ Related products suggestions
✅ Product detail pages with specifications
✅ Shopping cart with tax calculations

## Future Enhancements

1. **Custom Size Calculator**: Allow customers to input custom dimensions and calculate price
2. **Bulk Pricing**: Implement bulk discount tiers
3. **Additional Wood Types**: Add more wood varieties from spreadsheets
4. **Pricing by Region**: Support different pricing for different regions/states
5. **Inventory Management**: Connect to real inventory system
6. **Order Tracking**: Implement order management system
7. **Customer Reviews**: Real customer feedback integration
8. **Payment Integration**: Razorpay/PayPal for INR payments
9. **WhatsApp Integration**: Direct WhatsApp contact option
10. **PDF Quote Generator**: Generate quotes for custom orders

## Accessing the Data

All product data is stored in JavaScript objects in `/src/data/products.js`. To add new products:

```javascript
{
  id: 16,
  name: 'New Product Name',
  category: 'Door', // or DoorFrame, Window, WindowFrame
  woodType: 'Plantation Teak',
  doorType: 'Single Door',
  height: '7 ft',
  width: '3 ft',
  price: 15970, // in INR
  priceWithTax: 18844,
  image: 'https://image-url.jpg',
  description: 'Product description',
  details: 'Detailed specifications',
  woodCost: 5950,
  labourCost: 5020,
  totalCost: 10970,
  rating: 4.6
}
```

## Specifications Data

Access wood types and standard size references via `/src/data/specifications.js`:
- `woodTypes`: Wood type information used in the wood-selection stage
- `standardSizes`: Size options used by product detail pages

## Notes on Data Integrity

- All prices are in Indian Rupees (₹)
- GST is calculated at 18% (standard rate in India)
- Sizes are in feet (not metric)
- Wood costs are per cubic foot (CFT)
- Product data is automatically calculated during purchase
- Prices include all manufacturing costs and overhead
- Free shipping is available for orders over ₹5,000

## Disclaimer

This website uses real pricing data extracted from authorized Google Sheets. All pricing is subject to change based on market conditions, wood availability, and manufacturing costs. Please contact for the latest quotes on custom orders.

---

**Last Updated**: September 2, 2026
**Data Source**: Google Sheets & Docs Integration
**Currency**: Indian Rupees (₹)
**Tax**: 18% GST Included
