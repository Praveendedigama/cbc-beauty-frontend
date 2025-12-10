import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getProductImage } from '../utils/imageMapper';
import {
    TrashIcon,
    PlusIcon,
    MinusIcon,
    ShoppingBagIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

const CartPage = () => {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal
    } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleQuantityChange = (productId, newQuantity) => {
        updateQuantity(productId, newQuantity);
    };

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsCheckingOut(true);
        // Navigate to checkout page
        navigate('/checkout');
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            clearCart();
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link
                            to="/products"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">
                        {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                                <button
                                    onClick={handleClearCart}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Clear Cart
                                </button>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.productId} className="p-6">
                                        <div className="flex items-center space-x-4">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={getProductImage(item)}
                                                    alt={item.productName}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                    {item.productName}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-lg font-semibold text-amber-600">
                                                        Rs.{item.lastPrice.toFixed(2)}
                                                    </span>
                                                    {item.lastPrice < item.price && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            Rs.{item.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    <MinusIcon className="h-4 w-4" />
                                                </button>
                                                <span className="w-12 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <PlusIcon className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-right">
                                                <div className="text-lg font-semibold text-gray-900">
                                                    Rs.{(item.lastPrice * item.quantity).toFixed(2)}
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.productId)}
                                                    className="text-red-600 hover:text-red-700 text-sm font-medium mt-1"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">Rs.{getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">Rs.0.00</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>Rs.{getCartTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {!user && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Ready to checkout?</strong> You'll need to{' '}
                                        <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">
                                            login
                                        </Link>{' '}
                                        or{' '}
                                        <Link to="/register" className="text-blue-600 hover:text-blue-800 underline">
                                            create an account
                                        </Link>{' '}
                                        to complete your purchase.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors"
                            >
                                {isCheckingOut ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                                        <ArrowRightIcon className="h-5 w-5 ml-2" />
                                    </>
                                )}
                            </button>

                            <div className="mt-4 text-center">
                                <Link
                                    to="/products"
                                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                                >
                                    Continue Shopping
                                </Link>
                            </div>

                            {/* Security Features */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-xs text-gray-500 space-y-2">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        Secure checkout
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        Free shipping on all orders
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        30-day return policy
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
