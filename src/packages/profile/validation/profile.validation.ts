import * as yup from 'yup';
import { commonValidations } from '../../common/validation/common.validation';

// An account may be registered with an email, a phone number, or both — so
// neither is required on its own, but at least one must remain set.
export const profileUpdateSchema = yup.object({
  name: yup.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم يجب أن يكون أقل من 50 حرف').required('الاسم مطلوب'),
  email: yup
    .string()
    .trim()
    .default('')
    .test('email', 'يجب إدخال بريد إلكتروني صحيح', value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    .test('email-or-phone-required', 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف (أحدهما مطلوب)', function (value) {
      return !!(value?.trim() || (this.parent?.phone || '').trim());
    }),
  phone: yup
    .string()
    .trim()
    .default('')
    .test('phone', 'يرجى إدخال رقم هاتف صحيح', value => !value || /^[0-9+\-\s]{6,20}$/.test(value))
    .test('email-or-phone-required', 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف (أحدهما مطلوب)', function (value) {
      return !!(value?.trim() || (this.parent?.email || '').trim());
    }),
});

export const passwordChangeSchema = yup.object({
  oldPassword: yup.string().required('كلمة المرور الحالية مطلوبة'),
  newPassword: commonValidations.password().notOneOf([yup.ref('oldPassword')], 'كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة'),
  confirmPassword: commonValidations.confirmPassword('newPassword'),
});

export type ProfileUpdateFormData = yup.InferType<typeof profileUpdateSchema>;
export type PasswordChangeFormData = yup.InferType<typeof passwordChangeSchema>;
