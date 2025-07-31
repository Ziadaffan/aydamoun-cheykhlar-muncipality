import * as yup from 'yup';
import { getAdditionalFields } from '@/packages/services/utils/form.utils';
import { commonValidations, validationMessages } from '../../common/validation/common.validation';

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
        fieldSchema = yup.date().typeError(`${field.label} يجب أن يكون تاريخاً صحيحاً`);
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
    phone: commonValidations.phone(),
    email: commonValidations.email(),
    address: commonValidations.address(),

    // Service Information
    serviceType: yup.string().required(validationMessages.required('نوع الخدمة')),
    description: commonValidations.description(),

    // Additional Information (dynamic fields based on category and serviceId)
    additionalInfo: createAdditionalInfoSchema(category, serviceId),
  });
};

// Default service submission schema (for backward compatibility)
export const serviceSubmissionSchema = yup.object({
  // Personal Information
  fullName: commonValidations.name('الاسم الكامل').max(100, validationMessages.maxLength('الاسم الكامل', 100)),
  phone: commonValidations.phone(),
  email: commonValidations.email(),
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
