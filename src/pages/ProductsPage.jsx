import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState('name');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [inStockOnly, setInStockOnly] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [searchQuery]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let response;

            if (searchQuery.trim()) {
                response = await productsAPI.search(searchQuery);
            } else {
                response = await productsAPI.getAll();
            }

            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ search: searchQuery.trim() });
        } else {
            setSearchParams({});
        }
    };

    const handleSort = (sortType) => {
        setSortBy(sortType);
        const sortedProducts = [...products].sort((a, b) => {
            switch (sortType) {
                case 'name':
                    return a.productName.localeCompare(b.productName);
                case 'price-low':
                    return a.lastPrice - b.lastPrice;
                case 'price-high':
                    return b.lastPrice - a.lastPrice;
                case 'stock':
                    return b.stock - a.stock;
                default:
                    return 0;
            }
        });
        setProducts(sortedProducts);
    };

    const applyFilters = () => {
        let filteredProducts = [...products];

        // Price range filter
        if (priceRange.min !== '') {
            filteredProducts = filteredProducts.filter(
                product => product.lastPrice >= parseFloat(priceRange.min)
            );
        }
        if (priceRange.max !== '') {
            filteredProducts = filteredProducts.filter(
                product => product.lastPrice <= parseFloat(priceRange.max)
            );
        }

        // Stock filter
        if (inStockOnly) {
            filteredProducts = filteredProducts.filter(product => product.stock > 0);
        }

        setProducts(filteredProducts);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setPriceRange({ min: '', max: '' });
        setInStockOnly(false);
        fetchProducts();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
                    </h1>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </form>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <FunnelIcon className="h-5 w-5" />
                                Filters
                            </button>

                            <select
                                value={sortBy}
                                onChange={(e) => handleSort(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="stock">Stock: High to Low</option>
                            </select>
                        </div>

                        <p className="text-gray-600">
                            {products.length} product{products.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <div className="w-64 bg-white rounded-lg shadow-md p-6 h-fit">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Price Range */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                                    <div className="space-y-2">
                                        <input
                                            type="number"
                                            placeholder="Min Price"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max Price"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>

                                {/* Stock Filter */}
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={inStockOnly}
                                            onChange={(e) => setInStockOnly(e.target.checked)}
                                            className="mr-2 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                        />
                                        <span className="text-sm text-gray-700">In Stock Only</span>
                                    </label>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={applyFilters}
                                        className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                                    >
                                        Apply
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="flex-1">
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600">
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
