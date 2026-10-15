import prisma from '@/packages/lib/db';

export class PushTokensRepository {
  constructor(private readonly prismaClient: typeof prisma = prisma) {}

  public upsert(token: string, platform: string) {
    return this.prismaClient.pushToken.upsert({
      where: { token },
      create: { token, platform },
      update: { platform },
    });
  }

  public findAllTokens() {
    return this.prismaClient.pushToken.findMany({ select: { token: true } });
  }

  public deleteMany(tokens: string[]) {
    return this.prismaClient.pushToken.deleteMany({ where: { token: { in: tokens } } });
  }
}
