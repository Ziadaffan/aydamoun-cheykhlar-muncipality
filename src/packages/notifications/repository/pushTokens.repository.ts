import prisma from '@/packages/lib/db';

export type PushTokenUpsert = {
  token: string;
  platform: string;
  /** Undefined = keep the stored locale (new rows: 'ar'). */
  locale?: string;
  /** Undefined = keep the stored topics (new rows: the schema default, every topic). */
  topics?: string[];
  /** A string links the install to that user, null unlinks it, undefined keeps it. */
  userId?: string | null;
};

export class PushTokensRepository {
  constructor(private readonly prismaClient: typeof prisma = prisma) {}

  public upsert({ token, platform, locale, topics, userId }: PushTokenUpsert) {
    const optional = {
      ...(locale !== undefined && { locale }),
      ...(topics !== undefined && { topics }),
      ...(userId !== undefined && { userId }),
    };
    return this.prismaClient.pushToken.upsert({
      where: { token },
      create: { token, platform, ...optional },
      update: { platform, ...optional },
    });
  }

  /** Installs subscribed to `topic`. */
  public findByTopic(topic: string) {
    return this.prismaClient.pushToken.findMany({ where: { topics: { has: topic } }, select: { token: true, locale: true } });
  }

  /** One user's installs subscribed to `topic`. */
  public findByUserAndTopic(userId: string, topic: string) {
    return this.prismaClient.pushToken.findMany({
      where: { userId, topics: { has: topic } },
      select: { token: true, locale: true },
    });
  }

  public deleteByToken(token: string) {
    return this.prismaClient.pushToken.deleteMany({ where: { token } });
  }

  public deleteMany(tokens: string[]) {
    return this.prismaClient.pushToken.deleteMany({ where: { token: { in: tokens } } });
  }
}
