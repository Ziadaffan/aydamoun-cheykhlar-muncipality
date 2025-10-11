import * as yup from 'yup';
import { validationMessages } from '../../common/validation/common.validation';
import { NewsCategory } from '../types/news.types';

export const createNewsSchema = yup.object({
  title: yup
    .string()
    .min(2, validationMessages.minLength('عنوان الخبر', 2))
    .max(200, validationMessages.maxLength('عنوان الخبر', 200))
    .required(validationMessages.required('عنوان الخبر')),

  content: yup
    .string()
    .min(10, validationMessages.minLength('محتوى الخبر', 10))
    .max(5000, validationMessages.maxLength('محتوى الخبر', 5000))
    .required(validationMessages.required('محتوى الخبر')),

  excerpt: yup
    .string()
    .min(10, validationMessages.minLength('ملخص الخبر', 10))
    .max(500, validationMessages.maxLength('ملخص الخبر', 500))
    .required(validationMessages.required('ملخص الخبر')),

  category: yup
    .string()
    .oneOf(
      [
        'MUNICIPAL_NEWS',
        'DEVELOPMENT_PROJECTS',
        'ANNOUNCEMENTS',
        'COMMUNITY_EVENTS',
        'INFRASTRUCTURE',
        'ENVIRONMENTAL',
        'SOCIAL_SERVICES',
        'HEALTH_AND_SOCIAL_SERVICES',
        'OTHER',
      ],
      'يرجى اختيار فئة صحيحة'
    )
    .required(validationMessages.required('فئة الخبر')),

  author: yup
    .string()
    .min(2, validationMessages.minLength('اسم الكاتب', 2))
    .max(100, validationMessages.maxLength('اسم الكاتب', 100))
    .required(validationMessages.required('اسم الكاتب')),

  tags: yup
    .array()
    .of(yup.string().min(2, 'يجب أن يكون كل علامة على الأقل حرفين'))
    .max(10, 'يمكن إضافة 10 علامات كحد أقصى')
    .required(validationMessages.required('العلامات')),

  featured: yup.boolean().default(false),

  images: yup
    .array()
    .of(
      yup
        .mixed()
        .test('file-required', 'يرجى اختيار صورة', value => value && value instanceof File)
        .test('file-type', 'نوع الملف غير مدعوم', value => {
          if (!value || !(value instanceof File)) return false;
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          return allowedTypes.includes(value.type);
        })
        .test('file-size', 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت', value => {
          if (!value || !(value instanceof File)) return false;
          const maxSize = 5 * 1024 * 1024; // 5MB
          return value.size <= maxSize;
        })
    )
    .min(1, 'يرجى إضافة صورة واحدة على الأقل')
    .max(5, 'يمكن إضافة 5 صور كحد أقصى')
    .required(validationMessages.required('الصور')),
});

export type CreateNewsFormData = yup.InferType<typeof createNewsSchema>;

export const updateNewsSchema = yup.object({
  title: yup
    .string()
    .min(2, validationMessages.minLength('عنوان الخبر', 2))
    .max(200, validationMessages.maxLength('عنوان الخبر', 200))
    .required(validationMessages.required('عنوان الخبر')),

  content: yup
    .string()
    .min(10, validationMessages.minLength('محتوى الخبر', 10))
    .max(5000, validationMessages.maxLength('محتوى الخبر', 5000))
    .required(validationMessages.required('محتوى الخبر')),

  excerpt: yup
    .string()
    .min(10, validationMessages.minLength('ملخص الخبر', 10))
    .max(500, validationMessages.maxLength('ملخص الخبر', 500))
    .required(validationMessages.required('ملخص الخبر')),

  category: yup
    .string()
    .oneOf(
      [
        'MUNICIPAL_NEWS',
        'DEVELOPMENT_PROJECTS',
        'ANNOUNCEMENTS',
        'COMMUNITY_EVENTS',
        'INFRASTRUCTURE',
        'ENVIRONMENTAL',
        'SOCIAL_SERVICES',
        'HEALTH_AND_SOCIAL_SERVICES',
        'OTHER',
      ],
      'يرجى اختيار فئة صحيحة'
    )
    .required(validationMessages.required('فئة الخبر')),

  author: yup
    .string()
    .min(2, validationMessages.minLength('اسم الكاتب', 2))
    .max(100, validationMessages.maxLength('اسم الكاتب', 100))
    .required(validationMessages.required('اسم الكاتب')),

  tags: yup
    .array()
    .of(yup.string().min(2, 'يجب أن يكون كل علامة على الأقل حرفين'))
    .max(10, 'يمكن إضافة 10 علامات كحد أقصى')
    .required(validationMessages.required('العلامات')),

  featured: yup.boolean().default(false),

  images: yup
    .array()
    .of(
      yup
        .mixed()
        .test('file-required', 'يرجى اختيار صورة', value => value && value instanceof File)
        .test('file-type', 'نوع الملف غير مدعوم', value => {
          if (!value || !(value instanceof File)) return false;
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          return allowedTypes.includes(value.type);
        })
        .test('file-size', 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت', value => {
          if (!value || !(value instanceof File)) return false;
          const maxSize = 5 * 1024 * 1024; // 5MB
          return value.size <= maxSize;
        })
    )
    .min(1, 'يرجى إضافة صورة واحدة على الأقل')
    .max(5, 'يمكن إضافة 5 صور كحد أقصى')
    .required(validationMessages.required('الصور')),
});

export type UpdateNewsFormData = yup.InferType<typeof updateNewsSchema>;
