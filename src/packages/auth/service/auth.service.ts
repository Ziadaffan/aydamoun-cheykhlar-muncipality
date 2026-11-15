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

  /**
   * New accounts are made with a phone number and a password. An email in the body is
   * ignored (older app versions still send one): email accounts are the existing ones,
   * and Google sign-in.
   */
  public async signup(data: any): Promise<User> {
    const phone = data.phone ? normalizePhone(data.phone) || null : null;

    if (!phone) {
      throw new BadRequestError('Phone is required', 'PHONE_REQUIRED');
    }

    if (!isValidPhone(phone)) {
      throw new BadRequestError('Invalid phone number', 'INVALID_PHONE');
    }

    if (!data.password) {
      throw new BadRequestError('Password is required', 'PASSWORD_REQUIRED');
    }

    assertStrongPassword(String(data.password));

    const existingUser = await this.repository.findFirst({
      where: {
        // The raw phone too: numbers stored before normalization keep their spaces/dashes.
        phone: { in: phoneLookupValues(String(data.phone)) },
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
