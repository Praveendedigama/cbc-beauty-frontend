# 🌟 CBC Beauty - Frontend

A modern, responsive e-commerce frontend for CBC Beauty built with React, Vite, and Tailwind CSS.

## ✨ Features

- 🛍️ **Product Catalog** - Browse beauty products with high-quality images
- 🛒 **Shopping Cart** - Add/remove items, quantity management
- 👤 **User Authentication** - Registration, login, and user profiles
- 💳 **Payment Integration** - Stripe payment processing
- 📱 **Responsive Design** - Works perfectly on all devices
- 🖼️ **Image Upload** - Supabase integration for product images
- 📦 **Order Management** - Track orders with detailed status updates
- 👨‍💼 **Admin Dashboard** - Manage products, orders, and users
- 🔔 **Real-time Notifications** - Toast notifications for user feedback

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Supabase** - Image storage and management
- **Stripe** - Payment processing
- **Heroicons** - Beautiful SVG icons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cbc-beauty-frontend.git
   cd cbc-beauty-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   VITE_BACKEND_URL=https://cbc-beauty-backend.onrender.com
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── AddProductForm.jsx
│   ├── AdminOrderManagement.jsx
│   ├── CartPage.jsx
│   ├── Header.jsx
│   ├── ImageUpload.jsx
│   └── ...
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── LoginPage.jsx
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ToastContext.jsx
├── services/           # API services
│   ├── api.js
│   ├── orderService.js
│   └── paymentService.js
├── utils/              # Utility functions
│   └── imageMapper.js
└── config/             # Configuration files
    └── supabase.js
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_BACKEND_URL` | Backend API URL | Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

### Supabase Setup

1. Create a Supabase project
2. Create a storage bucket named `product-images`
3. Set up Row Level Security policies
4. Add your Supabase URL and key to environment variables

### Stripe Setup

1. Create a Stripe account
2. Get your publishable key from the dashboard
3. Add it to your environment variables

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

2. **Add Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Use production URLs for backend and Supabase

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Run linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/YOUR_USERNAME/cbc-beauty-frontend/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🎯 Roadmap

- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add product search and filtering
- [ ] Implement user profiles
- [ ] Add order history
- [ ] Implement email notifications
- [ ] Add multi-language support

---

**🌟 Built with ❤️ for CBC Beauty**