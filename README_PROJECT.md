# NordWood - Premium Wood Ecommerce Website

A modern, responsive ecommerce website built with React and Vite, featuring premium wood products like doors, door frames, windows, and window frames.

## 🚀 Features

### Core Features
- **Home Page**: Hero section, featured products showcase, category overview, and call-to-action sections
- **Shop Page**: Navigate category → wood type → product with size-aware options
- **Product Details**: Comprehensive product pages with specifications, ratings, and related products
- **Shopping Cart**: Add/remove products, adjust quantities, view order summary with tax and shipping calculations
- **Contact Page**: Contact form, business information, FAQ section, and social media links
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

### Product Categories
- 🚪 Doors (Plantation Teak)
- 🏗️ Door Frames (Malaysian Saal, Kapoor Sal, Desi Sal)
- 🪟 Windows (Plantation Teak)
- 🔲 Window Frames (Teak Wood kits)

### Shopping Features
- Filtering by price range and sorting by name, price, or rating
- Sort products by name, price, and rating
- Add to cart with quantity control
- Cart persistence using localStorage
- Order summary with shipping and tax calculations
- Free shipping on orders over ₹5,000
- 30-day money-back guarantee

## 📁 Project Structure

```
NordWood/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Header.jsx       # Navigation header with cart icon
│   │   ├── Header.css
│   │   ├── Footer.jsx       # Footer with links and newsletter
│   │   ├── Footer.css
│   │   ├── ProductCard.jsx  # Product card component
│   │   └── ProductCard.css
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Home page
│   │   ├── Home.css
│   │   ├── Shop.jsx         # Shop page with filters
│   │   ├── Shop.css
│   │   ├── ProductDetail.jsx # Product detail page
│   │   ├── ProductDetail.css
│   │   ├── Contact.jsx      # Contact page
│   │   ├── Contact.css
│   │   ├── Cart.jsx         # Shopping cart page
│   │   └── Cart.css
│   ├── data/
│   │   ├── catalog.js       # Category, wood, family, and size helpers
│   │   ├── products.js      # Product data
│   │   └── specifications.js # Wood types and standard sizes
│   ├── styles/
│   │   └── global.css       # Global styles
│   ├── App.jsx              # Main app with routing
│   ├── App.css
│   ├── main.jsx             # Entry point
├── public/                  # Static assets
├── package.json
├── vite.config.js
└── index.html
```

## 🎨 Design & Styling

- **Color Scheme**: Forest green, limestone, clay, and brass
- **Typography**: Editorial serif display type paired with a compact sans-serif UI
- **Layout**: Asymmetric showroom layouts with responsive grids and numbered catalog stages

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite (Fast development and production builds)
- **Routing**: React Router v7
- **Styling**: CSS3 with modern layouts (Grid, Flexbox)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: localStorage for cart persistence
- **Package Manager**: npm

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Getting Started

1. **Navigate to project directory**:
   ```bash
   cd /Users/vikram/Desktop/NordWood
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   npm install react-router-dom
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173/`

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔧 Customization Guide

### Adding New Products
Edit `src/data/products.js`:
```javascript
{
  id: 9,
  name: 'Product Name',
  category: 'Door', // or DoorFrame, Window, WindowFrame
  price: 299.99,
  image: 'https://image-url.jpg',
  description: 'Product description',
  details: 'Detailed specifications',
  rating: 4.5
}
```

### Changing Colors
Update colors in component CSS files:
- Primary color: `#2c3e50` → Your color
- Accent color: `#f39c12` → Your color
- Dark color: `#1a1a1a` → Your color

### Updating Company Info
Edit Footer and Contact page for:
- Company name and logo
- Contact details
- Social media links
- Address and phone

### Adding New Pages
1. Create component in `src/pages/YourPage.jsx`
2. Create styles in `src/pages/YourPage.css`
3. Add route in `App.jsx`:
   ```jsx
   <Route path="/your-page" element={<YourPage />} />
   ```
4. Add link in `Header.jsx` navigation

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🎯 Key Components Explained

### Header
- Sticky navigation bar with logo and menu links
- Catalog navigation and cart icon with item counter
- Mobile hamburger menu

### ProductCard
- Product image with hover overlay
- Product name, category badge, and description
- Rating display with star icons
- Price and "Add to Cart" button

### Shop Page
- Category → wood type → product navigation
- Price filters and product sorting controls
- Sort options (name, price, rating)
- Product grid with responsive layout
- Real-time filtering and sorting

### Cart Page
- Detailed cart table with product images
- Quantity adjustment controls
- Order summary with calculations
- Shipping cost determination
- Tax calculation (18% GST)

## 🔒 Features & Security

- localStorage for secure client-side cart storage
- No sensitive data stored
- SSL-ready for secure checkout integration
- Form validation for contact submissions

## 📈 SEO & Performance

- Semantic HTML structure
- Optimized images from Unsplash
- Fast load times with Vite
- Mobile-responsive design for better rankings

## 🚀 Future Enhancements

Potential features to add:
- User authentication and accounts
- Wishlist functionality
- Product reviews and ratings system
- Payment gateway integration (Stripe, PayPal)
- Order tracking system
- Admin dashboard for product management
- Search functionality with autocomplete
- Email notifications
- Newsletter subscription
- Multi-language support
- Dark mode toggle

## 💡 Tips for Further Development

1. **Backend Integration**: Connect to a backend API for product data
2. **Payment Processing**: Integrate Stripe or PayPal for real transactions
3. **Database**: Set up Firebase or MongoDB for product and order storage
4. **Analytics**: Add Google Analytics for traffic tracking
5. **Performance**: Use React.lazy() for code splitting
6. **Testing**: Add Jest and React Testing Library

## 📝 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open-source and available for personal or commercial use.

## 📧 Support

For questions or issues, please refer to the Contact page in the application.

---

**Built with ❤️ for NordWood - Premium Wood Products**
