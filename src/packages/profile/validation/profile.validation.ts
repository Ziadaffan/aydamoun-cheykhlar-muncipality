import * as yup from 'yup';
import { commonValidations, localizedMessage } from '../../common/validation/common.validation';
import { isValidPhone, normalizePhone } from '../../common/utils/phone.utils';

const emailOrPhoneRequired = localizedMessage(
  'يرجى إدخال البريد الإلكتروني أو رقم الهاتف (أحدهما مطلوب)',
  'Please enter an email or a phone number (one of them is required)'
);

// An account may be registered with an email, a phone number, or both — so
// neither is required on its own, but at least one must remain set.
export const profileUpdateSchema = yup.object({
  name: yup
    .string()
    .min(2, localizedMessage('الاسم يجب أن يكون حرفين على الأقل', 'Name must be at least 2 characters'))
    .max(50, localizedMessage('الاسم يجب أن يكون أقل من 50 حرف', 'Name must be less than 50 characters'))
    .required(localizedMessage('الاسم مطلوب', 'Name is required')),
  email: yup
    .string()
    .trim()
    .default('')
    .test(
      'email',
      localizedMessage('يجب إدخال بريد إلكتروني صحيح', 'Please enter a valid email address'),
      value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    )
    .test('email-or-phone-required', emailOrPhoneRequired, function (value) {
      return !!(value?.trim() || (this.parent?.phone || '').trim());
    }),
  phone: yup
    .string()
    .trim()
    .default('')
    // Same rule as the server: separators and Arabic-Indic digits are normalized away.
    .test(
      'phone',
      localizedMessage('يرجى إدخال رقم هاتف صحيح', 'Please enter a valid phone number'),
      value => !value || isValidPhone(normalizePhone(value))
    )
    .test('email-or-phone-required', emailOrPhoneRequired, function (value) {
      return !!(value?.trim() || (this.parent?.email || '').trim());
    }),
});

export const passwordChangeSchema = yup.object({
  oldPassword: yup.string().required(localizedMessage('كلمة المرور الحالية مطلوبة', 'Current password is required')),
  newPassword: commonValidations
    .password()
    .notOneOf(
      [yup.ref('oldPassword')],
      localizedMessage('كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة', 'The new password must be different from the current one')
    ),
  confirmPassword: commonValidations.confirmPassword('newPassword'),
});

export type ProfileUpdateFormData = yup.InferType<typeof profileUpdateSchema>;
export type PasswordChangeFormData = yup.InferType<typeof passwordChangeSchema>;
