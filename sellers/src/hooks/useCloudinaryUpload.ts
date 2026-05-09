import { useState } from 'react';
import { uploadToCloudinary, deleteFromCloudinary } from '../lib/cloudinary';
import type { CloudinaryFolder } from '@/src/types';

export type { CloudinaryFolder } from '@/src/types';

export function useCloudinaryUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function upload(fileUri: string, folder: CloudinaryFolder): Promise<{ url: string; publicId: string }> {
        setIsUploading(true);
        try {
            return await uploadToCloudinary(fileUri, folder);
        } finally {
            setIsUploading(false);
        }
    }

    async function remove(publicId: string): Promise<void> {
        setIsDeleting(true);
        try {
            await deleteFromCloudinary(publicId);
        } finally {
            setIsDeleting(false);
        }
    }

    return { upload, remove, isUploading, isDeleting };
}
