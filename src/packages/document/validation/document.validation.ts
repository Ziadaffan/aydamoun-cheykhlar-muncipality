import * as yup from 'yup';
import { validationMessages } from '../../common/validation/common.validation';

// Document upload validation schema
export const documentUploadSchema = yup.object({
  title: yup
    .string()
    .min(2, validationMessages.minLength('عنوان المستند', 2))
    .max(100, validationMessages.maxLength('عنوان المستند', 100))
    .required(validationMessages.required('عنوان المستند')),

  description: yup
    .string()
    .min(10, validationMessages.minLength('وصف المستند', 10))
    .max(500, validationMessages.maxLength('وصف المستند', 500))
    .required(validationMessages.required('وصف المستند')),

  type: yup
    .string()
    .oneOf(['PDF', 'WORD', 'OTHER', 'IMAGE', 'VIDEO'], 'يرجى اختيار نوع مستند صحيح')
    .required(validationMessages.required('نوع المستند')),

  file: yup
    .mixed()
    .test('file-required', 'يرجى اختيار ملف', value => value && value instanceof File)
    .test('file-type', 'نوع الملف غير مدعوم', value => {
      if (!value || !(value instanceof File)) return false;

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/avi',
        'video/mov',
      ];

      return allowedTypes.includes(value.type);
    })
    .test('file-size', 'حجم الملف يجب أن يكون أقل من 10 ميجابايت', value => {
      if (!value || !(value instanceof File)) return false;
      const maxSize = 10 * 1024 * 1024; // 10MB
      return value.size <= maxSize;
    })
    .required(validationMessages.required('الملف')),
});

// Export types for TypeScript
export type DocumentUploadFormData = yup.InferType<typeof documentUploadSchema>;
