import React from 'react';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { getProductImage } from '../utils/imageMapper';

const ViewProductModal = ({ product, onClose }) => {
    if (!product) return null;

    const discountPercentage = product.lastPrice < product.price
        ? Math.round(((product.price - product.lastPrice) / product.price) * 100)
        : 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={getProductImage(product)}
                                    alt={product.productName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square rounded-lg overflow-hidden border border-gray-200"
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.productName} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {product.productName}
                                </h3>

                                <div className="text-sm text-gray-600 mb-4">
                                    <span className="font-medium">Product ID:</span> {product.productId}
                                </div>

                                {product.altNames && product.altNames.length > 0 && (
                                    <div className="mb-4">
                                        <span className="text-sm font-medium text-gray-700">Alternative Names:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {product.altNames.map((name, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                                >
                                                    {name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl font-bold text-amber-600">
                                            ${product.lastPrice.toFixed(2)}
                                        </span>
                                        {product.lastPrice < product.price && (
                                            <span className="text-lg text-gray-500 line-through">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {discountPercentage > 0 && (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                                            -{discountPercentage}% OFF
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                                        <span>4.8 (124 reviews)</span>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10
                                        ? 'bg-green-100 text-green-800'
                                        : product.stock > 0
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        Stock: {product.stock} units
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Product Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {product.stock}
                                    </div>
                                    <div className="text-sm text-gray-600">In Stock</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {product.images?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Images</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProductModal;
