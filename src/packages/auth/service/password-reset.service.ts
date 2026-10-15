import { createHash, randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { BadRequestError } from '@/packages/common/errors';
import { assertStrongPassword } from '@/packages/common/utils/password.utils';
import { passwordResetEmail, sendMail } from '@/lib/mailer';
import { PasswordResetRepository } from '../repository/password-reset.repository';
import { AuthRepository } from '../repository/auth.repository';

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const RESEND_COOLDOWN_MS = 60 * 1000; // ignore repeat requests inside a minute
const IDENTIFIER_PREFIX = 'password-reset:';

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

/**
 * Email-based password reset backed by the VerificationToken table.
 * Only the SHA-256 of the token is stored, so a DB read can't be replayed.
 */
export class PasswordResetService extends BasePrismaService<'verificationToken'> {
  private static singleton: PasswordResetService;

  constructor(
    repository: PasswordResetRepository = new PasswordResetRepository(),
    private readonly users: AuthRepository = new AuthRepository()
  ) {
    super(repository);
  }

  public static instance(): PasswordResetService {
    if (!PasswordResetService.singleton) {
      PasswordResetService.singleton = new PasswordResetService();
    }
    return PasswordResetService.singleton;
  }

  /**
   * Silently no-ops when the email is unknown so callers can't enumerate accounts.
   */
  public async requestReset(rawEmail: string): Promise<void> {
    const email = String(rawEmail ?? '')
      .trim()
      .toLowerCase();
    if (!email) {
      throw new BadRequestError('Email is required', 'EMAIL_REQUIRED');
    }

    const user = await this.users.findUnique({ where: { email } });
    if (!user || !user.password) {
      return;
    }

    const identifier = `${IDENTIFIER_PREFIX}${user.id}`;

    const recent = await this.repository.findFirst({
      where: { identifier, expires: { gt: new Date(Date.now() + TOKEN_TTL_MS - RESEND_COOLDOWN_MS) } },
    });
    if (recent) {
      return;
    }

    const token = randomBytes(32).toString('hex');

    await this.repository.deleteMany({ where: { identifier } });
    await this.repository.create({
      data: { identifier, token: hashToken(token), expires: new Date(Date.now() + TOKEN_TTL_MS) },
    });

    const baseUrl = (process.env.NEXTAUTH_URL ?? '').replace(/\/$/, '');
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    await sendMail({ to: email, ...passwordResetEmail(resetUrl) });
  }

  public async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!token) {
      throw new BadRequestError('Invalid or expired token', 'INVALID_TOKEN');
    }

    assertStrongPassword(newPassword);

    const record = await this.repository.findUnique({ where: { token: hashToken(token) } });
    if (!record || !record.identifier.startsWith(IDENTIFIER_PREFIX)) {
      throw new BadRequestError('Invalid or expired token', 'INVALID_TOKEN');
    }

    if (record.expires.getTime() < Date.now()) {
      await this.repository.deleteMany({ where: { identifier: record.identifier } });
      throw new BadRequestError('Invalid or expired token', 'INVALID_TOKEN');
    }

    const userId = record.identifier.slice(IDENTIFIER_PREFIX.length);
    const hashed = await bcrypt.hash(newPassword, 12);

    await this.users.update({ where: { id: userId }, data: { password: hashed } });
    await this.repository.deleteMany({ where: { identifier: record.identifier } });
  }
}
