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
    const rawEmail = data.email ? String(data.email).trim() : '';
    const rawPhone = data.phone ? String(data.phone).trim() : '';

    const email = rawEmail ? rawEmail.toLowerCase() : null;
    const phone = rawPhone ? rawPhone.replace(/\s|-/g, '') : null;

    if (!email && !phone) {
      throw new BadRequestError('Email or phone is required');
    }

    const existingUser = await this.repository.findFirst({
      where: {
        OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
      },
    });

    if (existingUser) {
      throw new BadRequestError('User with this email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.repository.create({
      data: {
        name: data.name,
        email,
        phone,
        password: hashedPassword,
      },
    });
    return user;
  }
}
