import api from './axios';

type CloudinaryFolder = 'stores' | 'products' | 'avatars' | 'identity';

interface UploadSignature {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: CloudinaryFolder;
}

async function getUploadSignature(folder: CloudinaryFolder): Promise<UploadSignature> {
    const res = await api.get(`/uploads/sign?folder=${folder}`);
    return res.data.data;
}

interface CloudinaryUploadResult {
    url: string;
    publicId: string;
}

interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    error?: { message: string };
}

export async function uploadToCloudinary(fileUri: string, folder: CloudinaryFolder): Promise<CloudinaryUploadResult> {
    const sig = await getUploadSignature(folder);

    const formData = new FormData();
    const filename = fileUri.split('/').pop() ?? 'upload';
    const ext = filename.split('.').pop() ?? 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    formData.append('file', { uri: fileUri, name: filename, type: mimeType } as never);
    formData.append('api_key', sig.apiKey);
    formData.append('timestamp', String(sig.timestamp));
    formData.append('signature', sig.signature);
    formData.append('folder', sig.folder);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    let response: Response;
    try {
        response = await fetch(
            `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
                { method: 'POST', body: formData as any, signal: controller.signal as any },
        );
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
            throw new Error('Upload timed out. Please check your connection and try again.');
        }
        throw err;
    } finally {
        clearTimeout(timeout);
    }

    const data = await response.json() as CloudinaryUploadResponse;

    if (!response.ok) {
        throw new Error(data.error?.message ?? 'Cloudinary upload failed');
    }

    return { url: data.secure_url, publicId: data.public_id };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
    await api.delete('/uploads', { data: { publicId } });
}
