import * as yup from 'yup';
import { ServiceStatus } from '@prisma/client';
import { toDateOnly } from '@/packages/services/utils/form.utils';
import type { ServiceField } from '@/packages/services/utils/serviceFields';
import { commonValidations, localizedMessage, validationMessages } from '../../common/validation/common.validation';
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

// Validation of the service's extra fields (service.fields, resolved by the API).
const createAdditionalInfoSchema = (fields: ServiceField[]) => {
  const schemaObject: Record<string, any> = {};

  fields.forEach(field => {
    let fieldSchema: any;
    // The field's own Arabic and English labels (admin-defined, so not in validationMessages' name list).
    const ar = field.label;
    const en = field.labelEn?.trim() || field.label;
    const required = (schema: any) => (field.required ? schema.required(localizedMessage(`${ar} مطلوب`, `${en} is required`)) : schema);

    switch (field.kind) {
      case 'number':
        // An empty optional input is '' : no value rather than "not a number".
        fieldSchema = required(
          yup
            .number()
            .transform((value: unknown, original: unknown) => (original === '' || original === null ? undefined : value))
            .typeError(localizedMessage(`${ar} يجب أن يكون رقماً`, `${en} must be a number`))
        );
        break;

      case 'select':
        fieldSchema = yup.string().transform((value: unknown) => (value === '' ? undefined : value));
        if (field.options && field.options.length > 0) {
          fieldSchema = fieldSchema.oneOf(field.options, localizedMessage(`يرجى اختيار ${ar} صحيح`, `Please choose a valid ${en}`));
        }
        fieldSchema = required(fieldSchema);
        break;

      case 'date':
        // Kept as the input's 'YYYY-MM-DD' (yup.date() would store the browser's local
        // midnight as a UTC timestamp, a day off in other readers).
        fieldSchema = required(
          yup
            .string()
            .transform((value: unknown) => (typeof value === 'string' && value ? toDateOnly(value) : undefined))
            .matches(/^\d{4}-\d{2}-\d{2}$/, localizedMessage(`${ar} يجب أن يكون تاريخاً صحيحاً`, `${en} must be a valid date`))
        );
        break;

      case 'textarea':
        fieldSchema = required(yup.string().trim().max(1000, localizedMessage(`${ar} يجب أن يكون أقل من 1000 حرف`, `${en} must be less than 1000 characters`)));
        break;

      default:
        fieldSchema = required(yup.string().trim());
    }

    schemaObject[field.key] = fieldSchema;
  });

  return yup.object(schemaObject);
};

// Service submission validation schema factory
export const createServiceSubmissionSchema = (fields: ServiceField[]) => {
  return yup.object({
    // Personal Information
    fullName: commonValidations.name('الاسم الكامل').max(100, validationMessages.maxLength('الاسم الكامل', 100)),
    phone: requestPhone(),
    email: requestEmail(),
    address: commonValidations.address(),

    // Service Information
    serviceType: yup.string().required(validationMessages.required('نوع الخدمة')),
    description: commonValidations.description(),

    // Additional Information (the service's own fields)
    additionalInfo: createAdditionalInfoSchema(fields),

    // Status (used by admin)
    status: yup
      .mixed<ServiceStatus>()
      .oneOf(Object.values(ServiceStatus) as ServiceStatus[], localizedMessage('حالة الطلب غير صالحة', 'Invalid request status'))
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
  additionalInfo: yup.object().test('additional-info-validation', localizedMessage('يرجى ملء جميع الحقول المطلوبة', 'Please fill in all required fields'), function (value) {
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
