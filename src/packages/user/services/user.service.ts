import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { Role, User } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';
import bcrypt from 'bcryptjs';
import { BadRequestError, ConflictError, UnauthorizedError } from '@/packages/common/errors';
import { isValidPhone, normalizePhone, phoneLookupValues } from '@/packages/common/utils/phone.utils';
import { assertStrongPassword } from '@/packages/common/utils/password.utils';

export const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

// The session still points at an account that is gone (e.g. deleted from another device):
// 401 so clients drop the session instead of showing a form error.
const accountNotFound = () => new UnauthorizedError('User not found', 'USER_NOT_FOUND');
const invalidPassword = () => new BadRequestError('Invalid password', 'INVALID_PASSWORD');
const passwordRequired = () => new BadRequestError('Password is required', 'PASSWORD_REQUIRED');
const emailOrPhoneTaken = () => new ConflictError('Email or phone already in use', 'USER_EXISTS');

export class UserService extends BasePrismaService<'user'> {
  private static singleton: UserService;
  constructor(repository: UserRepository = new UserRepository()) {
    super(repository);
  }

  public static instance(): UserService {
    if (!UserService.singleton) {
      UserService.singleton = new UserService();
    }
    return UserService.singleton;
  }

  /** Public profile of the signed-in user, or null when the account no longer exists. */
  public async getProfile(id: string) {
    return this.repository.findUnique({ where: { id }, select: PUBLIC_USER_SELECT });
  }

  /**
   * Only profile fields can be changed here. Anything else in the body
   * (role, password, id, ...) is dropped so a user can't escalate themselves.
   */
  public async updateUser(id: string, data: Partial<Pick<User, 'name' | 'email' | 'phone'>>) {
    const updateData: Partial<Pick<User, 'name' | 'email' | 'phone'>> = {};

    if (data.name !== undefined) {
      const name = String(data.name).trim();
      if (!name) {
        throw new BadRequestError('Name is required');
      }
      updateData.name = name;
    }

    if (data.email !== undefined) {
      const email = data.email ? String(data.email).trim().toLowerCase() : null;
      updateData.email = email || null;
    }

    if (data.phone !== undefined) {
      updateData.phone = data.phone ? normalizePhone(data.phone) || null : null;
    }

    const current = await this.repository.findUnique({ where: { id } });
    if (!current) {
      throw accountNotFound();
    }

    // Only a changed number is checked, so a legacy number that predates the rule doesn't block a name edit.
    if (updateData.phone && updateData.phone !== current.phone && !isValidPhone(updateData.phone)) {
      throw new BadRequestError('Invalid phone number', 'INVALID_PHONE');
    }

    const nextEmail = updateData.email !== undefined ? updateData.email : current.email;
    const nextPhone = updateData.phone !== undefined ? updateData.phone : current.phone;

    if (!nextEmail && !nextPhone) {
      throw new BadRequestError('Email or phone is required', 'EMAIL_OR_PHONE_REQUIRED');
    }

    // A changed phone is also compared as typed: numbers stored before normalization keep their spaces/dashes.
    const phoneValues = updateData.phone ? phoneLookupValues(String(data.phone)) : nextPhone ? [nextPhone] : [];
    const conflicts = [...(nextEmail ? [{ email: nextEmail }] : []), ...(phoneValues.length ? [{ phone: { in: phoneValues } }] : [])];
    if (conflicts.length) {
      const taken = await this.repository.findFirst({
        where: { id: { not: id }, OR: conflicts },
      });
      if (taken) {
        throw emailOrPhoneTaken();
      }
    }

    try {
      return await this.repository.update({
        where: { id },
        data: updateData,
        select: PUBLIC_USER_SELECT,
      });
    } catch (error) {
      // Another account took the email/phone between the check above and this write.
      if ((error as { code?: string })?.code === 'P2002') {
        throw emailOrPhoneTaken();
      }
      throw error;
    }
  }

  public async updatePassword(id: string, oldPassword: string, newPassword: string) {
    if (!oldPassword || !newPassword) {
      throw passwordRequired();
    }

    const user = await this.repository.findUnique({ where: { id } });

    if (!user) {
      throw accountNotFound();
    }

    if (!user.password || !(await bcrypt.compare(String(oldPassword), user.password))) {
      throw invalidPassword();
    }

    if (oldPassword === newPassword) {
      throw new BadRequestError('New password cannot be the same as the old password', 'SAME_PASSWORD');
    }

    assertStrongPassword(String(newPassword));

    const hashedNewPassword = await bcrypt.hash(String(newPassword), 12);

    return this.repository.update({
      where: { id },
      data: { password: hashedNewPassword },
      select: PUBLIC_USER_SELECT,
    });
  }

  /**
   * Permanently removes the account. Submissions, sessions and accounts go with
   * it via ON DELETE CASCADE. Re-checks the password so a stolen session alone
   * can't destroy an account.
   */
  public async deleteAccount(id: string, password: string) {
    const user = await this.repository.findUnique({ where: { id } });

    if (!user) {
      throw accountNotFound();
    }

    if (user.password) {
      if (!password) {
        throw passwordRequired();
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw invalidPassword();
      }
    }

    await this.repository.delete({ where: { id } });
  }

  // ---- Admin ----

  public async listUsers() {
    return this.repository.findMany({
      select: { ...PUBLIC_USER_SELECT, _count: { select: { submissions: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Admin sets a temporary password; used for phone-only accounts that can't receive a reset email. */
  public async adminSetPassword(id: string, newPassword: string) {
    assertStrongPassword(newPassword);

    const user = await this.repository.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestError('User not found');
    }

    return this.repository.update({
      where: { id },
      data: { password: await bcrypt.hash(newPassword, 12) },
      select: PUBLIC_USER_SELECT,
    });
  }

  public async adminSetRole(id: string, role: Role, actingAdminId: string) {
    if (!Object.values(Role).includes(role)) {
      throw new BadRequestError('Invalid role');
    }
    if (id === actingAdminId && role !== Role.ADMIN) {
      throw new BadRequestError('You cannot remove your own admin role');
    }

    const user = await this.repository.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestError('User not found');
    }

    return this.repository.update({ where: { id }, data: { role }, select: PUBLIC_USER_SELECT });
  }
}
