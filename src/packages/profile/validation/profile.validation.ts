import * as yup from 'yup';

export const profileUpdateSchema = yup.object({
  name: yup.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم يجب أن يكون أقل من 50 حرف').required('الاسم مطلوب'),
  email: yup.string().email('يجب إدخال بريد إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
});

export const passwordChangeSchema = yup.object({
  oldPassword: yup.string().required('كلمة المرور الحالية مطلوبة'),
  newPassword: yup.string().min(6, 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل').required('كلمة المرور الجديدة مطلوبة'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور الجديدة مطلوب'),
});

export type ProfileUpdateFormData = yup.InferType<typeof profileUpdateSchema>;
export type PasswordChangeFormData = yup.InferType<typeof passwordChangeSchema>;
