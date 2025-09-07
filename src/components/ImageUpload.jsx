import React, { useState, useRef } from 'react';
import { supabase, PRODUCT_IMAGES_BUCKET } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PhotoIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const ImageUpload = ({
    onImageUploaded,
    onImageRemoved,
    existingImages = [],
    multiple = false,
    maxImages = 5,
    className = ""
}) => {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [previewUrls, setPreviewUrls] = useState(existingImages);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        // Validate file types
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            if (!isValidType) {
                alert(`${file.name} is not a valid image file.`);
            }
            return isValidType;
        });

        if (validFiles.length === 0) return;

        // Check if adding these files would exceed the limit
        if (previewUrls.length + validFiles.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images.`);
            return;
        }

        // Create preview URLs
        const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

        // Upload files
        uploadFiles(validFiles);
    };

    const uploadFiles = async (files) => {
        setUploading(true);

        try {
            console.log('Starting upload process...');
            console.log('Files to upload:', files);
            console.log('User authenticated:', !!user);
            console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
            console.log('Supabase Key present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

            // Note: We're using public upload for now
            console.log('Using public upload (no authentication required)');

            const uploadPromises = files.map(async (file) => {
                console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);

                // Generate unique filename
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `products/${fileName}`;

                console.log('Uploading to bucket:', PRODUCT_IMAGES_BUCKET, 'path:', filePath);

                // Upload to Supabase Storage
                const { data, error } = await supabase.storage
                    .from(PRODUCT_IMAGES_BUCKET)
                    .upload(filePath, file);

                if (error) {
                    console.error('Upload error:', error);
                    console.error('Error details:', JSON.stringify(error, null, 2));
                    throw new Error(`Upload failed: ${error.message}`);
                }

                console.log('Upload successful:', data);

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from(PRODUCT_IMAGES_BUCKET)
                    .getPublicUrl(filePath);

                console.log('Public URL generated:', publicUrl);
                return publicUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            console.log('All uploads completed:', uploadedUrls);

            // Call the callback with uploaded URLs
            if (onImageUploaded) {
                if (multiple) {
                    onImageUploaded(uploadedUrls);
                } else {
                    onImageUploaded(uploadedUrls[0]);
                }
            }

        } catch (error) {
            console.error('Error uploading images:', error);
            console.error('Error stack:', error.stack);
            alert(`Failed to upload images: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newPreviewUrls);

        if (onImageRemoved) {
            onImageRemoved(index);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* File Input (Hidden) */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Upload Button */}
            <button
                type="button"
                onClick={openFileDialog}
                disabled={uploading || previewUrls.length >= maxImages}
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="text-center">
                    <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        {uploading ? 'Uploading...' : 'Click to upload images'}
                    </p>
                    <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                    </p>
                </div>
            </button>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Progress */}
            {uploading && (
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                    <span>Uploading images...</span>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
