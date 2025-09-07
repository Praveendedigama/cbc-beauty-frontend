import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import {
    ShoppingCartIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout, isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-amber-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                            <img
                                src="/logo.jpg"
                                alt="Crystal Beauty Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    // Fallback to text if image fails to load
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span className="text-amber-600 font-bold text-lg hidden">CB</span>
                        </div>
                        <span className="text-xl font-bold">Crystal Beauty</span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </form>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/products" className="hover:text-amber-200 transition-colors">
                            Products
                        </Link>

                        {user ? (
                            <>
                                <Link to="/orders" className="hover:text-amber-200 transition-colors">
                                    Orders
                                </Link>
                                {isAdmin() && (
                                    <Link to="/admin" className="hover:text-amber-200 transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center space-x-4">
                                    <Link to="/cart" className="relative hover:text-amber-200 transition-colors">
                                        <ShoppingCartIcon className="h-6 w-6" />
                                        {getCartCount() > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {getCartCount()}
                                            </span>
                                        )}
                                    </Link>
                                    <div className="flex items-center space-x-2">
                                        <UserIcon className="h-6 w-6" />
                                        <span className="text-sm">{user.firstName}</span>
                                        <button
                                            onClick={handleLogout}
                                            className="text-sm hover:text-amber-200 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/cart" className="relative hover:text-amber-200 transition-colors">
                                    <ShoppingCartIcon className="h-6 w-6" />
                                    {getCartCount() > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {getCartCount()}
                                        </span>
                                    )}
                                </Link>
                                <Link to="/login" className="hover:text-amber-200 transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-amber-700 hover:bg-amber-800 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-amber-200 transition-colors"
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden pb-4">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </form>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 border-t border-amber-500">
                        <div className="pt-4 space-y-2">
                            <Link
                                to="/products"
                                className="block py-2 hover:text-amber-200 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Products
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        to="/orders"
                                        className="block py-2 hover:text-amber-200 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Orders
                                    </Link>
                                    {isAdmin() && (
                                        <Link
                                            to="/admin"
                                            className="block py-2 hover:text-amber-200 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Admin
                                        </Link>
                                    )}
                                    <Link
                                        to="/cart"
                                        className="flex items-center py-2 hover:text-amber-200 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                        Cart ({getCartCount()})
                                    </Link>
                                    <div className="flex items-center py-2">
                                        <UserIcon className="h-5 w-5 mr-2" />
                                        <span className="text-sm">{user.firstName}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="block py-2 hover:text-amber-200 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/cart"
                                        className="flex items-center py-2 hover:text-amber-200 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                        Cart ({getCartCount()})
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="block py-2 hover:text-amber-200 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block py-2 hover:text-amber-200 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
