// Image mapping utility to replace old images with new beauty product images
const imageMap = {
    // Map specific product types to appropriate images
    'night': '/nightcream.jpg',
    'cream': '/nightcream.jpg',
    'face': '/facewash.jpg',
    'wash': '/facewash.jpg',
    'scrub': '/scrub.jpg',
    'exfoliat': '/scrub.jpg',
    'lip': '/lipbalm.jpg',
    'balm': '/lipbalm.jpg',
    'shampoo': '/shampoo.jpg',
    'hair': '/shampoo.jpg'
};

// Function to get the appropriate image for a product
export const getProductImage = (product) => {
    if (!product) return '/nightcream.jpg';

    // Check if product has images array
    if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];

        // If it's a Supabase URL, return as is
        if (firstImage.includes('supabase') || firstImage.includes('storage.googleapis.com')) {
            return firstImage;
        }

        // If it's already a public folder image, return as is
        if (firstImage.startsWith('/') && !firstImage.includes('placeholder')) {
            return firstImage;
        }

        // If it's a placeholder, try to find a better match
        const productName = product.productName?.toLowerCase() || '';

        // Check for specific keywords in product name
        for (const [keyword, imagePath] of Object.entries(imageMap)) {
            if (keyword !== '/placeholder-beauty.jpg' && keyword !== '/placeholder-product.jpg' && keyword !== '/placeholder-beer.jpg') {
                if (productName.includes(keyword)) {
                    return imagePath;
                }
            }
        }

        // Default to night cream if no match found
        return '/nightcream.jpg';
    }

    // If no images array, try to match by product name
    const productName = product.productName?.toLowerCase() || '';
    for (const [keyword, imagePath] of Object.entries(imageMap)) {
        if (keyword !== '/placeholder-beauty.jpg' && keyword !== '/placeholder-product.jpg' && keyword !== '/placeholder-beer.jpg') {
            if (productName.includes(keyword)) {
                return imagePath;
            }
        }
    }

    return '/nightcream.jpg';
};

// Function to get multiple images for a product
export const getProductImages = (product) => {
    if (!product) return ['/nightcream.jpg'];

    if (product.images && product.images.length > 0) {
        return product.images.map(img => {
            // If it's a Supabase URL, return as is
            if (img.includes('supabase') || img.includes('storage.googleapis.com')) {
                return img;
            }

            // If it's a placeholder, replace with appropriate image
            if (img.includes('placeholder')) {
                return getProductImage(product);
            }
            return img;
        });
    }

    return [getProductImage(product)];
};
