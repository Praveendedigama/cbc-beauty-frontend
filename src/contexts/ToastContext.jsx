import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };

        setToasts(prevToasts => [...prevToasts, newToast]);

        return id;
    };

    const hideToast = (id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    const showSuccess = (message, duration = 3000) => {
        return showToast(message, 'success', duration);
    };

    const showError = (message, duration = 5000) => {
        return showToast(message, 'error', duration);
    };

    const showWarning = (message, duration = 4000) => {
        return showToast(message, 'warning', duration);
    };

    const showInfo = (message, duration = 3000) => {
        return showToast(message, 'info', duration);
    };

    const value = {
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hideToast,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => hideToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    );
};
