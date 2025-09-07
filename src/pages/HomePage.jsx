import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import {
    StarIcon,
    TruckIcon,
    ShieldCheckIcon,
    HeartIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await productsAPI.getAll();
                // Get first 6 products as featured
                setFeaturedProducts(response.data.slice(0, 6));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const features = [
        {
            icon: TruckIcon,
            title: 'Fast Delivery',
            description: 'Get your beauty products delivered within 24 hours'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Quality Guaranteed',
            description: 'Premium beauty products from the best brands'
        },
        {
            icon: HeartIcon,
            title: 'Curated Selection',
            description: 'Hand-picked products by our beauty experts'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Background Image */}
            <section
                className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/beauty-hero-bg.jpg'), url('/hero-bg.jpg'), url('/beauty-bg.jpg'), linear-gradient(135deg, #1f2937 0%, #374151 100%)`
                }}
            >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                        Crystal Beauty
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white drop-shadow-md">
                        Discover the finest selection of beauty products from around the world.
                        Premium quality, exceptional results, delivered to your door.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/products"
                            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Shop Now
                        </Link>
                        <Link
                            to="/products"
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors shadow-lg"
                        >
                            Browse Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="h-8 w-8 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Featured Products
                        </h2>
                        <p className="text-lg text-gray-600">
                            Discover our handpicked selection of premium beauty products
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/products"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
