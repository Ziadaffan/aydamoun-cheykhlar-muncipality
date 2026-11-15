import * as yup from 'yup';
import { validationMessages } from '../../common/validation/common.validation';

export const createJobSchema = yup.object({
  title: yup
    .string()
    .min(2, validationMessages.minLength('عنوان الوظيفة', 2))
    .max(200, validationMessages.maxLength('عنوان الوظيفة', 200))
    .required(validationMessages.required('عنوان الوظيفة')),

  description: yup.string().nullable().default(null),

  provider: yup
    .string()
    .min(2, validationMessages.minLength('اسم المزود', 2))
    .max(100, validationMessages.maxLength('اسم المزود', 100))
    .required(validationMessages.required('اسم المزود')),

  phone: yup.string().nullable().default(null),

  location: yup
    .string()
    .min(2, validationMessages.minLength('الموقع', 2))
    .max(100, validationMessages.maxLength('الموقع', 100))
    .required(validationMessages.required('الموقع')),

  salary: yup.string().nullable().default(null),

  deadline: yup
    .mixed()
    .nullable()
    .default(null)
    .test('is-date', validationMessages.invalidDate, value => {
      if (!value) return true;
      if (value instanceof Date) return !isNaN(value.getTime());
      if (typeof value === 'string') {
        const date = new Date(value);
        return !isNaN(date.getTime());
      }
      return false;
    })
    .transform((value, originalValue) => {
      if (!originalValue) return null;
      if (originalValue instanceof Date) return originalValue;
      if (typeof originalValue === 'string') return new Date(originalValue);
      return null;
    }),

  active: yup.boolean().default(true),

  // English version (optional; the Arabic text is shown when it is empty).
  titleEn: yup.string().trim().max(200, validationMessages.maxLength('العنوان بالإنجليزية', 200)).default(''),
  descriptionEn: yup.string().trim().max(5000, validationMessages.maxLength('الوصف بالإنجليزية', 5000)).default(''),
  providerEn: yup.string().trim().max(100, validationMessages.maxLength('اسم المزود بالإنجليزية', 100)).default(''),
  locationEn: yup.string().trim().max(100, validationMessages.maxLength('الموقع بالإنجليزية', 100)).default(''),
});

export type CreateJobFormData = yup.InferType<typeof createJobSchema>;

export const updateJobSchema = yup.object({
  title: yup
    .string()
    .min(2, validationMessages.minLength('عنوان الوظيفة', 2))
    .max(200, validationMessages.maxLength('عنوان الوظيفة', 200))
    .required(validationMessages.required('عنوان الوظيفة')),

  description: yup.string().nullable().default(null),

  provider: yup
    .string()
    .min(2, validationMessages.minLength('اسم المزود', 2))
    .max(100, validationMessages.maxLength('اسم المزود', 100))
    .required(validationMessages.required('اسم المزود')),

  phone: yup.string().nullable().default(null),

  location: yup
    .string()
    .min(2, validationMessages.minLength('الموقع', 2))
    .max(100, validationMessages.maxLength('الموقع', 100))
    .required(validationMessages.required('الموقع')),

  salary: yup.string().nullable().default(null),

  deadline: yup
    .mixed()
    .nullable()
    .default(null)
    .test('is-date', validationMessages.invalidDate, value => {
      if (!value) return true;
      if (value instanceof Date) return !isNaN(value.getTime());
      if (typeof value === 'string') {
        const date = new Date(value);
        return !isNaN(date.getTime());
      }
      return false;
    })
    .transform((value, originalValue) => {
      if (!originalValue) return null;
      if (originalValue instanceof Date) return originalValue;
      if (typeof originalValue === 'string') return new Date(originalValue);
      return null;
    }),

  active: yup.boolean().default(true),

  // English version (optional; the Arabic text is shown when it is empty).
  titleEn: yup.string().trim().max(200, validationMessages.maxLength('العنوان بالإنجليزية', 200)).default(''),
  descriptionEn: yup.string().trim().max(5000, validationMessages.maxLength('الوصف بالإنجليزية', 5000)).default(''),
  providerEn: yup.string().trim().max(100, validationMessages.maxLength('اسم المزود بالإنجليزية', 100)).default(''),
  locationEn: yup.string().trim().max(100, validationMessages.maxLength('الموقع بالإنجليزية', 100)).default(''),
});

type YupUpdateJobFormData = yup.InferType<typeof updateJobSchema>;

export type UpdateJobFormData = {
  title: string;
  description: YupUpdateJobFormData['description'];
  provider: string;
  phone: YupUpdateJobFormData['phone'];
  location: string;
  salary: YupUpdateJobFormData['salary'];
  deadline: YupUpdateJobFormData['deadline'];
  active: boolean;
  titleEn?: string;
  descriptionEn?: string;
  providerEn?: string;
  locationEn?: string;
};

