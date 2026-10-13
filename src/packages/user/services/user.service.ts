import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { Role, User } from '@prisma/client';
import { commonValidations } from '@/packages/common/validation/common.validation';
import { UserRepository } from '../repository/user.repository';
import bcrypt from 'bcryptjs';
import { BadRequestError } from '@/packages/common/errors';

export const PUBLIC_USER_SELECT = { id: true, name: true, email: true, phone: true, role: true, createdAt: true, updatedAt: true } as const;

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
      const phone = data.phone ? String(data.phone).trim().replace(/\s|-/g, '') : null;
      updateData.phone = phone || null;
    }

    const current = await this.repository.findUnique({ where: { id } });
    if (!current) {
      throw new BadRequestError('User not found');
    }

    const nextEmail = updateData.email !== undefined ? updateData.email : current.email;
    const nextPhone = updateData.phone !== undefined ? updateData.phone : current.phone;

    if (!nextEmail && !nextPhone) {
      throw new BadRequestError('Email or phone is required');
    }

    const conflicts = [...(nextEmail ? [{ email: nextEmail }] : []), ...(nextPhone ? [{ phone: nextPhone }] : [])];
    if (conflicts.length) {
      const taken = await this.repository.findFirst({
        where: { id: { not: id }, OR: conflicts },
      });
      if (taken) {
        throw new BadRequestError('Email or phone already in use');
      }
    }

    return this.repository.update({
      where: { id },
      data: updateData,
      select: PUBLIC_USER_SELECT,
    });
  }

  public async updatePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.repository.findUnique({ where: { id } });

    if (!user || !user.password) {
      throw new BadRequestError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestError('Invalid password');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestError('New password cannot be the same as the old password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

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
      throw new BadRequestError('User not found');
    }

    if (user.password) {
      if (!password) {
        throw new BadRequestError('Password is required');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestError('Invalid password');
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
    try {
      commonValidations.password().validateSync(newPassword);
    } catch (e) {
      throw new BadRequestError((e as Error).message);
    }

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
