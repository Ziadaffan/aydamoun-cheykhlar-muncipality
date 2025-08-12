import { News, NewsCategory } from '../types/news.types';

export const mockNews: News[] = [
  {
    id: '1',
    title: 'افتتاح مشروع تطوير الطرق الرئيسية في بلدة عيدمون',
    content:
      'تم اليوم افتتاح مشروع تطوير الطرق الرئيسية في بلدة عيدمون شيخلار، والذي يهدف إلى تحسين البنية التحتية ورفع مستوى الخدمات المقدمة للمواطنين. المشروع يشمل تطوير 5 كيلومترات من الطرق مع إضافة أرصفة وإنارة حديثة.',
    excerpt: 'افتتاح مشروع تطوير الطرق الرئيسية في بلدة عيدمون شيخلار لتحسين البنية التحتية ورفع مستوى الخدمات',
    imageUrl: '/assets/images/bg.jpg',
    category: 'INFRASTRUCTURE' as NewsCategory,
    author: 'إدارة البلدية',
    publishedAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
    isPublished: true,
    tags: ['تطوير', 'طرق', 'بنية تحتية', 'مشاريع'],
    readTime: 3,
  },
  {
    id: '2',
    title: 'إطلاق حملة تنظيف شاملة للبلدة',
    content:
      'أطلقت بلدية عيدمون شيخلار حملة تنظيف شاملة للبلدة تهدف إلى الحفاظ على البيئة وجمالية المنطقة. الحملة تشمل تنظيف الشوارع والحدائق العامة وجمع النفايات وإعادة تأهيل المساحات الخضراء.',
    excerpt: 'إطلاق حملة تنظيف شاملة للبلدة للحفاظ على البيئة وجمالية المنطقة',
    imageUrl: '/assets/images/bg-2.jpg',
    category: 'ENVIRONMENTAL' as NewsCategory,
    author: 'قسم البيئة',
    publishedAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14'),
    isPublished: true,
    tags: ['تنظيف', 'بيئة', 'حملة', 'مساحات خضراء'],
    readTime: 2,
  },
  {
    id: '3',
    title: 'توقيع اتفاقية شراكة مع جمعية التنمية المحلية',
    content:
      'وقعت بلدية عيدمون شيخلار اتفاقية شراكة مع جمعية التنمية المحلية لتعزيز التعاون في مجال التنمية المجتمعية وتنفيذ مشاريع مشتركة تهدف إلى تحسين مستوى المعيشة للمواطنين.',
    excerpt: 'توقيع اتفاقية شراكة مع جمعية التنمية المحلية لتعزيز التعاون في مجال التنمية المجتمعية',
    imageUrl: '/assets/images/logo.png',
    category: 'DEVELOPMENT_PROJECTS' as NewsCategory,
    author: 'رئيس البلدية',
    publishedAt: new Date('2024-12-13'),
    updatedAt: new Date('2024-12-13'),
    isPublished: true,
    tags: ['شراكة', 'تنمية', 'تعاون', 'مشاريع'],
    readTime: 4,
  },
  {
    id: '4',
    title: 'إعلان عن فتح باب التوظيف في البلدية',
    content:
      'تعلن بلدية عيدمون شيخلار عن فتح باب التوظيف لعدد من الوظائف الشاغرة في مختلف الأقسام. يمكن للمتقدمين التقديم عبر الموقع الإلكتروني أو في مقر البلدية.',
    excerpt: 'إعلان عن فتح باب التوظيف في البلدية لعدد من الوظائف الشاغرة في مختلف الأقسام',
    imageUrl: '/assets/images/bg.jpg',
    category: 'ANNOUNCEMENTS' as NewsCategory,
    author: 'قسم الموارد البشرية',
    publishedAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-12'),
    isPublished: true,
    tags: ['توظيف', 'وظائف', 'إعلان', 'بلدية'],
    readTime: 2,
  },
  {
    id: '5',
    title: 'تنظيم ورشة عمل حول التخطيط العمراني',
    content:
      'نظمت بلدية عيدمون شيخلار ورشة عمل حول التخطيط العمراني المستدام بمشاركة خبراء محليين ودوليين. الورشة تهدف إلى تطوير رؤية مستقبلية للبلدة وتحديد أولويات التطوير.',
    excerpt: 'تنظيم ورشة عمل حول التخطيط العمراني المستدام بمشاركة خبراء محليين ودوليين',
    imageUrl: '/assets/images/bg-2.jpg',
    category: 'MUNICIPAL_NEWS' as NewsCategory,
    author: 'قسم التخطيط',
    publishedAt: new Date('2024-12-11'),
    updatedAt: new Date('2024-12-11'),
    isPublished: true,
    tags: ['ورشة عمل', 'تخطيط عمراني', 'تنمية مستدامة', 'خبراء'],
    readTime: 5,
  },
  {
    id: '6',
    title: 'إطلاق برنامج دعم الأسر المحتاجة',
    content:
      'أطلقت بلدية عيدمون شيخلار برنامج دعم الأسر المحتاجة بهدف مساعدتهم في تلبية احتياجاتهم الأساسية. البرنامج يشمل مساعدات مالية وعينية وتوفير فرص عمل.',
    excerpt: 'إطلاق برنامج دعم الأسر المحتاجة لمساعدتهم في تلبية احتياجاتهم الأساسية',
    imageUrl: '/assets/images/bg.jpg',
    category: 'SOCIAL_SERVICES' as NewsCategory,
    author: 'قسم الخدمات الاجتماعية',
    publishedAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
    isPublished: true,
    tags: ['دعم', 'أسر محتاجة', 'مساعدات', 'خدمات اجتماعية'],
    readTime: 3,
  },
  {
    id: '7',
    title: 'افتتاح حديقة عامة جديدة في البلدة',
    content:
      'تم افتتاح حديقة عامة جديدة في بلدة عيدمون شيخلار، والتي تم تصميمها وفق أحدث المعايير العالمية. الحديقة تتضمن مناطق لعب للأطفال ومساحات خضراء وممرات للمشي.',
    excerpt: 'افتتاح حديقة عامة جديدة في البلدة مصممة وفق أحدث المعايير العالمية',
    imageUrl: '/assets/images/bg-2.jpg',
    category: 'COMMUNITY_EVENTS' as NewsCategory,
    author: 'قسم الحدائق',
    publishedAt: new Date('2024-12-09'),
    updatedAt: new Date('2024-12-09'),
    isPublished: true,
    tags: ['حديقة', 'افتتاح', 'مناطق لعب', 'مساحات خضراء'],
    readTime: 3,
  },
  {
    id: '8',
    title: 'تحديث نظام إدارة النفايات في البلدية',
    content:
      'أعلنت بلدية عيدمون شيخلار عن تحديث نظام إدارة النفايات بهدف تحسين كفاءة جمع النفايات وتطبيق مبادئ إعادة التدوير. النظام الجديد يتضمن تقنيات حديثة ومركبات صديقة للبيئة.',
    excerpt: 'تحديث نظام إدارة النفايات في البلدية لتحسين كفاءة جمع النفايات وتطبيق مبادئ إعادة التدوير',
    imageUrl: '/assets/images/bg.jpg',
    category: 'ENVIRONMENTAL' as NewsCategory,
    author: 'قسم البيئة',
    publishedAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-08'),
    isPublished: true,
    tags: ['نفايات', 'إعادة تدوير', 'بيئة', 'تقنيات حديثة'],
    readTime: 4,
  },
];

export const getFeaturedNews = (): News => mockNews[0];

export const getNewsByCategory = (category: NewsCategory | 'ALL'): News[] => {
  if (category === 'ALL') return mockNews;
  return mockNews.filter(news => news.category === category);
};

export const getNewsCategories = (): NewsCategory[] => {
  return Array.from(new Set(mockNews.map(news => news.category)));
};
