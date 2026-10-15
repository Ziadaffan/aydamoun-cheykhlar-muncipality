/**
 * One-off migration: moves news images stored inline as base64 to Cloudinary and
 * replaces them with the image URL, so news responses stop carrying megabytes of
 * image data.
 *
 *   yarn migrate:news-images            dry run: lists what would change, writes nothing
 *   yarn migrate:news-images --apply    uploads the images and updates the rows
 *
 * Safe to re-run. Entries that are already URLs are left alone, and each upload
 * uses a public id derived from the news id and the image bytes, so a retry after
 * a crash reuses the asset uploaded the first time instead of duplicating it.
 * Reads DATABASE_URL and the Cloudinary keys from .env.local / .env (or the shell).
 */
import { createHash } from 'crypto';
import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { isInlineImage } from '../src/packages/news/utils/newsImage.utils';
import { uploadNewsImage } from '../src/packages/news/service/newsImage.service';

config({ path: ['.env.local', '.env'], quiet: true });

const apply = process.argv.includes('--apply');

const inlineImageBytes = (value: string): Buffer => Buffer.from(value.startsWith('data:') ? value.slice(value.indexOf(',') + 1) : value, 'base64');

const megabytes = (chars: number) => `${(chars / 1024 / 1024).toFixed(2)} MB`;

async function main() {
  const { DATABASE_URL, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  if (apply && (!NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET)) {
    throw new Error('Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET');
  }

  cloudinary.config({
    cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  // Imported after dotenv has run, so the client is created with DATABASE_URL set.
  const { default: prisma } = await import('../src/packages/lib/db');

  const totals = { scanned: 0, migrated: 0, legacyRows: 0, legacyImages: 0, legacyChars: 0, uploaded: 0, updated: 0, changed: 0, failed: 0 };

  try {
    const rows = await prisma.news.findMany({ select: { id: true }, orderBy: { createdAt: 'asc' } });
    console.log(`${apply ? 'APPLY' : 'DRY RUN'}: ${rows.length} news rows`);

    for (const { id } of rows) {
      try {
        // One row per query: a legacy row alone can hold several MB of base64.
        const news = await prisma.news.findUnique({ where: { id }, select: { id: true, title: true, imageUrl: true, updatedAt: true } });
        if (!news) continue;
        totals.scanned++;

        const inline = news.imageUrl.filter(isInlineImage);
        if (!inline.length) {
          totals.migrated++;
          continue;
        }

        const chars = inline.reduce((sum, value) => sum + value.length, 0);
        totals.legacyRows++;
        totals.legacyImages += inline.length;
        totals.legacyChars += chars;
        console.log(`- ${news.id} "${news.title.slice(0, 50)}": ${inline.length} of ${news.imageUrl.length} images inline (${megabytes(chars)})`);

        if (!apply) continue;

        const imageUrl: string[] = [];
        for (const value of news.imageUrl) {
          if (!isInlineImage(value)) {
            imageUrl.push(value);
            continue;
          }
          const bytes = inlineImageBytes(value);
          const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
          imageUrl.push(await uploadNewsImage(bytes, { public_id: `${news.id}-${hash}`, overwrite: false }));
          totals.uploaded++;
        }

        // Keep updatedAt as the editor left it, and leave the row alone if it was edited meanwhile.
        const { count } = await prisma.news.updateMany({
          where: { id: news.id, updatedAt: news.updatedAt },
          data: { imageUrl, updatedAt: news.updatedAt },
        });

        if (count) {
          totals.updated++;
          console.log('  updated');
        } else {
          totals.changed++;
          console.warn('  skipped: the row changed during the migration, run the script again');
        }
      } catch (error) {
        totals.failed++;
        console.error(`- ${id}: failed, row left unchanged:`, error);
      }
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log('\nSummary');
  console.log(`  rows scanned:              ${totals.scanned}`);
  console.log(`  rows already on URLs:      ${totals.migrated}`);
  console.log(`  rows with inline images:   ${totals.legacyRows} (${totals.legacyImages} images, ${megabytes(totals.legacyChars)} of base64)`);
  console.log(`  rows failed:               ${totals.failed}`);
  if (apply) {
    console.log(`  images uploaded or reused: ${totals.uploaded}`);
    console.log(`  rows updated:              ${totals.updated}`);
    console.log(`  rows changed meanwhile:    ${totals.changed}`);
  } else if (totals.legacyRows) {
    console.log('\nNothing was written. Run with --apply to migrate.');
  }

  if (totals.failed || totals.changed) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
