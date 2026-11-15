import * as yup from 'yup';
import { validationMessages } from '@/packages/common/validation/common.validation';

export const createAssociationSchema = yup.object({
  name: yup
    .string()
    .min(2, validationMessages.minLength('اسم المؤسسة', 2))
    .max(150, validationMessages.maxLength('اسم المؤسسة', 150))
    .required(validationMessages.required('اسم المؤسسة')),

  description: yup
    .string()
    .min(10, validationMessages.minLength('الوصف', 10))
    .required(validationMessages.required('الوصف')),

  // English version (optional; the Arabic text is shown when it is empty).
  nameEn: yup.string().trim().max(150, validationMessages.maxLength('الاسم بالإنجليزية', 150)).default(''),
  descriptionEn: yup.string().trim().max(5000, validationMessages.maxLength('الوصف بالإنجليزية', 5000)).default(''),

  image: yup
    .mixed<File>()
    .test('file-required', validationMessages.chooseImage, value => value instanceof File)
    .test('file-type', validationMessages.unsupportedFileType, value => {
      if (!value || !(value instanceof File)) return false;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      return allowedTypes.includes(value.type);
    })
    .test('file-size', validationMessages.imageTooLarge, value => {
      if (!value || !(value instanceof File)) return false;
      const maxSize = 5 * 1024 * 1024;
      return value.size <= maxSize;
    })
    .required(validationMessages.required('صورة المؤسسة')),
});

export type CreateAssociationFormData = yup.InferType<typeof createAssociationSchema>;

export const updateAssociationSchema = yup.object({
  name: yup
    .string()
    .min(2, validationMessages.minLength('اسم المؤسسة', 2))
    .max(150, validationMessages.maxLength('اسم المؤسسة', 150))
    .required(validationMessages.required('اسم المؤسسة')),

  description: yup
    .string()
    .min(10, validationMessages.minLength('الوصف', 10))
    .required(validationMessages.required('الوصف')),

  // English version (optional; the Arabic text is shown when it is empty).
  nameEn: yup.string().trim().max(150, validationMessages.maxLength('الاسم بالإنجليزية', 150)).default(''),
  descriptionEn: yup.string().trim().max(5000, validationMessages.maxLength('الوصف بالإنجليزية', 5000)).default(''),

  image: yup
    .mixed<File>()
    .nullable()
    .test('file-type', validationMessages.unsupportedFileType, value => {
      if (!value) return true;
      if (!(value instanceof File)) return false;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      return allowedTypes.includes(value.type);
    })
    .test('file-size', validationMessages.imageTooLarge, value => {
      if (!value) return true;
      if (!(value instanceof File)) return false;
      const maxSize = 5 * 1024 * 1024;
      return value.size <= maxSize;
    })
    .default(null),
});

export type UpdateAssociationFormData = yup.InferType<typeof updateAssociationSchema>;
