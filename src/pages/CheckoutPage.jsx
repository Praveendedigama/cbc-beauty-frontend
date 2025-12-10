import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { orderService } from '../services/orderService';
import PaymentForm from '../components/PaymentForm';
import { getProductImage } from '../utils/imageMapper';
import {
    CreditCardIcon,
    BanknotesIcon,
    ArrowLeftIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

const CheckoutPage = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Sri Lanka'
    });

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            navigate('/cart');
            return;
        }

        // Pre-fill form with user data if available
        if (user.email) {
            setFormData(prev => ({
                ...prev,
                email: user.email,
                firstName: user.firstName || '',
                lastName: user.lastName || ''
            }));
        }
    }, [user, cartItems, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePaymentSuccess = async (paymentData) => {
        setIsProcessing(true);

        try {
            const orderData = {
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone
                },
                shipping: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country
                },
                items: cartItems.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    price: item.lastPrice,
                    quantity: item.quantity,
                    image: getProductImage(item)
                })),
                totalAmount: getCartTotal(),
                paymentMethod: 'card',
                paymentData: paymentData,
                status: 'paid'
            };

            // Create order via backend (this will reduce stock)
            const orderResponse = await orderService.createOrder(orderData);
            console.log('Order created:', orderResponse);

            // Show success message and redirect to success page
            showToast('Order placed successfully!', 'success');
            navigate(`/checkout/success?orderId=${orderResponse.data?.orderId || orderResponse.orderId}`);

            // Clear cart after navigation (with a small delay to ensure navigation happens first)
            setTimeout(() => {
                clearCart();
            }, 100);

        } catch (error) {
            console.error('Error processing payment:', error);
            showToast(error.message || 'Payment failed. Please try again.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCashOnDelivery = async () => {
        if (!validateForm()) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        setIsProcessing(true);

        try {
            const orderData = {
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone
                },
                shipping: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country
                },
                items: cartItems.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    price: item.lastPrice,
                    quantity: item.quantity,
                    image: getProductImage(item)
                })),
                totalAmount: getCartTotal(),
                paymentMethod: 'cash_on_delivery',
                status: 'pending'
            };

            // Create order via backend (this will reduce stock)
            const orderResponse = await orderService.createOrder(orderData);
            console.log('Order created:', orderResponse);

            // Show success message and redirect to success page
            showToast('Order placed successfully! You will pay on delivery.', 'success');
            navigate(`/checkout/success?orderId=${orderResponse.data?.orderId || orderResponse.orderId}`);

            // Clear cart after navigation (with a small delay to ensure navigation happens first)
            setTimeout(() => {
                clearCart();
            }, 100);

        } catch (error) {
            console.error('Error creating order:', error);
            showToast(error.message || 'Failed to place order. Please try again.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCardPayment = () => {
        if (!validateForm()) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        setShowPaymentForm(true);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back to Cart
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Checkout Form */}
                    <div className="space-y-8">
                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your first name"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your last name"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your email address"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your phone number"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your full address"
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your city"
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter postal code"
                                        />
                                        {errors.postalCode && (
                                            <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="card"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                                    />
                                    <label htmlFor="card" className="ml-3 flex items-center">
                                        <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Credit/Debit Card</span>
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="cod"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                                    />
                                    <label htmlFor="cod" className="ml-3 flex items-center">
                                        <BanknotesIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.productId} className="flex items-center space-x-4">
                                        <img
                                            src={getProductImage(item)}
                                            alt={item.productName}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900">{item.productName}</h3>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Rs.{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-semibold text-gray-900">
                                    <span>Total</span>
                                    <span>Rs.{getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Buttons */}
                        <div className="space-y-4">
                            {paymentMethod === 'card' ? (
                                <button
                                    onClick={handleCardPayment}
                                    disabled={isProcessing}
                                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCardIcon className="h-5 w-5 mr-2" />
                                            Pay with Card
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleCashOnDelivery}
                                    disabled={isProcessing}
                                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <BanknotesIcon className="h-5 w-5 mr-2" />
                                            Place Order (Cash on Delivery)
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Form Modal */}
            {showPaymentForm && (
                <PaymentForm
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPaymentForm(false)}
                    amount={getCartTotal()}
                />
            )}
        </div>
    );
};

export default CheckoutPage;
