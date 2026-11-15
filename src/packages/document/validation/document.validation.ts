import * as yup from 'yup';
import { localizedMessage, validationMessages } from '../../common/validation/common.validation';

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

  // English version (optional; the Arabic text is shown when it is empty).
  titleEn: yup.string().trim().max(100, validationMessages.maxLength('العنوان بالإنجليزية', 100)).default(''),
  descriptionEn: yup.string().trim().max(500, validationMessages.maxLength('الوصف بالإنجليزية', 500)).default(''),

  file: yup
    .mixed()
    .test('file-required', validationMessages.chooseFile, value => value && value instanceof File)
    .test('file-type', validationMessages.unsupportedFileType, value => {
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
    .test('file-size', localizedMessage('حجم الملف يجب أن يكون أقل من 10 ميجابايت', 'The file must be smaller than 10 MB'), value => {
      if (!value || !(value instanceof File)) return false;
      const maxSize = 10 * 1024 * 1024; // 10MB
      return value.size <= maxSize;
    })
    .required(validationMessages.required('الملف')),
});

export type DocumentUploadFormData = yup.InferType<typeof documentUploadSchema>;
