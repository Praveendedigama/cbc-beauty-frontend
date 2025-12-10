import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { getProductImage, getProductImages } from '../utils/imageMapper';
import {
    ShoppingCartIcon,
    HeartIcon,
    StarIcon,
    ArrowLeftIcon,
    TruckIcon,
    ShieldCheckIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getById(productId);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product && product.stock > 0) {
            addToCart(product, quantity);
            // Show success message or notification
        }
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const discountPercentage = product?.lastPrice < product?.price
        ? Math.round(((product.price - product.lastPrice) / product.price) * 100)
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={getProductImage(product)}
                                    alt={product.productName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {getProductImages(product).length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {getProductImages(product).map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-amber-500' : 'border-gray-200'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.productName} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {product.productName}
                                </h1>

                                {product.altNames && product.altNames.length > 0 && (
                                    <p className="text-gray-600 mb-4">
                                        Also known as: {product.altNames.join(', ')}
                                    </p>
                                )}

                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-3xl font-bold text-amber-600">
                                            Rs.{product.lastPrice.toFixed(2)}
                                        </span>
                                        {product.lastPrice < product.price && (
                                            <span className="text-xl text-gray-500 line-through">
                                                Rs.{product.price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {discountPercentage > 0 && (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                                            -{discountPercentage}% OFF
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                                        4.8 (124 reviews)
                                    </span>
                                    <span>Stock: {product.stock} units</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            -
                                        </button>
                                        <span className="w-16 text-center font-medium">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= product.stock}
                                            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                                    >
                                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>

                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`px-4 py-3 rounded-lg border-2 flex items-center justify-center transition-colors shadow-md hover:shadow-lg ${isWishlisted
                                            ? 'border-rose-500 text-rose-500 bg-rose-50'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <HeartIcon className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <TruckIcon className="h-5 w-5 text-amber-600" />
                                    <span className="text-sm text-gray-600">Free Delivery</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <ShieldCheckIcon className="h-5 w-5 text-amber-600" />
                                    <span className="text-sm text-gray-600">Quality Guaranteed</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <ArrowPathIcon className="h-5 w-5 text-amber-600" />
                                    <span className="text-sm text-gray-600">Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
