import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import SimpleImageUpload from './SimpleImageUpload';

const AddProductForm = ({ onClose, onProductAdded }) => {
    const [formData, setFormData] = useState({
        productId: '',
        productName: '',
        altNames: '',
        images: [],
        price: '',
        lastPrice: '',
        stock: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleImageUpload = (uploadedImages) => {
        setFormData(prev => ({
            ...prev,
            images: Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages]
        }));
    };

    const handleImageRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate required fields
            if (!formData.productId || !formData.productName || !formData.price || !formData.lastPrice || !formData.stock || !formData.description) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            // Prepare data for API
            const productData = {
                productId: formData.productId,
                productName: formData.productName,
                altNames: formData.altNames ? formData.altNames.split(',').map(name => name.trim()) : [],
                images: formData.images, // Already an array from ImageUpload
                price: parseFloat(formData.price),
                lastPrice: parseFloat(formData.lastPrice),
                stock: parseInt(formData.stock),
                description: formData.description
            };

            // Call the parent component's function to add the product
            await onProductAdded(productData);

            // Reset form
            setFormData({
                productId: '',
                productName: '',
                altNames: '',
                images: [],
                price: '',
                lastPrice: '',
                stock: '',
                description: ''
            });

            onClose();
        } catch (error) {
            setError(error.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
                                Product ID *
                            </label>
                            <input
                                type="text"
                                id="productId"
                                name="productId"
                                value={formData.productId}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="e.g., CB001"
                            />
                        </div>

                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="e.g., Hydrating Face Cream"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="altNames" className="block text-sm font-medium text-gray-700 mb-2">
                            Alternative Names
                        </label>
                        <input
                            type="text"
                            id="altNames"
                            name="altNames"
                            value={formData.altNames}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Separate multiple names with commas"
                        />
                        <p className="text-xs text-gray-500 mt-1">e.g., Moisturizer, Hydrating Cream, Anti-Aging Serum</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images
                        </label>
                        <SimpleImageUpload
                            onImageUploaded={handleImageUpload}
                            multiple={true}
                            maxImages={5}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Upload up to 5 product images. Supported formats: PNG, JPG, GIF (max 10MB each)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Original Price *
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastPrice" className="block text-sm font-medium text-gray-700 mb-2">
                                Sale Price *
                            </label>
                            <input
                                type="number"
                                id="lastPrice"
                                name="lastPrice"
                                value={formData.lastPrice}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Describe the product..."
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Adding...
                                </>
                            ) : (
                                'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;
