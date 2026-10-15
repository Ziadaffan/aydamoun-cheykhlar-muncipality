import { UnprocessableEntityError } from '@/packages/common/errors';
import { passwordPattern } from '@/packages/common/validation/common.validation';

export const PASSWORD_MIN_LENGTH = 6;

// Same wording as the website form messages (common.validation.ts).
const WEAK_PASSWORD_MESSAGE = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل، وأن تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل';

/**
 * The website forms' rule (common.validation.ts): 6+ characters with a lower-case letter,
 * an upper-case letter and a digit. For NEW passwords only: logins and "current password"
 * checks still accept older, weaker passwords.
 */
export function isStrongPassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH && passwordPattern.test(password);
}

/**
 * Throws 422 WEAK_PASSWORD. Not a 400: app 1.1.0 reads any 400 from PATCH /api/user as
 * "wrong current password" and shows the `error` text of other failures as is, hence the
 * Arabic text. Current clients map the code.
 */
export function assertStrongPassword(password: string): void {
  if (!isStrongPassword(password)) {
    throw new UnprocessableEntityError(WEAK_PASSWORD_MESSAGE, 'WEAK_PASSWORD');
  }
}
