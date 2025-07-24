import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { ServicesRepository } from '../repository/services.repository';
import { Service } from '@prisma/client';

export class ServiceService extends BasePrismaService<'service'> {
  private static singleton: ServiceService;
  constructor(repository: ServicesRepository = new ServicesRepository()) {
    super(repository);
  }

  public static instance(): ServiceService {
    if (!ServiceService.singleton) {
      ServiceService.singleton = new ServiceService();
    }
    return ServiceService.singleton;
  }

  public async getServices(): Promise<Service[]> {
    return this.repository.findMany();
  }

  public async getServiceById(id: string): Promise<Service> {
    const service = await this.repository.findUnique({ where: { id } });

    if (!service) {
      throw new Error('Service not found');
    }

    return service;
  }
}
