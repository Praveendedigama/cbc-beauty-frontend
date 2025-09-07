import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingCartIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { getProductImage } from '../utils/imageMapper';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        navigate('/cart');
    };

    const handleCardClick = () => {
        navigate(`/products/${product.productId}`);
    };

    const discountPercentage = product.lastPrice < product.price
        ? Math.round(((product.price - product.lastPrice) / product.price) * 100)
        : 0;

    return (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="relative">
                <img
                    src={getProductImage(product)}
                    alt={product.productName}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        -{discountPercentage}%
                    </div>
                )}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.productName}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-amber-600">
                            ${product.lastPrice.toFixed(2)}
                        </span>
                        {product.lastPrice < product.price && (
                            <span className="text-sm text-gray-500 line-through">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                    </span>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={handleBuyNow}
                        disabled={product.stock === 0}
                        className="flex-1 bg-white hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 border-2 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                    >
                        <CreditCardIcon className="h-4 w-4 mr-2" />
                        Buy Now
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                    >
                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
