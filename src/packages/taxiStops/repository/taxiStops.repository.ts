import prisma from '@/packages/lib/db';

type TaxiStopData = {
  name: string;
  fromLocation: string;
  toLocation: string;
  hour: string;
  phone: string;
};

export class TaxiStopsRepository {
  constructor(private readonly prismaClient: typeof prisma = prisma) {}

  public findMany() {
    return this.prismaClient.taxiStop.findMany({ orderBy: { createdAt: 'desc' } });
  }

  public findUnique(id: string) {
    return this.prismaClient.taxiStop.findUnique({ where: { id } });
  }

  public create(data: TaxiStopData) {
    return this.prismaClient.taxiStop.create({ data });
  }

  public update(id: string, data: TaxiStopData) {
    return this.prismaClient.taxiStop.update({ where: { id }, data });
  }

  public delete(id: string) {
    return this.prismaClient.taxiStop.delete({ where: { id } });
  }
}
