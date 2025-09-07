import React, { useState, useRef } from 'react';
import { supabase, PRODUCT_IMAGES_BUCKET } from '../config/supabase';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SimpleImageUpload = ({
    onImageUploaded,
    onImageRemoved,
    existingImages = [],
    multiple = false,
    maxImages = 5,
    className = ""
}) => {
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
            console.log('=== SIMPLE UPLOAD TEST ===');
            console.log('Files:', files);
            console.log('Bucket:', PRODUCT_IMAGES_BUCKET);

            const uploadPromises = files.map(async (file) => {
                // Generate unique filename
                const fileExt = file.name.split('.').pop();
                const fileName = `simple-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `products/${fileName}`;

                console.log('Uploading:', filePath);

                // Try direct upload without any authentication
                const { data, error } = await supabase.storage
                    .from(PRODUCT_IMAGES_BUCKET)
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    console.error('Upload error:', error);
                    throw new Error(`Upload failed: ${error.message}`);
                }

                console.log('Upload successful:', data);

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from(PRODUCT_IMAGES_BUCKET)
                    .getPublicUrl(filePath);

                console.log('Public URL:', publicUrl);
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
            alert(`Upload failed: ${error.message}`);
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
                        {uploading ? 'Uploading...' : 'Click to upload images (Simple Test)'}
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

export default SimpleImageUpload;
