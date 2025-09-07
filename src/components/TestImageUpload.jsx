import React, { useState } from 'react';
import { supabase, PRODUCT_IMAGES_BUCKET } from '../config/supabase';

const TestImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState('');

    const testUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        setResult('');

        try {
            console.log('Testing upload with file:', file);
            console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
            console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');

            // Test 1: Try to access the product-images bucket directly
            console.log('Testing direct bucket access...');
            setResult('Testing bucket access...');

            // Test 2: Try to upload
            const fileName = `test-${Date.now()}-${file.name}`;
            const filePath = `products/${fileName}`;

            console.log('Uploading to:', filePath);

            const { data, error } = await supabase.storage
                .from(PRODUCT_IMAGES_BUCKET)
                .upload(filePath, file);

            if (error) {
                console.error('Upload error:', error);
                setResult(`❌ Upload failed: ${error.message}`);
                return;
            }

            console.log('Upload successful:', data);

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(PRODUCT_IMAGES_BUCKET)
                .getPublicUrl(filePath);

            setResult(`✅ Upload successful! URL: ${publicUrl}`);
            console.log('Public URL:', publicUrl);

        } catch (error) {
            console.error('Test upload error:', error);
            setResult(`❌ Test failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-bold mb-4">Test Image Upload</h3>
            <input
                type="file"
                accept="image/*"
                onChange={testUpload}
                disabled={uploading}
                className="mb-4"
            />
            {uploading && <p>Uploading...</p>}
            {result && (
                <div className={`p-2 rounded ${result.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result}
                </div>
            )}
        </div>
    );
};

export default TestImageUpload;
