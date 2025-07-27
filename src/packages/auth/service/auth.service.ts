import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { AuthRepository } from '../repository/auth.repository';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { BadRequestError } from '@/packages/common/errors';

export class AuthService extends BasePrismaService<'user'> {
  private static singleton: AuthService;
  constructor(repository: AuthRepository = new AuthRepository()) {
    super(repository);
  }

  public static instance(): AuthService {
    if (!AuthService.singleton) {
      AuthService.singleton = new AuthService();
    }
    return AuthService.singleton;
  }

  public async signup(data: any): Promise<User> {
    const existingUser = await this.repository.findUnique({ where: { email: data.email } });

    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.repository.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
    return user;
  }
}
