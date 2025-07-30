import * as yup from 'yup';
import { getAdditionalFields } from '@/packages/services/forms/utils/form.utils';

// Login validation schema
export const loginSchema = yup.object({
  email: yup.string().email('يجب إدخال بريد إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
  password: yup.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').required('كلمة المرور مطلوبة'),
});

// Signup validation schema
export const signupSchema = yup.object({
  name: yup.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم يجب أن يكون أقل من 50 حرف').required('الاسم مطلوب'),
  email: yup.string().email('يجب إدخال بريد إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل')
    .required('كلمة المرور مطلوبة'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
});

// Helper function to create dynamic validation schema for additional fields
const createAdditionalInfoSchema = (category: string) => {
  const additionalFields = getAdditionalFields(category);
  const schemaObject: Record<string, any> = {};

  additionalFields.forEach(field => {
    let fieldSchema: any;

    switch (field.type) {
      case 'text':
        fieldSchema = yup.string().trim();
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.label} مطلوب`);
        }
        break;

      case 'number':
        fieldSchema = yup.number().typeError(`${field.label} يجب أن يكون رقماً`);
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.label} مطلوب`);
        }
        break;

      case 'select':
        fieldSchema = yup.string();
        if (field.options && field.options.length > 0) {
          fieldSchema = fieldSchema.oneOf(field.options, `يرجى اختيار ${field.label} صحيح`);
        }
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.label} مطلوب`);
        }
        break;

      case 'radio':
        fieldSchema = yup.string();
        if (field.options && field.options.length > 0) {
          fieldSchema = fieldSchema.oneOf(field.options, `يرجى اختيار ${field.label} صحيح`);
        }
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.label} مطلوب`);
        }
        break;

      case 'date':
        fieldSchema = yup.date().typeError(`${field.label} يجب أن يكون تاريخاً صحيحاً`);
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.label} مطلوب`);
        }
        break;

      default:
        fieldSchema = yup.string();
        if (field.required) {
          fieldSchema = fieldSchema.required(`${field.label} مطلوب`);
        }
    }

    schemaObject[field.name] = fieldSchema;
  });

  return yup.object(schemaObject);
};

// Service submission validation schema factory
export const createServiceSubmissionSchema = (category: string) => {
  return yup.object({
    // Personal Information
    fullName: yup
      .string()
      .min(2, 'الاسم الكامل يجب أن يكون حرفين على الأقل')
      .max(100, 'الاسم الكامل يجب أن يكون أقل من 100 حرف')
      .required('الاسم الكامل مطلوب'),
    phone: yup
      .string()
      .matches(/^[+]?[\d\s\-\(\)]+$/, 'رقم الهاتف غير صحيح')
      .min(8, 'رقم الهاتف يجب أن يكون 8 أرقام على الأقل')
      .required('رقم الهاتف مطلوب'),
    email: yup.string().email('يجب إدخال بريد إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
    address: yup.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل').max(200, 'العنوان يجب أن يكون أقل من 200 حرف').required('العنوان مطلوب'),

    // Service Information
    serviceType: yup.string().required('نوع الخدمة مطلوب'),
    description: yup.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل').max(1000, 'الوصف يجب أن يكون أقل من 1000 حرف').required('الوصف مطلوب'),

    // Additional Information (dynamic fields based on category)
    additionalInfo: createAdditionalInfoSchema(category),

    // Documents (optional)
    documents: yup.array().of(
      yup
        .mixed()
        .test('file-size', 'حجم الملف يجب أن يكون أقل من 5 ميجابايت', value => !value || (value as File)?.size <= 5 * 1024 * 1024)
        .test(
          'file-type',
          'نوع الملف غير مدعوم. يرجى استخدام PDF، Word، أو صور',
          value =>
            !value ||
            [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'image/jpeg',
              'image/png',
            ].includes((value as File)?.type)
        )
    ),
  });
};

// Default service submission schema (for backward compatibility)
export const serviceSubmissionSchema = yup.object({
  // Personal Information
  fullName: yup
    .string()
    .min(2, 'الاسم الكامل يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم الكامل يجب أن يكون أقل من 100 حرف')
    .required('الاسم الكامل مطلوب'),
  phone: yup
    .string()
    .matches(/^[+]?[\d\s\-\(\)]+$/, 'رقم الهاتف غير صحيح')
    .min(8, 'رقم الهاتف يجب أن يكون 8 أرقام على الأقل')
    .required('رقم الهاتف مطلوب'),
  email: yup.string().email('يجب إدخال بريد إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
  address: yup.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل').max(200, 'العنوان يجب أن يكون أقل من 200 حرف').required('العنوان مطلوب'),

  // Service Information
  serviceType: yup.string().required('نوع الخدمة مطلوب'),
  description: yup.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل').max(1000, 'الوصف يجب أن يكون أقل من 1000 حرف').required('الوصف مطلوب'),

  // Additional Information (dynamic fields)
  additionalInfo: yup.object().test('additional-info-validation', 'يرجى ملء جميع الحقول المطلوبة', function (value) {
    // This will be handled dynamically based on the service category
    return true;
  }),

  // Documents (optional)
  documents: yup.array().of(
    yup
      .mixed()
      .test('file-size', 'حجم الملف يجب أن يكون أقل من 5 ميجابايت', value => !value || (value as File)?.size <= 5 * 1024 * 1024)
      .test(
        'file-type',
        'نوع الملف غير مدعوم. يرجى استخدام PDF، Word، أو صور',
        value =>
          !value ||
          [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
          ].includes((value as File)?.type)
      )
  ),
});

// Profile update validation schema
export const profileUpdateSchema = yup.object({
  name: yup.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم يجب أن يكون أقل من 50 حرف').required('الاسم مطلوب'),
  email: yup.string().email('يجب إدخال بريد إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
});

// Password change validation schema
export const passwordChangeSchema = yup.object({
  currentPassword: yup.string().required('كلمة المرور الحالية مطلوبة'),
  newPassword: yup
    .string()
    .min(6, 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'كلمة المرور الجديدة يجب أن تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل')
    .required('كلمة المرور الجديدة مطلوبة'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور الجديدة مطلوب'),
});

// Export types for TypeScript
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignupFormData = yup.InferType<typeof signupSchema>;
export type ServiceSubmissionFormData = yup.InferType<typeof serviceSubmissionSchema>;
export type ProfileUpdateFormData = yup.InferType<typeof profileUpdateSchema>;
export type PasswordChangeFormData = yup.InferType<typeof passwordChangeSchema>;

// Dynamic service submission types
export type DynamicServiceSubmissionFormData<T extends string> = yup.InferType<ReturnType<typeof createServiceSubmissionSchema>>;
