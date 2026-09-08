'use server';

import cloudinary from '@/lib/cloudinary/cloudinary';

export async function uploadImage(imageDataUrl: string) {
  const result = await cloudinary.uploader.upload(imageDataUrl, {
    folder: 'glow-jerseys',
    overwrite: true,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  return result.secure_url as string;
}