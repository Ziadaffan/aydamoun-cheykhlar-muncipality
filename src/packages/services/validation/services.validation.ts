import * as yup from 'yup';
import { ServiceStatus } from '@prisma/client';
import { getAdditionalFields, toDateOnly } from '@/packages/services/utils/form.utils';
import { commonValidations, validationMessages } from '../../common/validation/common.validation';
import { isValidPhone, normalizePhone } from '@/packages/common/utils/phone.utils';

// Same rules as the mobile app's request form and the server (6–15 digits once
// spaces, dashes and Arabic-Indic digits are normalized); the number is sent normalized.
const requestPhone = () =>
  yup
    .string()
    .transform((value: unknown) => (typeof value === 'string' ? normalizePhone(value) : value))
    .required(validationMessages.required('رقم الهاتف'))
    .test('phone', validationMessages.invalidPhone, value => !value || isValidPhone(value));

// Optional, as in the app: accounts can be made with a phone number only.
const requestEmail = () =>
  yup
    .string()
    .trim()
    .email(validationMessages.email)
    .transform((value: unknown) => (value === '' ? null : value))
    .nullable();

// Helper function to create dynamic validation schema for additional fields
const createAdditionalInfoSchema = (category: string, serviceId?: string) => {
  const additionalFields = getAdditionalFields(category, serviceId);
  const schemaObject: Record<string, any> = {};

  additionalFields.forEach(field => {
    let fieldSchema: any;

    switch (field.type) {
      case 'text':
        fieldSchema = yup.string().trim();
        if (field.required) {
          fieldSchema = fieldSchema.required(validationMessages.required(field.label));
        }
        break;

      case 'number':
        fieldSchema = yup.number().typeError(`${field.label} يجب أن يكون رقماً`);
        if (field.required) {
          fieldSchema = fieldSchema.required(validationMessages.required(field.label));
        }
        break;

      case 'select':
        fieldSchema = yup.string();
        if (field.options && field.options.length > 0) {
          fieldSchema = fieldSchema.oneOf(field.options, `يرجى اختيار ${field.label} صحيح`);
        }
        if (field.required) {
          fieldSchema = fieldSchema.required(validationMessages.required(field.label));
        }
        break;

      case 'radio':
        fieldSchema = yup.string();
        if (field.options && field.options.length > 0) {
          fieldSchema = fieldSchema.oneOf(field.options, `يرجى اختيار ${field.label} صحيح`);
        }
        if (field.required) {
          fieldSchema = fieldSchema.required(validationMessages.required(field.label));
        }
        break;

      case 'date':
        // Kept as the input's 'YYYY-MM-DD' (yup.date() would store the browser's local
        // midnight as a UTC timestamp, a day off in other readers).
        fieldSchema = yup
          .string()
          .transform((value: unknown) => (typeof value === 'string' && value ? toDateOnly(value) : undefined))
          .matches(/^\d{4}-\d{2}-\d{2}$/, `${field.label} يجب أن يكون تاريخاً صحيحاً`);
        if (field.required) {
          fieldSchema = fieldSchema.required(validationMessages.required(field.label));
        }
        break;

      default:
        fieldSchema = yup.string();
        if (field.required) {
          fieldSchema = fieldSchema.required(validationMessages.required(field.label));
        }
    }

    schemaObject[field.name] = fieldSchema;
  });

  return yup.object(schemaObject);
};

// Service submission validation schema factory
export const createServiceSubmissionSchema = (category: string, serviceId?: string) => {
  return yup.object({
    // Personal Information
    fullName: commonValidations.name('الاسم الكامل').max(100, validationMessages.maxLength('الاسم الكامل', 100)),
    phone: requestPhone(),
    email: requestEmail(),
    address: commonValidations.address(),

    // Service Information
    serviceType: yup.string().required(validationMessages.required('نوع الخدمة')),
    description: commonValidations.description(),

    // Additional Information (dynamic fields based on category and serviceId)
    additionalInfo: createAdditionalInfoSchema(category, serviceId),

    // Status (used by admin)
    status: yup
      .mixed<ServiceStatus>()
      .oneOf(Object.values(ServiceStatus) as ServiceStatus[], 'حالة الطلب غير صالحة')
      .optional(),
  });
};

// Default service submission schema (for backward compatibility)
export const serviceSubmissionSchema = yup.object({
  // Personal Information
  fullName: commonValidations.name('الاسم الكامل').max(100, validationMessages.maxLength('الاسم الكامل', 100)),
  phone: requestPhone(),
  email: requestEmail(),
  address: commonValidations.address(),

  // Service Information
  serviceType: yup.string().required(validationMessages.required('نوع الخدمة')),
  description: commonValidations.description(),

  // Additional Information (dynamic fields)
  additionalInfo: yup.object().test('additional-info-validation', 'يرجى ملء جميع الحقول المطلوبة', function (value) {
    // This will be handled dynamically based on the service category
    return true;
  }),

  // Documents (optional)
  documents: commonValidations.documents(),
});

// Export types for TypeScript
export type ServiceSubmissionFormData = yup.InferType<typeof serviceSubmissionSchema>;

// Dynamic service submission types
export type DynamicServiceSubmissionFormData<T extends string> = yup.InferType<ReturnType<typeof createServiceSubmissionSchema>>;
