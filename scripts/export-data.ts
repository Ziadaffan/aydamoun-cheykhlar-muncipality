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

    // Export Users
    console.log('👥 Exporting users...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    fs.writeFileSync(path.join(exportDir, 'users.json'), JSON.stringify(users, null, 2));
    console.log(`✅ Exported ${users.length} users`);

    // Export Accounts
    console.log('🔐 Exporting accounts...');
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
        type: true,
        provider: true,
        providerAccountId: true,
        refresh_token: true,
        access_token: true,
        expires_at: true,
        token_type: true,
        scope: true,
        id_token: true,
        session_state: true,
      },
    });

    fs.writeFileSync(path.join(exportDir, 'accounts.json'), JSON.stringify(accounts, null, 2));
    console.log(`✅ Exported ${accounts.length} accounts`);

    // Export Sessions
    console.log('🔑 Exporting sessions...');
    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        sessionToken: true,
        userId: true,
        expires: true,
      },
    });

    fs.writeFileSync(path.join(exportDir, 'sessions.json'), JSON.stringify(sessions, null, 2));
    console.log(`✅ Exported ${sessions.length} sessions`);

    // Export Verification Tokens
    console.log('🔒 Exporting verification tokens...');
    const verificationTokens = await prisma.verificationToken.findMany({
      select: {
        identifier: true,
        token: true,
        expires: true,
      },
    });

    fs.writeFileSync(path.join(exportDir, 'verification-tokens.json'), JSON.stringify(verificationTokens, null, 2));
    console.log(`✅ Exported ${verificationTokens.length} verification tokens`);

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

    // Create a comprehensive summary file
    const summary = {
      exportDate: new Date().toISOString(),
      exportVersion: '2.0.0',
      database: {
        totalUsers: users.length,
        totalAccounts: accounts.length,
        totalSessions: sessions.length,
        totalVerificationTokens: verificationTokens.length,
        totalNews: news.length,
        totalTags: tags.length,
        totalServices: services.length,
        totalSubmissions: submissions.length,
        totalCouncil: council.length,
      },
      files: {
        users: 'users.json',
        accounts: 'accounts.json',
        sessions: 'sessions.json',
        verificationTokens: 'verification-tokens.json',
        news: 'news.json',
        newsTags: 'news-tags.json',
        services: 'services.json',
        serviceSubmissions: 'service-submissions.json',
        council: 'council.json',
        summary: 'export-summary.json',
      },
      notes: [
        'news-tags.json contains only tag names for easier seeding',
        'news.json has tags as array of names for easier seeding',
        'All timestamps are preserved in ISO format',
        'User passwords are not exported for security',
      ],
    };

    fs.writeFileSync(path.join(exportDir, 'export-summary.json'), JSON.stringify(summary, null, 2));

    console.log('\n🎉 Comprehensive data export completed successfully!');
    console.log(`📁 Files saved in: ${exportDir}`);
    console.log('\n📊 Export Summary:');
    console.log(`   Users: ${summary.database.totalUsers}`);
    console.log(`   Accounts: ${summary.database.totalAccounts}`);
    console.log(`   Sessions: ${summary.database.totalSessions}`);
    console.log(`   Verification Tokens: ${summary.database.totalVerificationTokens}`);
    console.log(`   News: ${summary.database.totalNews}`);
    console.log(`   Tags: ${summary.database.totalTags}`);
    console.log(`   Services: ${summary.database.totalServices}`);
    console.log(`   Submissions: ${summary.database.totalSubmissions}`);
    console.log(`   Council: ${summary.database.totalCouncil}`);
    console.log(`\n📝 Export Version: ${summary.exportVersion}`);
    console.log(`📅 Export Date: ${summary.exportDate}`);
  } catch (error) {
    console.error('❌ Error during export:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
