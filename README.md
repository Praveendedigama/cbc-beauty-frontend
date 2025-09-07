# Crystal Beauty Frontend

A modern React frontend for the Crystal Beauty e-commerce application.

## Features

- **User Authentication**: Login, registration, and Google OAuth integration
- **Product Management**: Browse, search, and filter beauty products
- **Shopping Cart**: Add/remove items, quantity management
- **Order Management**: View order history and status
- **Admin Dashboard**: Manage products and orders
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 5000

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd CBC-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── ProductCard.jsx # Product display card
│   └── AddProductForm.jsx # Admin product form
├── contexts/           # React contexts for state management
│   ├── AuthContext.jsx # Authentication state
│   └── CartContext.jsx # Shopping cart state
├── pages/              # Main application pages
│   ├── HomePage.jsx    # Landing page
│   ├── ProductsPage.jsx # Product listing
│   ├── ProductDetailPage.jsx # Product details
│   ├── CartPage.jsx    # Shopping cart
│   ├── OrdersPage.jsx  # Order history
│   ├── LoginPage.jsx   # User login
│   ├── RegisterPage.jsx # User registration
│   └── AdminPage.jsx   # Admin dashboard
├── services/           # API services
│   └── api.js         # Axios configuration and API calls
└── App.jsx            # Main application component
```

## API Integration

The frontend communicates with the backend API running on `http://localhost:5000`. The API endpoints include:

- **Authentication**: `/api/users/login`, `/api/users/register`
- **Products**: `/api/products` (GET, POST, PUT, DELETE)
- **Orders**: `/api/orders` (GET, POST, PUT)

## Key Features

### Authentication
- User registration and login
- JWT token-based authentication
- Protected routes for authenticated users
- Admin role-based access control

### Product Management
- Product listing with search and filters
- Product detail pages with image galleries
- Admin product creation and management
- Real-time stock updates

### Shopping Cart
- Add/remove products
- Quantity management
- Persistent cart storage
- Real-time total calculations

### Order Management
- Order creation and tracking
- Order history for customers
- Admin order management
- Status updates and notes

## Technologies Used

- **React 19** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Heroicons** - Icon library
- **Vite** - Build tool and development server

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist` folder contains the production-ready files

3. Deploy the `dist` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.