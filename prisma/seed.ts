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
    await prisma.newsTag.deleteMany();
    await prisma.news.deleteMany();
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
      const { accounts, sessions, submissions, news, ...userFields } = userData;

      const user = await prisma.user.create({
        data: userFields,
      });
      console.log(`✅ Created user: ${user.name || user.email}`);
    }

    // Seed News Tags
    console.log('🏷️ Seeding news tags...');
    const tagsData = JSON.parse(fs.readFileSync(path.join(exportsDir, 'news-tags.json'), 'utf8'));
    for (const tagData of tagsData) {
      // Handle both string names and full tag objects
      const tagName = typeof tagData === 'string' ? tagData : tagData.name;
      const tag = await prisma.newsTag.create({
        data: {
          name: tagName,
        },
      });
      console.log(`✅ Created tag: ${tag.name}`);
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

      // Find tags by name and connect them
      const tagConnections = [];
      for (const tagName of tags) {
        const tag = await prisma.newsTag.findFirst({
          where: { name: tagName },
        });
        if (tag) {
          tagConnections.push({ id: tag.id });
        } else {
          console.log(`⚠️ Tag not found: ${tagName}`);
        }
      }

      // Create news with tags
      const news = await prisma.news.create({
        data: {
          ...newsFields,
          createdBy: user.id,
          tags: {
            connect: tagConnections,
          },
        },
      });
      console.log(`✅ Created news: ${news.title}`);
    }

    console.log('🎉 Database seeding completed successfully!');

    // Show summary
    const userCount = await prisma.user.count();
    const newsCount = await prisma.news.count();
    const tagCount = await prisma.newsTag.count();
    const serviceCount = await prisma.service.count();
    const councilCount = await prisma.council.count();

    console.log('\n📊 Seeding Summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   News: ${newsCount}`);
    console.log(`   Tags: ${tagCount}`);
    console.log(`   Services: ${serviceCount}`);
    console.log(`   Council: ${councilCount}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Also provide a function to seed with sample data if no exports exist
async function seedWithSampleData() {
  try {
    console.log('🌱 Starting database seeding with sample data...');

    // Create sample user
    const user = await prisma.user.create({
      data: {
        name: 'مدير النظام',
        email: 'admin@aydamoun.com',
        role: 'ADMIN',
      },
    });
    console.log(`✅ Created user: ${user.name}`);

    // Create sample tags from all the mock news data
    const tags = [
      'تطوير',
      'طرق',
      'بنية تحتية',
      'مشاريع',
      'بيئة',
      'خدمات اجتماعية',
      'إعلانات',
      'أحداث مجتمعية',
      'تنظيف',
      'حملة',
      'مساحات خضراء',
      'شراكة',
      'تنمية',
      'تعاون',
      'توظيف',
      'وظائف',
      'بلدية',
      'ورشة عمل',
      'تخطيط عمراني',
      'تنمية مستدامة',
      'خبراء',
      'دعم',
      'أسر محتاجة',
      'مساعدات',
      'حديقة',
      'افتتاح',
      'مناطق لعب',
      'نفايات',
      'إعادة تدوير',
      'تقنيات حديثة',
    ];

    const createdTags = [];
    for (const tagName of tags) {
      const tag = await prisma.newsTag.create({ data: { name: tagName } });
      createdTags.push(tag);
      console.log(`✅ Created tag: ${tagName}`);
    }

    // Create sample news using the mock data
    const sampleNews = [
      {
        title: 'افتتاح مشروع تطوير الطرق الرئيسية في بلدة عيدمون',
        content:
          'تم اليوم افتتاح مشروع تطوير الطرق الرئيسية في بلدة عيدمون شيخلار، والذي يهدف إلى تحسين البنية التحتية ورفع مستوى الخدمات المقدمة للمواطنين. المشروع يشمل تطوير 5 كيلومترات من الطرق مع إضافة أرصفة وإنارة حديثة.',
        excerpt: 'افتتاح مشروع تطوير الطرق الرئيسية في بلدة عيدمون شيخلار لتحسين البنية التحتية ورفع مستوى الخدمات',
        imageUrl: '/assets/images/bg.jpg',
        category: NewsCategory.INFRASTRUCTURE,
        author: 'إدارة البلدية',
        isPublished: true,
        featured: true,
        readTime: 3,
        views: 0,
        tagNames: ['تطوير', 'طرق', 'بنية تحتية', 'مشاريع'],
      },
      {
        title: 'إطلاق حملة تنظيف شاملة للبلدة',
        content:
          'أطلقت بلدية عيدمون شيخلار حملة تنظيف شاملة للبلدة تهدف إلى الحفاظ على البيئة وجمالية المنطقة. الحملة تشمل تنظيف الشوارع والحدائق العامة وجمع النفايات وإعادة تأهيل المساحات الخضراء.',
        excerpt: 'إطلاق حملة تنظيف شاملة للبلدة للحفاظ على البيئة وجمالية المنطقة',
        imageUrl: '/assets/images/bg-2.jpg',
        category: NewsCategory.ENVIRONMENTAL,
        author: 'قسم البيئة',
        isPublished: true,
        featured: false,
        readTime: 2,
        views: 0,
        tagNames: ['تنظيف', 'بيئة', 'حملة', 'مساحات خضراء'],
      },
      {
        title: 'توقيع اتفاقية شراكة مع جمعية التنمية المحلية',
        content:
          'وقعت بلدية عيدمون شيخلار اتفاقية شراكة مع جمعية التنمية المحلية لتعزيز التعاون في مجال التنمية المجتمعية وتنفيذ مشاريع مشتركة تهدف إلى تحسين مستوى المعيشة للمواطنين.',
        excerpt: 'توقيع اتفاقية شراكة مع جمعية التنمية المحلية لتعزيز التعاون في مجال التنمية المجتمعية',
        imageUrl: '/assets/images/logo.png',
        category: NewsCategory.DEVELOPMENT_PROJECTS,
        author: 'رئيس البلدية',
        isPublished: true,
        featured: false,
        readTime: 4,
        views: 0,
        tagNames: ['شراكة', 'تنمية', 'تعاون', 'مشاريع'],
      },
      {
        title: 'إعلان عن فتح باب التوظيف في البلدية',
        content:
          'تعلن بلدية عيدمون شيخلار عن فتح باب التوظيف لعدد من الوظائف الشاغرة في مختلف الأقسام. يمكن للمتقدمين التقديم عبر الموقع الإلكتروني أو في مقر البلدية.',
        excerpt: 'إعلان عن فتح باب التوظيف في البلدية لعدد من الوظائف الشاغرة في مختلف الأقسام',
        imageUrl: '/assets/images/bg.jpg',
        category: NewsCategory.ANNOUNCEMENTS,
        author: 'قسم الموارد البشرية',
        isPublished: true,
        featured: false,
        readTime: 2,
        views: 0,
        tagNames: ['توظيف', 'وظائف', 'إعلان', 'بلدية'],
      },
      {
        title: 'تنظيم ورشة عمل حول التخطيط العمراني',
        content:
          'نظمت بلدية عيدمون شيخلار ورشة عمل حول التخطيط العمراني المستدام بمشاركة خبراء محليين ودوليين. الورشة تهدف إلى تطوير رؤية مستقبلية للبلدة وتحديد أولويات التطوير.',
        excerpt: 'تنظيم ورشة عمل حول التخطيط العمراني المستدام بمشاركة خبراء محليين ودوليين',
        imageUrl: '/assets/images/bg-2.jpg',
        category: NewsCategory.MUNICIPAL_NEWS,
        author: 'قسم التخطيط',
        isPublished: true,
        featured: false,
        readTime: 5,
        views: 0,
        tagNames: ['ورشة عمل', 'تخطيط عمراني', 'تنمية مستدامة', 'خبراء'],
      },
      {
        title: 'إطلاق برنامج دعم الأسر المحتاجة',
        content:
          'أطلقت بلدية عيدمون شيخلار برنامج دعم الأسر المحتاجة بهدف مساعدتهم في تلبية احتياجاتهم الأساسية. البرنامج يشمل مساعدات مالية وعينية وتوفير فرص عمل.',
        excerpt: 'إطلاق برنامج دعم الأسر المحتاجة لمساعدتهم في تلبية احتياجاتهم الأساسية',
        imageUrl: '/assets/images/bg.jpg',
        category: NewsCategory.SOCIAL_SERVICES,
        author: 'قسم الخدمات الاجتماعية',
        isPublished: true,
        featured: false,
        readTime: 3,
        views: 0,
        tagNames: ['دعم', 'أسر محتاجة', 'مساعدات', 'خدمات اجتماعية'],
      },
      {
        title: 'افتتاح حديقة عامة جديدة في البلدة',
        content:
          'تم افتتاح حديقة عامة جديدة في بلدة عيدمون شيخلار، والتي تم تصميمها وفق أحدث المعايير العالمية. الحديقة تتضمن مناطق لعب للأطفال ومساحات خضراء وممرات للمشي.',
        excerpt: 'افتتاح حديقة عامة جديدة في البلدة مصممة وفق أحدث المعايير العالمية',
        imageUrl: '/assets/images/bg-2.jpg',
        category: NewsCategory.COMMUNITY_EVENTS,
        author: 'قسم الحدائق',
        isPublished: true,
        featured: false,
        readTime: 3,
        views: 0,
        tagNames: ['حديقة', 'افتتاح', 'مناطق لعب', 'مساحات خضراء'],
      },
      {
        title: 'تحديث نظام إدارة النفايات في البلدية',
        content:
          'أعلنت بلدية عيدمون شيخلار عن تحديث نظام إدارة النفايات بهدف تحسين كفاءة جمع النفايات وتطبيق مبادئ إعادة التدوير. النظام الجديد يتضمن تقنيات حديثة ومركبات صديقة للبيئة.',
        excerpt: 'تحديث نظام إدارة النفايات في البلدية لتحسين كفاءة جمع النفايات وتطبيق مبادئ إعادة التدوير',
        imageUrl: '/assets/images/bg.jpg',
        category: NewsCategory.ENVIRONMENTAL,
        author: 'قسم البيئة',
        isPublished: true,
        featured: false,
        readTime: 4,
        views: 0,
        tagNames: ['نفايات', 'إعادة تدوير', 'بيئة', 'تقنيات حديثة'],
      },
    ];

    for (const newsData of sampleNews) {
      const { tagNames, ...newsFields } = newsData;
      const newsTags = createdTags.filter(tag => tagNames.includes(tag.name));

      const news = await prisma.news.create({
        data: {
          ...newsFields,
          createdBy: user.id,
          tags: { connect: newsTags.map(tag => ({ id: tag.id })) },
        },
      });
      console.log(`✅ Created news: ${news.title}`);
    }

    console.log('🎉 Sample data seeding completed!');
  } catch (error) {
    console.error('❌ Error during sample seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Main function - try to seed from exports, fallback to sample data
async function main() {
  const exportsDir = path.join(process.cwd(), 'exports');

  if (fs.existsSync(exportsDir) && fs.readdirSync(exportsDir).length > 0) {
    await seedFromExports();
  } else {
    console.log('📁 No exports found, using sample data...');
    await seedWithSampleData();
  }
}

main();
