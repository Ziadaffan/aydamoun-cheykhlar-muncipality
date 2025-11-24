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
    .test('is-date', 'يجب أن يكون تاريخ صحيح', value => {
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
    .test('is-date', 'يجب أن يكون تاريخ صحيح', value => {
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
});

type YupUpdateJobFormData = yup.InferType<typeof updateJobSchema>;

export type UpdateJobFormData = {
  title: string;
  description: YupUpdateJobFormData['description'];
  provider: string;
  location: string;
  salary: YupUpdateJobFormData['salary'];
  deadline: YupUpdateJobFormData['deadline'];
  active: boolean;
};

