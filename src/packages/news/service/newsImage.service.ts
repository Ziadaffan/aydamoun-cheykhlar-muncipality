import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { cloudinaryPublicId } from '../utils/newsImage.utils';

// Cloudinary must already be configured: NewsService.instance() and the
// migration script both do it before calling these.

const NEWS_IMAGE_FOLDER = 'news';

/** Uploads one image to the `news` folder and resolves with its https URL. */
export function uploadNewsImage(image: Buffer, options: UploadApiOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: NEWS_IMAGE_FOLDER, resource_type: 'image', ...options }, (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error(`Cloudinary upload failed: ${error?.message ?? 'no response'}`));
        }
      })
      .end(image);
  });
}

/** Uploads the files in order. If any upload fails, the ones that succeeded are removed again. */
export async function uploadNewsImages(files: File[]): Promise<string[]> {
  const results = await Promise.allSettled(files.map(async file => uploadNewsImage(Buffer.from(await file.arrayBuffer()))));
  const urls = results.flatMap(result => (result.status === 'fulfilled' ? [result.value] : []));
  const failure = results.find((result): result is PromiseRejectedResult => result.status === 'rejected');

  if (failure) {
    await destroyNewsImages(urls);
    throw failure.reason;
  }

  return urls;
}

/** Best-effort removal of our Cloudinary assets. Legacy base64 entries have nothing to remove. */
export async function destroyNewsImages(values: readonly string[]): Promise<void> {
  const cloudName = cloudinary.config().cloud_name;
  const publicIds = values.flatMap(value => cloudinaryPublicId(value, cloudName) ?? []);
  const results = await Promise.allSettled(publicIds.map(publicId => cloudinary.uploader.destroy(publicId, { resource_type: 'image' })));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Failed to delete news image ${publicIds[index]}`, result.reason);
    }
  });
}

/** Non-empty files sent in the `images` form field. */
export function readImageFiles(formData: FormData): File[] {
  return formData.getAll('images').filter((entry): entry is File => typeof entry !== 'string' && entry.size > 0);
}
