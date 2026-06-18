import * as yup from 'yup';
import { commonValidations } from '../../common/validation/common.validation';

export const loginSchema = yup.object({
  identifier: yup
    .string()
    .trim()
    .required('البريد الإلكتروني أو رقم الهاتف مطلوب')
    .test('email-or-phone', 'يجب إدخال بريد إلكتروني صحيح أو رقم هاتف صحيح', value => {
      if (!value) return false;
      const v = value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      const phoneOk = /^[0-9+\-\s]{6,20}$/.test(v);
      return emailOk || phoneOk;
    }),
  password: yup.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').required('كلمة المرور مطلوبة'),
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
      return /^[0-9+\-\s]{6,20}$/.test(v);
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
