import React from 'react';
import { XMarkIcon, TruckIcon, CheckCircleIcon, ClockIcon, XCircleIcon, MapPinIcon, PhoneIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { getProductImage } from '../utils/imageMapper';

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
    if (!isOpen || !order) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'preparing':
                return <ClockIcon className="h-6 w-6 text-yellow-500" />;
            case 'shipped':
                return <TruckIcon className="h-6 w-6 text-blue-500" />;
            case 'delivered':
                return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
            case 'cancelled':
                return <XCircleIcon className="h-6 w-6 text-red-500" />;
            default:
                return <ClockIcon className="h-6 w-6 text-gray-500" />;
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

    const calculateSubtotal = () => {
        return order.orderedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateTotal = () => {
        // You can add shipping, tax, etc. here if needed
        return calculateSubtotal();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        {getStatusIcon(order.status)}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Order #{order.orderId}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Placed on {formatDate(order.date)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Order Status */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                                <p className="text-sm text-gray-600">Current status of your order</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.orderedItems.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                    <img
                                        src={getProductImage({ productName: item.name, images: item.image ? [item.image] : [] })}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-lg font-medium text-gray-900">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Product ID: {item.productId}
                                        </p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className="text-sm text-gray-600">
                                                Quantity: {item.quantity}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                Price: ${item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="font-medium">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax:</span>
                                <span className="font-medium">$0.00</span>
                            </div>
                            <div className="border-t border-gray-300 pt-2">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                                    <span className="text-lg font-semibold text-gray-900">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Delivery Address</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.name}<br />
                                            {order.address}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-1" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Contact Number</h4>
                                        <p className="text-sm text-gray-600 mt-1">{order.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <CreditCardIcon className="h-5 w-5 text-gray-400 mt-1" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">Payment Method</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' :
                                                order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                                                    order.paymentMethod || 'Not specified'}
                                        </p>
                                        {order.paymentId && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Payment ID: {order.paymentId}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h3>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-gray-700">
                                    {order.notes}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Order Timeline */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                                    <p className="text-xs text-gray-600">{formatDate(order.date)}</p>
                                </div>
                            </div>
                            {order.status === 'preparing' && (
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                                        <p className="text-xs text-gray-600">Your order is being prepared</p>
                                    </div>
                                </div>
                            )}
                            {order.status === 'shipped' && (
                                <>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                                            <p className="text-xs text-gray-600">Your order has been confirmed</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Order Shipped</p>
                                            <p className="text-xs text-gray-600">Your order is on its way</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            {order.status === 'delivered' && (
                                <>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                                            <p className="text-xs text-gray-600">Your order has been confirmed</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Order Shipped</p>
                                            <p className="text-xs text-gray-600">Your order was shipped</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Order Delivered</p>
                                            <p className="text-xs text-gray-600">Your order has been delivered</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;