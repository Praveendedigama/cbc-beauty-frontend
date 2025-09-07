import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { useToast } from '../contexts/ToastContext';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { getProductImage } from '../utils/imageMapper';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    TruckIcon,
    EyeIcon,
    CalendarDaysIcon,
    ArrowPathIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

const OrdersPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    useEffect(() => {
        if (user) {
            fetchOrders();
            // Auto-refresh every 30 seconds
            const interval = setInterval(fetchOrders, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchOrders = async (showNotification = false) => {
        try {
            setLoading(true);
            const orders = await orderService.getAllOrders();
            console.log('Fetched orders:', orders);

            // Check for status changes
            if (showNotification && orders.length > 0) {
                const previousOrders = orders;
                // Simple check - in a real app, you'd compare with previous state
                showToast('Order status updated!', 'success');
            }

            setOrders(orders);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'preparing':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'shipped':
                return <TruckIcon className="h-5 w-5 text-blue-500" />;
            case 'delivered':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'cancelled':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter and sort orders
    const getFilteredAndSortedOrders = () => {
        let filteredOrders = orders;

        // Filter by status
        if (selectedFilter !== 'all') {
            filteredOrders = orders.filter(order => order.status === selectedFilter);
        }

        // Sort by newest first (most recent date first)
        return filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const filteredOrders = getFilteredAndSortedOrders();

    // Get order counts for each status
    const getOrderCounts = () => {
        const counts = {
            all: orders.length,
            preparing: orders.filter(order => order.status === 'preparing').length,
            shipped: orders.filter(order => order.status === 'shipped').length,
            delivered: orders.filter(order => order.status === 'delivered').length,
            cancelled: orders.filter(order => order.status === 'cancelled').length
        };
        return counts;
    };

    const orderCounts = getOrderCounts();

    // Handle order details modal
    const handleViewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
        setShowOrderDetails(false);
    };

    // Filter options
    const filterOptions = [
        { value: 'all', label: 'All Orders', icon: FunnelIcon, count: orderCounts.all },
        { value: 'preparing', label: 'Preparing', icon: ClockIcon, count: orderCounts.preparing },
        { value: 'shipped', label: 'Shipped', icon: TruckIcon, count: orderCounts.shipped },
        { value: 'delivered', label: 'Delivered', icon: CheckCircleIcon, count: orderCounts.delivered },
        { value: 'cancelled', label: 'Cancelled', icon: XCircleIcon, count: orderCounts.cancelled }
    ];

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your orders</h2>
                    <a
                        href="/login"
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Login
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

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading orders</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
                            <p className="text-gray-600 mt-2">
                                Track and manage your beauty product orders
                            </p>
                            {lastUpdated && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Last updated: {lastUpdated.toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => fetchOrders(true)}
                            disabled={loading}
                            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 transition-colors"
                        >
                            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ClockIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
                        <p className="text-gray-600 mb-8">
                            Start shopping to see your orders here
                        </p>
                        <a
                            href="/products"
                            className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Order Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ClockIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-600">Preparing</p>
                                        <p className="text-2xl font-bold text-gray-900">{orderCounts.preparing}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <TruckIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-600">Shipped</p>
                                        <p className="text-2xl font-bold text-gray-900">{orderCounts.shipped}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-600">Delivered</p>
                                        <p className="text-2xl font-bold text-gray-900">{orderCounts.delivered}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <FunnelIcon className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                        <p className="text-2xl font-bold text-gray-900">{orderCounts.all}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filter Tabs - Improved Design */}
                        <div className="mb-8">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                                <div className="flex flex-wrap gap-1">
                                    {filterOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => setSelectedFilter(option.value)}
                                                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${selectedFilter === option.value
                                                    ? 'bg-amber-500 text-white shadow-md'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                                    }`}
                                            >
                                                <IconComponent className="h-4 w-4" />
                                                <span>{option.label}</span>
                                                {option.count > 0 && (
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${selectedFilter === option.value
                                                        ? 'bg-white bg-opacity-20 text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                        }`}>
                                                        {option.count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Orders List */}
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FunnelIcon className="h-12 w-12 text-gray-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders found</h2>
                                <p className="text-gray-600 mb-8">
                                    No orders match the selected filter
                                </p>
                                <button
                                    onClick={() => setSelectedFilter('all')}
                                    className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    View All Orders
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                        {/* Order Header */}
                                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(order.status)}
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            Order #{order.orderId}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {formatDate(order.date)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 sm:mt-0 text-right">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        ${order.orderedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {order.orderedItems.length} item{order.orderedItems.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items - Simplified */}
                                        <div className="px-6 py-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {order.orderedItems.slice(0, 3).map((item, index) => (
                                                    <div key={index} className="flex items-center space-x-3">
                                                        <img
                                                            src={getProductImage({ productName: item.name, images: item.image ? [item.image] : [] })}
                                                            alt={item.name}
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                {item.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-600">
                                                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.orderedItems.length > 3 && (
                                                    <div className="flex items-center justify-center text-sm text-gray-500">
                                                        +{order.orderedItems.length - 3} more items
                                                    </div>
                                                )}
                                            </div>

                                            {/* Shipping Info - Simplified */}
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                    <div className="text-sm text-gray-600">
                                                        <p className="font-medium">Shipping to: {order.name}</p>
                                                        <p className="truncate max-w-xs">{order.address}</p>
                                                    </div>
                                                    <div className="mt-2 sm:mt-0">
                                                        <button
                                                            onClick={() => handleViewOrderDetails(order)}
                                                            className="flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
                                                        >
                                                            <EyeIcon className="h-4 w-4 mr-1" />
                                                            View Full Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={showOrderDetails}
                onClose={handleCloseOrderDetails}
            />
        </div>
    );
};

export default OrdersPage;
