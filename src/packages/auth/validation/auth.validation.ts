import * as yup from 'yup';
import { commonValidations } from '../../common/validation/common.validation';
import { isValidPhone, normalizePhone } from '../../common/utils/phone.utils';

// The server's rule (and the app's): Arabic-Indic digits, spaces, dashes, dots, slashes and
// parentheses are accepted and normalized away; 6 to 15 digits remain.
const phoneOk = (value: string) => isValidPhone(normalizePhone(value));

export const loginSchema = yup.object({
  identifier: yup
    .string()
    .trim()
    .required('البريد الإلكتروني أو رقم الهاتف مطلوب')
    .test('email-or-phone', 'يجب إدخال بريد إلكتروني صحيح أو رقم هاتف صحيح', value => {
      if (!value) return false;
      const v = value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      return emailOk || phoneOk(v);
    }),
  // No length or pattern rule here: the server never enforced one before, so older passwords must still log in.
  password: yup.string().required('كلمة المرور مطلوبة'),
});

export const signupSchema = yup.object({
  name: yup.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم يجب أن يكون أقل من 50 حرف').required('الاسم مطلوب'),
  email: yup
    .string()
    .trim()
    .optional()
    .test('email', 'يجب إدخال بريد إلكتروني صحيح', value => {
      if (!value) return true;
      const v = value.trim();
      if (!v) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    })
    .test('email-or-phone-required', 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف (أحدهما مطلوب)', function (value) {
      const email = value?.trim() || '';
      const phone = (this.parent?.phone || '').trim();
      return !!email || !!phone;
    }),
  phone: yup
    .string()
    .trim()
    .optional()
    .test('phone', 'يرجى إدخال رقم هاتف صحيح', value => {
      if (!value) return true;
      const v = value.trim();
      if (!v) return true;
      return phoneOk(v);
    })
    .test('email-or-phone-required', 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف (أحدهما مطلوب)', function (value) {
      const phone = value?.trim() || '';
      const email = (this.parent?.email || '').trim();
      return !!email || !!phone;
    }),
  password: commonValidations.password(),
  confirmPassword: commonValidations.confirmPassword(),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignupFormData = yup.InferType<typeof signupSchema>;

export const forgotPasswordSchema = yup.object({
  email: yup.string().trim().email('يجب إدخال بريد إلكتروني صحيح').required('البريد الإلكتروني مطلوب'),
});

export const resetPasswordSchema = yup.object({
  password: commonValidations.password(),
  confirmPassword: commonValidations.confirmPassword(),
});

export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
