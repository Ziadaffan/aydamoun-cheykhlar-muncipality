import prisma, { PrismaClient } from '@/packages/lib/db';

export class PrismaRepository<K extends Exclude<keyof PrismaClient, symbol | `$${string}`>> {
  constructor(
    protected readonly model: K,
    protected readonly client: PrismaClient = prisma
  ) {}

  aggregate(...args: Parameters<PrismaClient[K]['aggregate']>): ReturnType<PrismaClient[K]['aggregate']> {
    return (this.client[this.model].aggregate as any)(...args);
  }

  count(...args: Parameters<PrismaClient[K]['count']>): ReturnType<PrismaClient[K]['count']> {
    return (this.client[this.model].count as any)(...args);
  }

  create(...args: Parameters<PrismaClient[K]['create']>): ReturnType<PrismaClient[K]['create']> {
    return (this.client[this.model].create as any)(...args);
  }

  createMany(...args: Parameters<PrismaClient[K]['createMany']>): ReturnType<PrismaClient[K]['createMany']> {
    return (this.client[this.model].createMany as any)(...args);
  }

  delete(...args: Parameters<PrismaClient[K]['delete']>): ReturnType<PrismaClient[K]['delete']> {
    return (this.client[this.model].delete as any)(...args);
  }

  findFirst(...args: Parameters<PrismaClient[K]['findFirst']>): ReturnType<PrismaClient[K]['findFirst']> {
    return (this.client[this.model].findFirst as any)(...args);
  }

  findFirstOrThrow(...args: Parameters<PrismaClient[K]['findFirstOrThrow']>): ReturnType<PrismaClient[K]['findFirstOrThrow']> {
    return (this.client[this.model].findFirstOrThrow as any)(...args);
  }

  findMany(...args: Parameters<PrismaClient[K]['findMany']>): ReturnType<PrismaClient[K]['findMany']> {
    return (this.client[this.model].findMany as any)(...args);
  }

  findUnique(...args: Parameters<PrismaClient[K]['findUnique']>): ReturnType<PrismaClient[K]['findUnique']> {
    return (this.client[this.model].findUnique as any)(...args);
  }

  findUniqueOrThrow(...args: Parameters<PrismaClient[K]['findUniqueOrThrow']>): ReturnType<PrismaClient[K]['findUniqueOrThrow']> {
    return (this.client[this.model].findUniqueOrThrow as any)(...args);
  }

  update(...args: Parameters<PrismaClient[K]['update']>): ReturnType<PrismaClient[K]['update']> {
    return (this.client[this.model].update as any)(...args);
  }

  updateMany(...args: Parameters<PrismaClient[K]['updateMany']>): ReturnType<PrismaClient[K]['updateMany']> {
    return (this.client[this.model].updateMany as any)(...args);
  }

  upsert(...args: Parameters<PrismaClient[K]['upsert']>): ReturnType<PrismaClient[K]['upsert']> {
    return (this.client[this.model].upsert as any)(...args);
  }

  groupBy(...args: Parameters<PrismaClient[K]['groupBy']>): ReturnType<PrismaClient[K]['groupBy']> {
    return (this.client[this.model].groupBy as any)(...args);
  }
}
