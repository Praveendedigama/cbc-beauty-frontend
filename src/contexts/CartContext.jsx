import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { showSuccess } = useToast();

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.productId === product.productId);

            if (existingItem) {
                const updatedItems = prevItems.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );

                // Show success message for quantity update
                showSuccess(`${product.productName} quantity updated in cart!`);
                return updatedItems;
            } else {
                // Show success message for new item
                showSuccess(`${product.productName} added to cart successfully!`);
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const itemToRemove = prevItems.find(item => item.productId === productId);
            if (itemToRemove) {
                showSuccess(`${itemToRemove.productName} removed from cart`);
            }
            return prevItems.filter(item => item.productId !== productId);
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.productId === productId) {
                    showSuccess(`${item.productName} quantity updated to ${quantity}`);
                    return { ...item, quantity };
                }
                return item;
            });
            return updatedItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        showSuccess('Cart cleared successfully');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.lastPrice * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const getCartItems = () => {
        return cartItems;
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getCartItems,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
