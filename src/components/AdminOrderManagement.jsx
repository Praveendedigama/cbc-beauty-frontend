import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { useToast } from '../contexts/ToastContext';
import {
    CalendarDaysIcon,
    ClockIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    PencilIcon
} from '@heroicons/react/24/outline';

const AdminOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [notes, setNotes] = useState('');
    const { showToast } = useToast();

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'yellow', icon: ClockIcon },
        { value: 'processing', label: 'Processing', color: 'blue', icon: CalendarDaysIcon },
        { value: 'shipped', label: 'Shipped', color: 'purple', icon: TruckIcon },
        { value: 'delivered', label: 'Delivered', color: 'green', icon: CheckCircleIcon },
        { value: 'cancelled', label: 'Cancelled', color: 'red', icon: XCircleIcon }
    ];

    useEffect(() => {
        fetchOrders();
    }, [selectedPeriod]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const allOrders = await orderService.getAllOrders();

            // Filter orders based on selected period
            const filteredOrders = filterOrdersByPeriod(allOrders, selectedPeriod);
            setOrders(filteredOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterOrdersByPeriod = (orders, period) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (period) {
            case 'today':
                return orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= today;
                });
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= weekAgo;
                });
            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= monthAgo;
                });
            case 'all':
            default:
                return orders;
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedOrder || !newStatus) return;

        try {
            await orderService.updateOrder(selectedOrder.orderId, {
                status: newStatus,
                notes: notes
            });

            showToast(`Order ${selectedOrder.orderId} status updated to ${newStatus}`, 'success');

            // Update local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === selectedOrder.orderId
                        ? { ...order, status: newStatus, notes: notes }
                        : order
                )
            );

            setShowUpdateModal(false);
            setSelectedOrder(null);
            setNewStatus('');
            setNotes('');
        } catch (error) {
            console.error('Error updating order:', error);
            showToast('Failed to update order status', 'error');
        }
    };

    const getStatusColor = (status) => {
        const statusConfig = statusOptions.find(option => option.value === status);
        return statusConfig ? statusConfig.color : 'gray';
    };

    const getStatusIcon = (status) => {
        const statusConfig = statusOptions.find(option => option.value === status);
        return statusConfig ? statusConfig.icon : ClockIcon;
    };

    const getOrderStats = () => {
        const stats = {
            total: orders.length,
            pending: orders.filter(order => order.status === 'pending').length,
            processing: orders.filter(order => order.status === 'processing').length,
            shipped: orders.filter(order => order.status === 'shipped').length,
            delivered: orders.filter(order => order.status === 'delivered').length,
            cancelled: orders.filter(order => order.status === 'cancelled').length
        };
        return stats;
    };

    const stats = getOrderStats();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                <div className="flex space-x-2">
                    {['today', 'week', 'month', 'all'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedPeriod === period
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
                    <div className="text-sm text-gray-600">Processing</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
                    <div className="text-sm text-gray-600">Shipped</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                    <div className="text-sm text-gray-600">Delivered</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                    <div className="text-sm text-gray-600">Cancelled</div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => {
                                const StatusIcon = getStatusIcon(order.status);
                                return (
                                    <tr key={order.orderId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.orderId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>
                                                <div className="font-medium">{order.name}</div>
                                                <div className="text-gray-500">{order.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.orderedItems?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${order.totalAmount?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setNewStatus(order.status);
                                                    setNotes(order.notes || '');
                                                    setShowUpdateModal(true);
                                                }}
                                                className="text-amber-600 hover:text-amber-900"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Status Modal */}
            {showUpdateModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Update Order Status - {selectedOrder.orderId}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="Add tracking number, delivery notes, etc."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowUpdateModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderManagement;
