import * as yup from 'yup';

// Common validation patterns
export const phonePattern = /^[+]?[\d\s\-\(\)]+$/;
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

// Validation messages follow the visitor's language. They are yup message *functions*, resolved when a value is
// validated: the active language is read from <html lang> (kept in sync by src/i18n.ts), so this module stays free
// of i18next and is safe to import on the server, where messages are Arabic.
type LocalizedMessage = () => string;

const isEnglish = () => typeof document !== 'undefined' && document.documentElement.lang === 'en';

/** A yup message that shows `ar` or `en` depending on the site language at validation time. */
export const localizedMessage =
  (ar: string, en: string): LocalizedMessage =>
  () =>
    isEnglish() ? en : ar;

// English names of the Arabic field names passed to validationMessages.* across the site.
const FIELD_NAMES_EN: Record<string, string> = {
  الاسم: 'Name',
  'الاسم الكامل': 'Full name',
  'البريد الإلكتروني': 'Email',
  'رقم الهاتف': 'Phone number',
  العنوان: 'Title',
  النص: 'Text',
  الوصف: 'Description',
  'كلمة المرور': 'Password',
  'تأكيد كلمة المرور': 'Password confirmation',
  المنصب: 'Position',
  المهمة: 'Role',
  الاختصاص: 'Specialty',
  المفتاح: 'Key',
  التسمية: 'Label',
  الخيار: 'Option',
  'اسم الخدمة': 'Service name',
  'نوع الخدمة': 'Service type',
  الفئة: 'Category',
  الفترة: 'Period',
  'اسم موقف التاكسي': 'Taxi stop name',
  من: 'From',
  إلى: 'To',
  الساعة: 'Time',
  'عنوان الخبر': 'News title',
  'ملخص الخبر': 'News summary',
  'محتوى الخبر': 'News content',
  'فئة الخبر': 'News category',
  'اسم الكاتب': 'Author name',
  العلامات: 'Tags',
  الصور: 'Images',
  الملخص: 'Summary',
  المحتوى: 'Content',
  'عنوان الوظيفة': 'Job title',
  'اسم المزود': 'Provider name',
  الموقع: 'Location',
  'اسم المؤسسة': 'Association name',
  'صورة المؤسسة': 'Association image',
  'عنوان المستند': 'Document title',
  'وصف المستند': 'Document description',
  الملف: 'File',
};

/** English name of an Arabic field name; "X بالإنجليزية" / "X (بالإنجليزية)" become "X (English)". */
function fieldNameEn(field: string): string | undefined {
  const name = field.trim();
  const english = name.match(/^(.+?)\s*\(?بالإنجليزية\)?$/);
  if (english) {
    const base = FIELD_NAMES_EN[english[1].trim()];
    return base ? `${base} (English)` : undefined;
  }
  return FIELD_NAMES_EN[name] ?? (/[\u0600-\u06FF]/.test(name) ? undefined : name);
}

// Common validation messages
export const validationMessages = {
  required: (field: string) => {
    const en = fieldNameEn(field);
    return localizedMessage(`${field} مطلوب`, en ? `${en} is required` : 'This field is required');
  },
  email: localizedMessage('يجب إدخال بريد إلكتروني صحيح', 'Please enter a valid email address'),
  minLength: (field: string, min: number) => {
    const en = fieldNameEn(field);
    return localizedMessage(`${field} يجب أن يكون ${min} أحرف على الأقل`, `${en ?? 'This field'} must be at least ${min} characters`);
  },
  maxLength: (field: string, max: number) => {
    const en = fieldNameEn(field);
    return localizedMessage(`${field} يجب أن يكون أقل من ${max} حرف`, `${en ?? 'This field'} must be less than ${max} characters`);
  },
  invalidPhone: localizedMessage('رقم الهاتف غير صحيح', 'Invalid phone number'),
  invalidPassword: localizedMessage(
    'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل',
    'Password must contain at least one uppercase letter, one lowercase letter and one number'
  ),
  passwordMismatch: localizedMessage('كلمات المرور غير متطابقة', 'Passwords do not match'),
  invalidFileSize: localizedMessage('حجم الملف يجب أن يكون أقل من 5 ميجابايت', 'The file must be smaller than 5 MB'),
  invalidFileType: localizedMessage('نوع الملف غير مدعوم. يرجى استخدام PDF، Word، أو صور', 'Unsupported file type. Please use PDF, Word or images'),
  unsupportedFileType: localizedMessage('نوع الملف غير مدعوم', 'Unsupported file type'),
  imageTooLarge: localizedMessage('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'The image must be smaller than 5 MB'),
  chooseImage: localizedMessage('يرجى اختيار صورة', 'Please choose an image'),
  chooseFile: localizedMessage('يرجى اختيار ملف', 'Please choose a file'),
  invalidDate: localizedMessage('يجب أن يكون تاريخ صحيح', 'Please enter a valid date'),
  orderNumber: localizedMessage('الترتيب يجب أن يكون رقماً', 'Order must be a number'),
  orderInteger: localizedMessage('الترتيب يجب أن يكون رقماً صحيحاً', 'Order must be a whole number'),
  enterValidPhone: localizedMessage('يرجى إدخال رقم هاتف صحيح', 'Please enter a valid phone number'),
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
      // "العنوان" means both "title" and "address"; here it is the address.
      .min(5, localizedMessage('العنوان يجب أن يكون 5 أحرف على الأقل', 'Address must be at least 5 characters'))
      .max(200, localizedMessage('العنوان يجب أن يكون أقل من 200 حرف', 'Address must be less than 200 characters'))
      .required(localizedMessage('العنوان مطلوب', 'Address is required')),

  description: () =>
    yup
      .string()
      .min(10, validationMessages.minLength('الوصف', 10))
      .max(1000, validationMessages.maxLength('الوصف', 1000))
      .required(validationMessages.required('الوصف')),

  password: () =>
    yup
      .string()
      // "كلمة" is feminine, so the generic minLength wording ("يكون") doesn't fit here.
      .min(6, localizedMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Password must be at least 6 characters'))
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
