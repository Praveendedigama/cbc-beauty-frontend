import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI } from '../services/api';
import { orderService } from '../services/orderService';
import AddProductForm from '../components/AddProductForm';
import EditProductForm from '../components/EditProductForm';
import ViewProductModal from '../components/ViewProductModal';
import AdminOrderManagement from '../components/AdminOrderManagement';
import { getProductImage } from '../utils/imageMapper';
import OrderDetailsModal from '../components/OrderDetailsModal';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ChartBarIcon,
    ShoppingBagIcon,
    CubeIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

const AdminPage = () => {
    const { user, isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [showViewProduct, setShowViewProduct] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('User:', user);
        console.log('Is Admin:', isAdmin());
        if (isAdmin()) {
            fetchData();
        }
    }, [isAdmin, user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const [productsResponse, ordersData] = await Promise.all([
                productsAPI.getAll(),
                orderService.getAllOrders()
            ]);
            console.log('Products response:', productsResponse.data);
            console.log('Orders data:', ordersData);
            setProducts(productsResponse.data);
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productsAPI.delete(productId);
                setProducts(products.filter(p => p.productId !== productId));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };


    const handleAddProduct = async (productData) => {
        try {
            console.log('Adding product with data:', productData);
            const response = await productsAPI.create(productData);
            console.log('Product creation response:', response);
            if (response.data.message === 'Product created') {
                // Refresh the products list
                await fetchData();
                console.log('Product added successfully');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            console.error('Error response:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to add product');
        }
    };

    const handleEditProduct = (product) => {
        console.log('Editing product:', product);
        setEditingProduct(product);
        setShowEditProduct(true);
    };

    const handleViewProduct = (product) => {
        console.log('Viewing product:', product);
        setViewingProduct(product);
        setShowViewProduct(true);
    };

    const handleViewOrder = (order) => {
        console.log('Viewing order:', order);
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleUpdateProduct = async (productId, productData) => {
        try {
            const response = await productsAPI.update(productId, productData);
            if (response.data.message === 'Product updated') {
                // Refresh the products list
                await fetchData();
            }
        } catch (error) {
            console.error('Error updating product:', error);
            throw new Error(error.response?.data?.message || 'Failed to update product');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'preparing':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!user || !isAdmin()) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">
                        You need admin privileges to access this page
                    </p>
                    <a
                        href="/"
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {showAddProduct && (
                <AddProductForm
                    onClose={() => setShowAddProduct(false)}
                    onProductAdded={handleAddProduct}
                />
            )}
            {showEditProduct && editingProduct && (
                <EditProductForm
                    product={editingProduct}
                    onClose={() => {
                        setShowEditProduct(false);
                        setEditingProduct(null);
                    }}
                    onProductUpdated={handleUpdateProduct}
                />
            )}
            {showViewProduct && viewingProduct && (
                <ViewProductModal
                    product={viewingProduct}
                    onClose={() => {
                        setShowViewProduct(false);
                        setViewingProduct(null);
                    }}
                />
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Crystal Beauty Admin</h1>
                    <p className="text-gray-600 mt-2">
                        Manage beauty products, orders, and store settings
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <CubeIcon className="h-6 w-6 text-amber-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ChartBarIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Revenue</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    Rs.{orders.reduce((sum, order) =>
                                        sum + order.orderedItems.reduce((orderSum, item) =>
                                            orderSum + (item.price * item.quantity), 0), 0
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products'
                                    ? 'border-amber-500 text-amber-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Products
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders'
                                    ? 'border-amber-500 text-amber-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Orders
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                {error}
                                <button
                                    onClick={fetchData}
                                    className="ml-4 text-red-800 underline hover:text-red-900"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                        {activeTab === 'products' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                                        <p className="text-sm text-gray-600">Total: {products.length} products</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddProduct(true)}
                                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Add Product
                                    </button>
                                </div>


                                {products.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CubeIcon className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                        <p className="text-gray-600 mb-8">
                                            Get started by adding your first product
                                        </p>
                                        <button
                                            onClick={() => setShowAddProduct(true)}
                                            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                                        >
                                            Add Your First Product
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Beauty Products List</h3>
                                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                                Manage your beauty product inventory
                                            </p>
                                        </div>
                                        <ul className="divide-y divide-gray-200">
                                            {products.map((product) => (
                                                <li key={product._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                                                    <div className="relative">
                                                        {/* Stock count in top right corner */}
                                                        <div className="absolute top-0 right-0">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.stock > 10
                                                                ? 'bg-green-100 text-green-800'
                                                                : product.stock > 0
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {product.stock} in stock
                                                            </span>
                                                        </div>

                                                        {/* Clickable product area */}
                                                        <div
                                                            className="flex items-center justify-between cursor-pointer"
                                                            onClick={() => handleViewProduct(product)}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0">
                                                                    <img
                                                                        className="h-12 w-12 rounded-lg object-cover"
                                                                        src={getProductImage(product)}
                                                                        alt={product.productName}
                                                                    />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {product.productName}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        ID: {product.productId}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center space-x-4">
                                                                <div className="text-right">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        Rs.{product.lastPrice.toFixed(2)}
                                                                    </div>
                                                                    {product.lastPrice < product.price && (
                                                                        <div className="text-sm text-gray-500 line-through">
                                                                            Rs.{product.price.toFixed(2)}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Action buttons */}
                                                                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                                                                    <button
                                                                        onClick={() => handleEditProduct(product)}
                                                                        className="inline-flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                        title="Edit Product"
                                                                    >
                                                                        <PencilIcon className="h-5 w-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteProduct(product.productId)}
                                                                        className="inline-flex items-center justify-center w-10 h-10 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                                                        title="Delete Product"
                                                                    >
                                                                        <TrashIcon className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <AdminOrderManagement />
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAddProduct && (
                <AddProductForm
                    onClose={() => setShowAddProduct(false)}
                    onProductAdded={handleAddProduct}
                />
            )}

            {showEditProduct && editingProduct && (
                <EditProductForm
                    product={editingProduct}
                    onClose={() => {
                        setShowEditProduct(false);
                        setEditingProduct(null);
                    }}
                    onProductUpdated={handleUpdateProduct}
                />
            )}

            {showViewProduct && viewingProduct && (
                <ViewProductModal
                    product={viewingProduct}
                    onClose={() => {
                        setShowViewProduct(false);
                        setViewingProduct(null);
                    }}
                />
            )}

            {showOrderDetails && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    isOpen={showOrderDetails}
                    onClose={() => {
                        setShowOrderDetails(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminPage;
