import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('يجب إدخال بريد إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
  password: yup.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').required('كلمة المرور مطلوبة'),
});

export const signupSchema = yup.object({
  name: yup.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم يجب أن يكون أقل من 50 حرف').required('الاسم مطلوب'),
  email: yup.string().email('يجب إدخال بريد إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
  password: yup.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').required('كلمة المرور مطلوبة'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignupFormData = yup.InferType<typeof signupSchema>;
