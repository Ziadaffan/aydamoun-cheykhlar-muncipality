import * as yup from 'yup';
import { localizedMessage, validationMessages } from '../../common/validation/common.validation';
import { NewsCategory } from '../types/news.types';

const messages = {
  invalidCategory: localizedMessage('يرجى اختيار فئة صحيحة', 'Please choose a valid category'),
  tagMinLength: localizedMessage('يجب أن يكون كل علامة على الأقل حرفين', 'Each tag must be at least 2 characters'),
  tooManyTags: localizedMessage('يمكن إضافة 10 علامات كحد أقصى', 'You can add up to 10 tags'),
  imagesRequired: localizedMessage('يرجى إضافة صورة واحدة على الأقل', 'Please add at least one image'),
  tooManyImages: localizedMessage('يمكن إضافة 5 صور كحد أقصى', 'You can add up to 5 images'),
};

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

  // English version (optional; the Arabic text is shown when it is empty).
  titleEn: yup.string().trim().max(200, validationMessages.maxLength('العنوان بالإنجليزية', 200)).default(''),
  excerptEn: yup.string().trim().max(500, validationMessages.maxLength('الملخص بالإنجليزية', 500)).default(''),
  contentEn: yup.string().trim().max(5000, validationMessages.maxLength('المحتوى بالإنجليزية', 5000)).default(''),

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
      messages.invalidCategory
    )
    .required(validationMessages.required('فئة الخبر')),

  author: yup
    .string()
    .min(2, validationMessages.minLength('اسم الكاتب', 2))
    .max(100, validationMessages.maxLength('اسم الكاتب', 100))
    .required(validationMessages.required('اسم الكاتب')),

  tags: yup
    .array()
    .of(yup.string().min(2, messages.tagMinLength))
    .max(10, messages.tooManyTags)
    .required(validationMessages.required('العلامات')),

  featured: yup.boolean().default(false),

  images: yup
    .array()
    .of(
      yup
        .mixed()
        .test('file-required', validationMessages.chooseImage, value => value && value instanceof File)
        .test('file-type', validationMessages.unsupportedFileType, value => {
          if (!value || !(value instanceof File)) return false;
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          return allowedTypes.includes(value.type);
        })
        .test('file-size', validationMessages.imageTooLarge, value => {
          if (!value || !(value instanceof File)) return false;
          const maxSize = 5 * 1024 * 1024; // 5MB
          return value.size <= maxSize;
        })
    )
    .min(1, messages.imagesRequired)
    .max(5, messages.tooManyImages)
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

  // English version (optional; the Arabic text is shown when it is empty).
  titleEn: yup.string().trim().max(200, validationMessages.maxLength('العنوان بالإنجليزية', 200)).default(''),
  excerptEn: yup.string().trim().max(500, validationMessages.maxLength('الملخص بالإنجليزية', 500)).default(''),
  contentEn: yup.string().trim().max(5000, validationMessages.maxLength('المحتوى بالإنجليزية', 5000)).default(''),

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
      messages.invalidCategory
    )
    .required(validationMessages.required('فئة الخبر')),

  author: yup
    .string()
    .min(2, validationMessages.minLength('اسم الكاتب', 2))
    .max(100, validationMessages.maxLength('اسم الكاتب', 100))
    .required(validationMessages.required('اسم الكاتب')),

  tags: yup
    .array()
    .of(yup.string().min(2, messages.tagMinLength))
    .max(10, messages.tooManyTags)
    .required(validationMessages.required('العلامات')),

  featured: yup.boolean().default(false),

  images: yup
    .array()
    .of(
      yup
        .mixed()
        .test('file-required', validationMessages.chooseImage, value => value && value instanceof File)
        .test('file-type', validationMessages.unsupportedFileType, value => {
          if (!value || !(value instanceof File)) return false;
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          return allowedTypes.includes(value.type);
        })
        .test('file-size', validationMessages.imageTooLarge, value => {
          if (!value || !(value instanceof File)) return false;
          const maxSize = 5 * 1024 * 1024; // 5MB
          return value.size <= maxSize;
        })
    )
    .min(1, messages.imagesRequired)
    .max(5, messages.tooManyImages)
    .required(validationMessages.required('الصور')),
});

export type UpdateNewsFormData = yup.InferType<typeof updateNewsSchema>;
