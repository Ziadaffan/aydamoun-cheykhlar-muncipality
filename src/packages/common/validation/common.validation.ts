import * as yup from 'yup';

// Common validation patterns
export const phonePattern = /^[+]?[\d\s\-\(\)]+$/;
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

// Common validation messages
export const validationMessages = {
  required: (field: string) => `${field} مطلوب`,
  email: 'يجب إدخال بريد إلكتروني صحيح',
  minLength: (field: string, min: number) => `${field} يجب أن يكون ${min} أحرف على الأقل`,
  maxLength: (field: string, max: number) => `${field} يجب أن يكون أقل من ${max} حرف`,
  invalidPhone: 'رقم الهاتف غير صحيح',
  invalidPassword: 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل',
  passwordMismatch: 'كلمات المرور غير متطابقة',
  invalidFileSize: 'حجم الملف يجب أن يكون أقل من 5 ميجابايت',
  invalidFileType: 'نوع الملف غير مدعوم. يرجى استخدام PDF، Word، أو صور',
};

// Common field validations
export const commonValidations = {
  name: (fieldName: string = 'الاسم') =>
    yup
      .string()
      .min(2, validationMessages.minLength(fieldName, 2))
      .max(50, validationMessages.maxLength(fieldName, 50))
      .required(validationMessages.required(fieldName)),

  email: () => yup.string().email(validationMessages.email).required(validationMessages.required('البريد الإلكتروني')),

  phone: () =>
    yup
      .string()
      .matches(phonePattern, validationMessages.invalidPhone)
      .min(8, validationMessages.minLength('رقم الهاتف', 8))
      .required(validationMessages.required('رقم الهاتف')),

  address: () =>
    yup
      .string()
      .min(5, validationMessages.minLength('العنوان', 5))
      .max(200, validationMessages.maxLength('العنوان', 200))
      .required(validationMessages.required('العنوان')),

  description: () =>
    yup
      .string()
      .min(10, validationMessages.minLength('الوصف', 10))
      .max(1000, validationMessages.maxLength('الوصف', 1000))
      .required(validationMessages.required('الوصف')),

  password: () =>
    yup
      .string()
      .min(6, validationMessages.minLength('كلمة المرور', 6))
      .matches(passwordPattern, validationMessages.invalidPassword)
      .required(validationMessages.required('كلمة المرور')),

  confirmPassword: (passwordField: string = 'password') =>
    yup
      .string()
      .oneOf([yup.ref(passwordField)], validationMessages.passwordMismatch)
      .required(validationMessages.required('تأكيد كلمة المرور')),

  documents: () =>
    yup.array().of(
      yup
        .mixed()
        .test('file-size', validationMessages.invalidFileSize, value => !value || (value as File)?.size <= 5 * 1024 * 1024)
        .test(
          'file-type',
          validationMessages.invalidFileType,
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
};
