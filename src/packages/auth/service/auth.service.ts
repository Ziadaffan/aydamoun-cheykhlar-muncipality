import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { AuthRepository } from '../repository/auth.repository';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { BadRequestError, ConflictError } from '@/packages/common/errors';
import { isValidPhone, normalizePhone, phoneLookupValues } from '@/packages/common/utils/phone.utils';
import { assertStrongPassword } from '@/packages/common/utils/password.utils';

const userExists = () => new ConflictError('User with this email or phone already exists', 'USER_EXISTS');

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

    const email = rawEmail ? rawEmail.toLowerCase() : null;
    const phone = data.phone ? normalizePhone(data.phone) || null : null;

    if (!email && !phone) {
      throw new BadRequestError('Email or phone is required', 'EMAIL_OR_PHONE_REQUIRED');
    }

    if (phone && !isValidPhone(phone)) {
      throw new BadRequestError('Invalid phone number', 'INVALID_PHONE');
    }

    if (!data.password) {
      throw new BadRequestError('Password is required', 'PASSWORD_REQUIRED');
    }

    assertStrongPassword(String(data.password));

    const existingUser = await this.repository.findFirst({
      where: {
        // The raw phone too: numbers stored before normalization keep their spaces/dashes.
        OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone: { in: phoneLookupValues(String(data.phone)) } }] : [])],
      },
    });

    if (existingUser) {
      throw userExists();
    }

    const hashedPassword = await bcrypt.hash(String(data.password), 12);

    try {
      return await this.repository.create({
        data: {
          name: data.name,
          email,
          phone,
          password: hashedPassword,
        },
      });
    } catch (error) {
      // Two signups racing for the same email/phone: the unique index catches the second.
      if ((error as { code?: string })?.code === 'P2002') {
        throw userExists();
      }
      throw error;
    }
  }
}
