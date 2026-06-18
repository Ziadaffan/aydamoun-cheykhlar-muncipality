import { PrismaClient, NewsCategory, Role, ServiceType, ServiceStatus, Position } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function seedFromExports() {
  try {
    console.log('🌱 Starting database seeding from exports...');

    const exportsDir = path.join(process.cwd(), 'exports');

    // Check if exports directory exists
    if (!fs.existsSync(exportsDir)) {
      console.log('❌ Exports directory not found. Please run export:data first.');
      return;
    }

    // Clear existing data (optional - be careful with this!)
    console.log('🧹 Clearing existing data...');
    // await prisma.news.deleteMany();
    await prisma.serviceSubmission.deleteMany();
    await prisma.service.deleteMany();
    await prisma.council.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Existing data cleared');

    // Seed Users
    console.log('👥 Seeding users...');
    const usersData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'users.json'), 'utf8'));
    for (const userData of usersData) {
      const { accounts, sessions, submissions, ...userFields } = userData;

      const user = await prisma.user.create({
        data: userFields,
      });
      console.log(`✅ Created user: ${user.name || user.email}`);
    }

    // Seed Services
    console.log('🔧 Seeding services...');
    const servicesData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'services.json'), 'utf8'));
    for (const serviceData of servicesData) {
      const { submissions, ...serviceFields } = serviceData;

      const service = await prisma.service.create({
        data: serviceFields,
      });
      console.log(`✅ Created service: ${service.name}`);
    }

    // Seed Council Members
    console.log('🏛️ Seeding council members...');
    const councilData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'council.json'), 'utf8'));
    for (const councilMember of councilData) {
      const council = await prisma.council.create({
        data: councilMember,
      });
      console.log(`✅ Created council member: ${council.name}`);
    }

    // Seed News
    console.log('📰 Seeding news...');
    const newsData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'news.json'), 'utf8'));
    for (const newsItem of newsData) {
      const { tags, ...newsFields } = newsItem;

      // Find the user who created this news
      const user = await prisma.user.findFirst();
      if (!user) {
        console.log('❌ No user found to associate with news');
        continue;
      }

      // Create news with tags
      // const news = await prisma.news.create({
      //   data: {
      //     ...newsFields,
      //     createdBy: user.id,
      //     tags: tags || [],
      //   },
      // });
      // console.log(`✅ Created news: ${news.title}`);
    }

    console.log('🎉 Database seeding completed successfully!');

    // Show summary
    const userCount = await prisma.user.count();
    // const newsCount = await prisma.news.count();
    const serviceCount = await prisma.service.count();
    const councilCount = await prisma.council.count();

    console.log('\n📊 Seeding Summary:');
    console.log(`   Users: ${userCount}`);
    // console.log(`   News: ${newsCount}`);
    console.log(`   Services: ${serviceCount}`);
    console.log(`   Council: ${councilCount}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Main function - try to seed from exports, fallback to sample data
async function main() {
  const exportsDir = path.join(process.cwd(), 'exports');

  if (fs.existsSync(exportsDir) && fs.readdirSync(exportsDir).length > 0) {
    await seedFromExports();
  }
}

main();
