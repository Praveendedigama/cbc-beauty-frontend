import React from 'react';
import { Link } from 'react-router-dom';
import {
    HeartIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    ShieldCheckIcon,
    TruckIcon,
    ArrowPathIcon,
    CreditCardIcon,
    StarIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Newsletter Section */}
            <section className="bg-amber-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Stay Updated
                    </h2>
                    <p className="text-xl mb-8">
                        Subscribe to our newsletter for the latest beauty product releases and exclusive offers
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        />
                        <button className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                                <HeartIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">Crystal Beauty</h3>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Your ultimate destination for premium beauty products. We bring you the finest cosmetics,
                            skincare, and beauty essentials to enhance your natural beauty.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                                <span className="sr-only">YouTube</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-rose-400">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=skincare" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Skincare
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=makeup" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Makeup
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=fragrance" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Fragrance
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=haircare" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Hair Care
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-rose-400">Customer Service</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Returns & Exchanges
                                </Link>
                            </li>
                            <li>
                                <Link to="/size-guide" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Size Guide
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/track-order" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    Track Your Order
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-rose-400">Get in Touch</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPinIcon className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        No 19/B, Diggala Road,<br />
                                        Panadura, Western Province
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <PhoneIcon className="h-5 w-5 text-rose-400 flex-shrink-0" />
                                <a href="tel:+94768644263" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    +94 76 864 263
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <EnvelopeIcon className="h-5 w-5 text-rose-400 flex-shrink-0" />
                                <a href="mailto:info@crystalbeauty.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                                    info@crystalbeauty.com
                                </a>
                            </div>
                            <div className="flex items-start space-x-3">
                                <ClockIcon className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        Mon - Fri: 9:00 AM - 8:00 PM<br />
                                        Sat - Sun: 10:00 AM - 6:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-rose-100 rounded-lg">
                                <TruckIcon className="h-6 w-6 text-rose-600" />
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm">Free Shipping</h5>
                                <p className="text-gray-400 text-xs">On orders over $50</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-rose-100 rounded-lg">
                                <ShieldCheckIcon className="h-6 w-6 text-rose-600" />
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm">Secure Payment</h5>
                                <p className="text-gray-400 text-xs">100% secure checkout</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-rose-100 rounded-lg">
                                <ArrowPathIcon className="h-6 w-6 text-rose-600" />
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm">Easy Returns</h5>
                                <p className="text-gray-400 text-xs">30-day return policy</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-rose-100 rounded-lg">
                                <StarIcon className="h-6 w-6 text-rose-600" />
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm">Premium Quality</h5>
                                <p className="text-gray-400 text-xs">Curated beauty products</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-800 border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                            <p className="text-gray-400 text-sm">
                                © 2024 Crystal Beauty. All rights reserved.
                            </p>
                            <div className="flex space-x-6">
                                <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Privacy Policy
                                </a>
                                <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Terms of Service
                                </a>
                                <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Cookie Policy
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-400 text-sm">We accept:</span>
                            <div className="flex space-x-2">
                                <CreditCardIcon className="h-6 w-6 text-gray-400" />
                                <CreditCardIcon className="h-6 w-6 text-gray-400" />
                                <CreditCardIcon className="h-6 w-6 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
