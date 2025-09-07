import React, { useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-green-50 border-green-200 text-green-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
            case 'error':
                return <XMarkIcon className="h-5 w-5 text-red-400" />;
            case 'warning':
                return <XMarkIcon className="h-5 w-5 text-yellow-400" />;
            case 'info':
                return <XMarkIcon className="h-5 w-5 text-blue-400" />;
            default:
                return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${getToastStyles()} transform transition-all duration-300 ease-in-out`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium">
                            {message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toast;
