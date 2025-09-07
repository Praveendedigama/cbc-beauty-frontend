import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckIcon, ShoppingBagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { orderService } from '../services/orderService';
import { getProductImage } from '../utils/imageMapper';

const CheckoutSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching order details for orderId:', orderId);
            const orderData = await orderService.getOrderById(orderId);
            console.log('Order data received:', orderData);
            setOrder(orderData);
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError(`Failed to load order details: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Products
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Success Confirmation */}
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        {/* Success Icon */}
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                            <CheckIcon className="h-8 w-8 text-green-600" />
                        </div>

                        {/* Success Message */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Order Placed Successfully!
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                        </p>

                        {/* Order ID */}
                        {orderId && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                                <p className="text-lg font-semibold text-gray-900 font-mono">{orderId}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/orders')}
                                className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center"
                            >
                                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                                View My Orders
                            </button>

                            <button
                                onClick={() => navigate('/products')}
                                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>

                        {error ? (
                            <div className="text-red-600 text-sm mb-4">
                                {error}
                            </div>
                        ) : order ? (
                            <div className="space-y-6">
                                {/* Order Items */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
                                    <div className="space-y-3">
                                        {order.orderedItems?.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                                                <img
                                                    src={getProductImage({ productName: item.name, images: item.image ? [item.image] : [] })}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    <p className="text-xs text-gray-400">Price: ${item.price}</p>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                                        <span>Total</span>
                                        <span>${order.totalAmount?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </div>

                                {/* Order Status */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-amber-800 mb-2">Order Status</h3>
                                    <p className="text-sm text-amber-700">
                                        Status: <span className="font-semibold capitalize">{order.status || 'Processing'}</span>
                                    </p>
                                    <p className="text-sm text-amber-700 mt-1">
                                        Payment: <span className="font-semibold capitalize">{order.paymentMethod || 'Card'}</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">
                                <p className="mb-2">Order details will be available shortly.</p>
                                <p className="text-xs">You can view your order details in the "My Orders" section.</p>
                                {orderId && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-600 mb-1">Order Reference</p>
                                        <p className="font-mono text-sm text-gray-800">{orderId}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* What's Next */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">What's Next?</h3>
                            <ul className="text-xs text-blue-700 space-y-1 text-left">
                                <li>• You will receive an email confirmation shortly</li>
                                <li>• Your order will be processed within 1-2 business days</li>
                                <li>• You can track your order status in your account</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Need help? Contact us at{' '}
                        <a href="mailto:info@crystalbeauty.com" className="text-amber-600 hover:text-amber-700">
                            info@crystalbeauty.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccessPage;