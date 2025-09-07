import { productsAPI } from './api';

// Stock Management Service - Backend Integration
export const stockService = {
    // Get all products with stock from backend
    async getAllProducts() {
        try {
            const response = await productsAPI.getAll();
            return response.data;
        } catch (error) {
            console.error('Error loading products from backend:', error);
            return [];
        }
    },

    // Update product stock via backend
    async updateStock(productId, quantitySold) {
        try {
            // First get current product
            const productResponse = await productsAPI.getById(productId);
            const product = productResponse.data;

            // Calculate new stock
            const newStock = Math.max(0, product.stock - quantitySold);

            // Update product with new stock
            const updateResponse = await productsAPI.update(productId, {
                ...product,
                stock: newStock,
                updatedAt: new Date().toISOString()
            });

            return updateResponse.data;
        } catch (error) {
            console.error('Error updating stock via backend:', error);
            throw error;
        }
    },

    // Reduce stock for multiple items (for orders) via backend
    async reduceStockForOrder(items) {
        try {
            const updatePromises = items.map(async (item) => {
                return await this.updateStock(item.productId, item.quantity);
            });

            const updatedProducts = await Promise.all(updatePromises);
            return updatedProducts;
        } catch (error) {
            console.error('Error reducing stock for order via backend:', error);
            throw error;
        }
    },

    // Get product by ID from backend
    async getProductById(productId) {
        try {
            const response = await productsAPI.getById(productId);
            return response.data;
        } catch (error) {
            console.error('Error fetching product from backend:', error);
            return null;
        }
    },

    // Check if product is in stock via backend
    async isInStock(productId, quantity = 1) {
        try {
            const product = await this.getProductById(productId);
            return product ? product.stock >= quantity : false;
        } catch (error) {
            console.error('Error checking stock via backend:', error);
            return false;
        }
    },

    // Get stock status via backend
    async getStockStatus(productId) {
        try {
            const product = await this.getProductById(productId);
            if (!product) return 'not_found';

            if (product.stock === 0) return 'out_of_stock';
            if (product.stock <= 5) return 'low_stock';
            return 'in_stock';
        } catch (error) {
            console.error('Error getting stock status via backend:', error);
            return 'not_found';
        }
    },

    // Initialize products with stock (for demo purposes)
    initializeProducts() {
        const existingProducts = this.getAllProducts();
        if (existingProducts.length === 0) {
            // Initialize with some demo products
            const demoProducts = [
                {
                    _id: '1',
                    productId: 'CB001',
                    productName: 'Anti-Aging Night Cream',
                    description: 'Luxurious night cream for all skin types',
                    price: 49.99,
                    lastPrice: 39.99,
                    stock: 10,
                    images: ['/nightcream.jpg'],
                    category: 'skincare',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    productId: 'CB002',
                    productName: 'Gentle Face Wash',
                    description: 'Gentle face wash for daily cleansing',
                    price: 24.99,
                    lastPrice: 19.99,
                    stock: 8,
                    images: ['/facewash.jpg'],
                    category: 'skincare',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: '3',
                    productId: 'CB003',
                    productName: 'Exfoliating Scrub',
                    description: 'Deep exfoliating scrub for smooth skin',
                    price: 34.99,
                    lastPrice: 29.99,
                    stock: 12,
                    images: ['/scrub.jpg'],
                    category: 'skincare',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: '4',
                    productId: 'CB004',
                    productName: 'Moisturizing Lip Balm',
                    description: 'Nourishing lip balm for soft lips',
                    price: 12.99,
                    lastPrice: 9.99,
                    stock: 20,
                    images: ['/lipbalm.jpg'],
                    category: 'lipcare',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: '5',
                    productId: 'CB005',
                    productName: 'Hydrating Shampoo',
                    description: 'Moisturizing shampoo for all hair types',
                    price: 18.99,
                    lastPrice: 15.99,
                    stock: 15,
                    images: ['/shampoo.jpg'],
                    category: 'haircare',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];

            localStorage.setItem('products', JSON.stringify(demoProducts));
            return demoProducts;
        }
        return existingProducts;
    }
};
