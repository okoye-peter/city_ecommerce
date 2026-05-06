import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

export type CloudinaryFolder = 'stores' | 'products' | 'avatars' | 'identity';

export function generateUploadSignature(folder: CloudinaryFolder) {
    const timestamp = Math.round(Date.now() / 1000);
    const params = { folder, timestamp };
    const signature = cloudinary.utils.api_sign_request(params, env.CLOUDINARY_API_SECRET);

    return {
        signature,
        timestamp,
        apiKey: env.CLOUDINARY_API_KEY,
        cloudName: env.CLOUDINARY_CLOUD_NAME,
        folder,
    };
}

export async function deleteUpload(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
}
