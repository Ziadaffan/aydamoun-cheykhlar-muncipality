import * as yup from 'yup';
import { commonValidations, localizedMessage } from '../../common/validation/common.validation';
import { isValidPhone, normalizePhone } from '../../common/utils/phone.utils';

// The server's rule (and the app's): Arabic-Indic digits, spaces, dashes, dots, slashes and
// parentheses are accepted and normalized away; 6 to 15 digits remain.
const phoneOk = (value: string) => isValidPhone(normalizePhone(value));

const phoneRequired = localizedMessage('رقم الهاتف مطلوب', 'Phone number is required');
const phoneInvalid = localizedMessage('يرجى إدخال رقم هاتف صحيح', 'Please enter a valid phone number');

// The field asks for a phone number; accounts made earlier with an email can still type it.
export const loginSchema = yup.object({
  identifier: yup
    .string()
    .trim()
    .required(phoneRequired)
    .test('email-or-phone', phoneInvalid, value => {
      if (!value) return false;
      const v = value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      return emailOk || phoneOk(v);
    }),
  // No length or pattern rule here: the server never enforced one before, so older passwords must still log in.
  password: yup.string().required(localizedMessage('كلمة المرور مطلوبة', 'Password is required')),
});

export const signupSchema = yup.object({
  name: yup
    .string()
    .min(2, localizedMessage('الاسم يجب أن يكون حرفين على الأقل', 'Name must be at least 2 characters'))
    .max(50, localizedMessage('الاسم يجب أن يكون أقل من 50 حرف', 'Name must be less than 50 characters'))
    .required(localizedMessage('الاسم مطلوب', 'Name is required')),
  // New accounts: phone + password (no email; the server ignores one).
  phone: yup
    .string()
    .trim()
    .required(phoneRequired)
    .test('phone', phoneInvalid, value => !!value && phoneOk(value)),
  password: commonValidations.password(),
  confirmPassword: commonValidations.confirmPassword(),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignupFormData = yup.InferType<typeof signupSchema>;

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email(localizedMessage('يجب إدخال بريد إلكتروني صحيح', 'Please enter a valid email address'))
    .required(localizedMessage('البريد الإلكتروني مطلوب', 'Email is required')),
});

export const resetPasswordSchema = yup.object({
  password: commonValidations.password(),
  confirmPassword: commonValidations.confirmPassword(),
});

export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
