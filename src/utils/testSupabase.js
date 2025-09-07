// Test utility to verify Supabase setup
import { supabase, PRODUCT_IMAGES_BUCKET } from '../config/supabase';

export const testSupabaseConnection = async () => {
    try {
        console.log('Testing Supabase connection...');

        // Test 1: Check if we can access the storage bucket
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

        if (bucketError) {
            console.error('❌ Bucket access error:', bucketError);
            return false;
        }

        console.log('✅ Buckets accessible:', buckets.map(b => b.name));

        // Test 2: Check if our specific bucket exists
        const productBucket = buckets.find(b => b.name === PRODUCT_IMAGES_BUCKET);
        if (!productBucket) {
            console.error('❌ Product images bucket not found');
            return false;
        }

        console.log('✅ Product images bucket found');

        // Test 3: Check if we can list files in the bucket
        const { data: files, error: listError } = await supabase.storage
            .from(PRODUCT_IMAGES_BUCKET)
            .list();

        if (listError) {
            console.error('❌ File listing error:', listError);
            return false;
        }

        console.log('✅ Can list files in bucket:', files.length, 'files');

        console.log('🎉 Supabase setup is working correctly!');
        return true;

    } catch (error) {
        console.error('❌ Supabase test failed:', error);
        return false;
    }
};

// Function to test image upload (call this from browser console)
export const testImageUpload = async (file) => {
    try {
        console.log('Testing image upload...');

        const fileName = `test-${Date.now()}.jpg`;
        const filePath = `products/${fileName}`;

        const { data, error } = await supabase.storage
            .from(PRODUCT_IMAGES_BUCKET)
            .upload(filePath, file);

        if (error) {
            console.error('❌ Upload error:', error);
            return false;
        }

        console.log('✅ Upload successful:', data);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(PRODUCT_IMAGES_BUCKET)
            .getPublicUrl(filePath);

        console.log('✅ Public URL:', publicUrl);
        return publicUrl;

    } catch (error) {
        console.error('❌ Upload test failed:', error);
        return false;
    }
};
