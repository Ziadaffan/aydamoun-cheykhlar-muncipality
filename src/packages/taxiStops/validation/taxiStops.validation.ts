import * as yup from 'yup';
import { validationMessages } from '@/packages/common/validation/common.validation';

export const createTaxiStopSchema = yup.object({
  name: yup
    .string()
    .min(2, validationMessages.minLength('اسم موقف التاكسي', 2))
    .max(150, validationMessages.maxLength('اسم موقف التاكسي', 150))
    .required(validationMessages.required('اسم موقف التاكسي')),

  fromLocation: yup
    .string()
    .min(2, validationMessages.minLength('من', 2))
    .max(150, validationMessages.maxLength('من', 150))
    .required(validationMessages.required('من')),

  toLocation: yup
    .string()
    .min(2, validationMessages.minLength('إلى', 2))
    .max(150, validationMessages.maxLength('إلى', 150))
    .required(validationMessages.required('إلى')),

  hour: yup
    .string()
    .min(2, validationMessages.minLength('الساعة', 2))
    .max(50, validationMessages.maxLength('الساعة', 50))
    .required(validationMessages.required('الساعة')),

  phone: yup
    .string()
    .matches(/^[0-9+\s-]{7,20}$/, 'يرجى إدخال رقم هاتف صحيح')
    .required(validationMessages.required('رقم الهاتف')),
});

export type CreateTaxiStopFormData = yup.InferType<typeof createTaxiStopSchema>;

export const updateTaxiStopSchema = yup.object({
  name: yup
    .string()
    .min(2, validationMessages.minLength('اسم موقف التاكسي', 2))
    .max(150, validationMessages.maxLength('اسم موقف التاكسي', 150))
    .required(validationMessages.required('اسم موقف التاكسي')),

  fromLocation: yup
    .string()
    .min(2, validationMessages.minLength('من', 2))
    .max(150, validationMessages.maxLength('من', 150))
    .required(validationMessages.required('من')),

  toLocation: yup
    .string()
    .min(2, validationMessages.minLength('إلى', 2))
    .max(150, validationMessages.maxLength('إلى', 150))
    .required(validationMessages.required('إلى')),

  hour: yup
    .string()
    .min(2, validationMessages.minLength('الساعة', 2))
    .max(50, validationMessages.maxLength('الساعة', 50))
    .required(validationMessages.required('الساعة')),

  phone: yup
    .string()
    .matches(/^[0-9+\s-]{7,20}$/, 'يرجى إدخال رقم هاتف صحيح')
    .required(validationMessages.required('رقم الهاتف')),
});

export type UpdateTaxiStopFormData = yup.InferType<typeof updateTaxiStopSchema>;
