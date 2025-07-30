import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { User } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';
import bcrypt from 'bcryptjs';
import { BadRequestError } from '@/packages/common/errors';

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

  public async updateUser(id: string, data: Partial<User>) {
    return this.repository.update({
      where: { id },
      data,
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
    });
  }
}
