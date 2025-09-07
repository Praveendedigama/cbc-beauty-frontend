import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, productsAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            console.log('=== TOKEN VALIDATION DEBUG ===');
            console.log('Token from localStorage:', token ? 'Present' : 'Missing');
            console.log('User data from localStorage:', userData);

            if (token && userData) {
                try {
                    const parsedUserData = JSON.parse(userData);
                    console.log('Parsed user data:', parsedUserData);
                    console.log('User type:', parsedUserData.type);

                    // Verify token is still valid by making a test request
                    const response = await productsAPI.getAll();
                    if (response.status === 200) {
                        setUser(parsedUserData);
                        console.log('User set from localStorage:', parsedUserData);
                    } else {
                        // Token is invalid, clear storage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                        console.log('Token invalid, cleared storage');
                    }
                } catch (error) {
                    // Token is invalid, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    console.log('Token validation error, cleared storage:', error);
                }
            } else {
                console.log('No token or user data found');
            }
            setLoading(false);
        };

        validateToken();
    }, []);

    const login = async (credentials) => {
        try {
            console.log('=== LOGIN DEBUG ===');
            console.log('Logging in with credentials:', credentials);

            const response = await authAPI.login(credentials);
            console.log('Login response:', response.data);

            const { token, user: userData } = response.data;
            console.log('Token received:', token ? 'Present' : 'Missing');
            console.log('User data received:', userData);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            console.log('User set in context:', userData);
            console.log('Token stored in localStorage');

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            console.log('=== REGISTRATION DEBUG ===');
            console.log('Registering user with data:', userData);

            const response = await authAPI.register(userData);
            console.log('Registration response:', response.data);

            const { token, user: userInfo } = response.data;
            console.log('Token received:', token ? 'Present' : 'Missing');
            console.log('User info received:', userInfo);

            // Auto-login after successful registration
            if (token && userInfo) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userInfo));
                setUser(userInfo);
                console.log('User auto-logged in successfully');
            } else {
                console.log('No token or user info received');
            }

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const googleLogin = async (googleData) => {
        try {
            const response = await authAPI.googleLogin(googleData);
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Google login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAdmin = () => {
        return user?.type === 'admin';
    };

    const isCustomer = () => {
        return user?.type === 'customer';
    };

    const value = {
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        isAdmin,
        isCustomer,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
