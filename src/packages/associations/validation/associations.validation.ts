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

  image: yup
    .mixed<File>()
    .test('file-required', 'يرجى اختيار صورة', value => value instanceof File)
    .test('file-type', 'نوع الملف غير مدعوم', value => {
      if (!value || !(value instanceof File)) return false;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      return allowedTypes.includes(value.type);
    })
    .test('file-size', 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت', value => {
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

  image: yup
    .mixed<File>()
    .nullable()
    .test('file-type', 'نوع الملف غير مدعوم', value => {
      if (!value) return true;
      if (!(value instanceof File)) return false;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      return allowedTypes.includes(value.type);
    })
    .test('file-size', 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت', value => {
      if (!value) return true;
      if (!(value instanceof File)) return false;
      const maxSize = 5 * 1024 * 1024;
      return value.size <= maxSize;
    })
    .default(null),
});

export type UpdateAssociationFormData = yup.InferType<typeof updateAssociationSchema>;
