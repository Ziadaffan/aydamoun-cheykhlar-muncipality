import * as yup from 'yup';
import { commonValidations } from '../../common/validation/common.validation';

export const profileUpdateSchema = yup.object({
  name: yup.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم يجب أن يكون أقل من 50 حرف').required('الاسم مطلوب'),
  email: yup.string().email('يجب إدخال بريد إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
});

export const passwordChangeSchema = yup.object({
  oldPassword: yup.string().required('كلمة المرور الحالية مطلوبة'),
  newPassword: commonValidations
    .password()
    .notOneOf([yup.ref('oldPassword')], 'كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة'),
  confirmPassword: commonValidations.confirmPassword('newPassword'),
});

export type ProfileUpdateFormData = yup.InferType<typeof profileUpdateSchema>;
export type PasswordChangeFormData = yup.InferType<typeof passwordChangeSchema>;
