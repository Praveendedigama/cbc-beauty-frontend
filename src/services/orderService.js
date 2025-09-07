import { ordersAPI } from './api';

// Order Service - Backend Integration
export const orderService = {
    // Create a new order via backend
    async createOrder(orderData) {
        try {
            console.log('Creating order with data:', orderData);

            // Transform frontend order data to backend format
            const backendOrderData = {
                orderedItems: orderData.items.map(item => {
                    console.log('Processing item:', item);
                    const qty = parseInt(item.quantity);
                    console.log('Parsed quantity:', qty, 'Type:', typeof qty);
                    return {
                        productId: item.productId,
                        qty: qty
                    };
                }),
                name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
                address: orderData.shipping.address,
                phone: orderData.customer.phone,
                totalAmount: orderData.totalAmount,
                paymentMethod: orderData.paymentMethod,
                status: orderData.status || 'pending'
            };

            console.log('Sending to backend:', backendOrderData);

            const response = await ordersAPI.create(backendOrderData);
            console.log('Backend response:', response);

            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            console.error('Error response:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to create order');
        }
    },

    // Get all orders for the current user via backend
    async getAllOrders() {
        try {
            console.log('Fetching orders from backend...');
            const response = await ordersAPI.getAll();
            console.log('Orders response:', response);

            // Handle different response formats
            const orders = response.data?.data || response.data || [];
            console.log('Parsed orders:', orders);

            return orders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            console.error('Error response:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to fetch orders');
        }
    },

    // Get order by ID via backend
    async getOrderById(orderId) {
        try {
            const response = await ordersAPI.getById(orderId);
            return response.data;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch order');
        }
    },

    // Update order status via backend
    async updateOrder(orderId, updateData) {
        try {
            console.log('Updating order:', orderId, 'with data:', updateData);
            const response = await ordersAPI.update(orderId, updateData);
            console.log('Update response:', response);
            return response.data;
        } catch (error) {
            console.error('Error updating order:', error);
            console.error('Error response:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to update order');
        }
    }
};
