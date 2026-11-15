import type { AnnouncementPriority, ServiceStatus } from '@prisma/client';
import type { PushMessageBuilder } from './pushNotifications.service';

/**
 * Push copy, in Arabic and English. The app expects these exact texts and paths
 * (see the "living app" contract): change them together with the app.
 */

type Copy = { ar: string; en: string };

const NEWS_TITLE: Copy = { ar: '📰 خبر جديد من البلدية', en: '📰 New from the municipality' };
const JOB_TITLE: Copy = { ar: '💼 فرصة عمل جديدة', en: '💼 New job opportunity' };
const TAXI_TITLE: Copy = { ar: '🚕 خط نقل جديد', en: '🚕 New taxi route' };

const ANNOUNCEMENT_TITLES: Record<AnnouncementPriority, Copy> = {
  NORMAL: { ar: '📢 إعلان من البلدية', en: '📢 Municipality announcement' },
  IMPORTANT: { ar: '📌 إعلان مهم', en: '📌 Important announcement' },
  URGENT: { ar: '🚨 إعلان عاجل', en: '🚨 Urgent announcement' },
};

const REQUEST_TITLES: Record<ServiceStatus, Copy> = {
  PENDING: { ar: '📝 طلبك قيد الانتظار', en: '📝 Your request is pending' },
  IN_PROGRESS: { ar: '⏳ طلبك قيد المعالجة', en: '⏳ Your request is being processed' },
  COMPLETED: { ar: '✅ تم إنجاز طلبك', en: '✅ Your request is complete' },
  REJECTED: { ar: '❌ تم رفض طلبك', en: '❌ Your request was declined' },
};

type Locale = 'ar' | 'en';

/** The entity's English text for English devices when the admin wrote one; Arabic otherwise. */
const pick = (locale: Locale, ar: string, en?: string | null): string => (locale === 'en' && en?.trim() ? en.trim() : ar);

export const newsPush =
  (news: { id: string; title: string; titleEn?: string | null }): PushMessageBuilder =>
  locale => ({ title: NEWS_TITLE[locale], body: pick(locale, news.title, news.titleEn), path: `/news/${news.id}` });

export const jobPush =
  (job: { id: string; title: string; titleEn?: string | null; provider: string; providerEn?: string | null }): PushMessageBuilder =>
  locale => ({
    title: JOB_TITLE[locale],
    body: `${pick(locale, job.title, job.titleEn)} · ${pick(locale, job.provider, job.providerEn)}`,
    path: `/jobs/${job.id}`,
  });

export const taxiStopPush =
  (stop: {
    fromLocation: string;
    fromLocationEn?: string | null;
    toLocation: string;
    toLocationEn?: string | null;
    hour: string;
  }): PushMessageBuilder =>
  locale => {
    const from = pick(locale, stop.fromLocation, stop.fromLocationEn);
    const to = pick(locale, stop.toLocation, stop.toLocationEn);
    return {
      title: TAXI_TITLE[locale],
      body: locale === 'en' ? `${from} → ${to} · ${stop.hour}` : `${from} ← ${to} · ${stop.hour}`,
      path: '/taxi-stops',
    };
  };

export const announcementPush =
  (announcement: { id: string; title: string; titleEn?: string | null; priority: AnnouncementPriority }): PushMessageBuilder =>
  locale => ({
    title: (ANNOUNCEMENT_TITLES[announcement.priority] ?? ANNOUNCEMENT_TITLES.NORMAL)[locale],
    body: pick(locale, announcement.title, announcement.titleEn),
    path: `/announcements/${announcement.id}`,
  });

export const requestStatusPush =
  (submission: { id: string; status: ServiceStatus }, service: { name: string; nameEn?: string | null }): PushMessageBuilder =>
  locale => ({
    title: REQUEST_TITLES[submission.status][locale],
    body: pick(locale, service.name, service.nameEn),
    path: `/submissions/${submission.id}`,
  });
