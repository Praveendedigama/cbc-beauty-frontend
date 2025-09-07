import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { orderService } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';
import { TruckIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

const OrderStatusNotification = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [lastOrderStatuses, setLastOrderStatuses] = useState({});
    const [shownNotifications, setShownNotifications] = useState(new Set());

    useEffect(() => {
        if (!user) return;

        // Check for order status changes every 30 seconds
        const interval = setInterval(checkOrderStatusChanges, 30000);

        // Initial check
        checkOrderStatusChanges();

        return () => clearInterval(interval);
    }, [user]);

    const checkOrderStatusChanges = async () => {
        try {
            if (!user) return;

            const orders = await orderService.getAllOrders();
            const currentStatuses = {};

            orders.forEach(order => {
                currentStatuses[order.orderId] = order.status;
            });

            // Check for status changes
            Object.keys(currentStatuses).forEach(orderId => {
                const currentStatus = currentStatuses[orderId];
                const previousStatus = lastOrderStatuses[orderId];

                if (previousStatus && previousStatus !== currentStatus) {
                    // Create a unique key for this status change
                    const notificationKey = `${orderId}-${currentStatus}`;

                    // Only show notification if we haven't shown it before
                    if (!shownNotifications.has(notificationKey)) {
                        showStatusChangeNotification(orderId, previousStatus, currentStatus);
                        setShownNotifications(prev => {
                            const newSet = new Set([...prev, notificationKey]);
                            // Keep only the last 50 notifications to prevent memory issues
                            if (newSet.size > 50) {
                                const array = Array.from(newSet);
                                return new Set(array.slice(-50));
                            }
                            return newSet;
                        });
                    }
                }
            });

            setLastOrderStatuses(currentStatuses);
        } catch (error) {
            console.error('Error checking order status changes:', error);
        }
    };

    const showStatusChangeNotification = (orderId, oldStatus, newStatus) => {
        const statusMessages = {
            'pending': 'Your order is being prepared',
            'processing': 'Your order is being processed',
            'shipped': 'Your order has been shipped!',
            'delivered': 'Your order has been delivered!',
            'cancelled': 'Your order has been cancelled'
        };

        const statusIcons = {
            'pending': ClockIcon,
            'processing': ClockIcon,
            'shipped': TruckIcon,
            'delivered': CheckCircleIcon,
            'cancelled': XCircleIcon
        };

        const message = statusMessages[newStatus] || `Order ${orderId} status updated`;
        const Icon = statusIcons[newStatus] || ClockIcon;

        showToast(message, 'success');
    };

    return null; // This component doesn't render anything visible
};

export default OrderStatusNotification;
