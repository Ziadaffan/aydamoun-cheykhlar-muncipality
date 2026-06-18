import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export const categoryColors = {
  MUNICIPAL_NEWS: 'bg-blue-100 text-blue-800 border-blue-200',
  DEVELOPMENT_PROJECTS: 'bg-green-100 text-green-800 border-green-200',
  ANNOUNCEMENTS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  COMMUNITY_EVENTS: 'bg-purple-100 text-purple-800 border-purple-200',
  INFRASTRUCTURE: 'bg-orange-100 text-orange-800 border-orange-200',
  ENVIRONMENTAL: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  SOCIAL_SERVICES: 'bg-pink-100 text-pink-800 border-pink-200',
  HEALTH_AND_SOCIAL_SERVICES: 'bg-pink-100 text-pink-800 border-pink-200',
  OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const categoryLabels = {
  MUNICIPAL_NEWS: 'أخبار بلدية',
  DEVELOPMENT_PROJECTS: 'مشاريع تنموية',
  ANNOUNCEMENTS: 'إعلانات',
  COMMUNITY_EVENTS: 'فعاليات مجتمعية',
  INFRASTRUCTURE: 'بنية تحتية',
  ENVIRONMENTAL: 'بيئي',
  SOCIAL_SERVICES: 'خدمات اجتماعية',
  HEALTH_AND_SOCIAL_SERVICES: 'خدمات صحية واجتماعية',
  OTHER: 'أخرى',
  ALL: 'جميع الأخبار',
};

export const formatDate = (date: Date) => {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ar,
    });
  } catch {
    return 'منذ فترة';
  }
};
