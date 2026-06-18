import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('📤 Starting comprehensive data export...');

    const exportDir = path.join(process.cwd(), 'exports');

    // Create exports directory if it doesn't exist
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Export News Tags (export as simple array for easier seeding)
    console.log('🏷️ Exporting news tags...');
    const tags = await prisma.news.findMany({
      select: {
        tags: true,
      },
    });

    // Export tags as simple array for easier seeding
    const tagNames = tags.map(tag => tag.tags);
    fs.writeFileSync(path.join(exportDir, 'news-tags.json'), JSON.stringify(tagNames, null, 2));

    // Export News
    console.log('📰 Exporting news...');
    const news = await prisma.news.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        imageUrl: true,
        category: true,
        author: true,
        views: true,
        featured: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
      },
    });

    // Transform news data for easier seeding (extract tag names)
    const newsForSeeding = news.map(article => ({
      ...article,
      tags: article.tags,
    }));

    fs.writeFileSync(path.join(exportDir, 'news.json'), JSON.stringify(newsForSeeding, null, 2));
    console.log(`✅ Exported ${news.length} news articles`);

    // Export Services
    console.log('🔧 Exporting services...');
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    fs.writeFileSync(path.join(exportDir, 'services.json'), JSON.stringify(services, null, 2));
    console.log(`✅ Exported ${services.length} services`);

    // Export Service Submissions
    console.log('📝 Exporting service submissions...');
    const submissions = await prisma.serviceSubmission.findMany({
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        address: true,
        description: true,
        additionalInfo: true,
        status: true,
        userId: true,
        serviceId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    fs.writeFileSync(path.join(exportDir, 'service-submissions.json'), JSON.stringify(submissions, null, 2));
    console.log(`✅ Exported ${submissions.length} service submissions`);

    // Export Council Members
    console.log('🏛️ Exporting council members...');
    const council = await prisma.council.findMany({
      select: {
        id: true,
        name: true,
        position: true,
        phone: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    fs.writeFileSync(path.join(exportDir, 'council.json'), JSON.stringify(council, null, 2));
    console.log(`✅ Exported ${council.length} council members`);
  } catch (error) {
    console.error('❌ Error during export:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
