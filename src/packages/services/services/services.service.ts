import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { ServicesRepository } from '../repository/services.repository';
import { Prisma, Service } from '@prisma/client';
import { ConflictError, NotFoundError } from '@/packages/common/errors';
import { resolveServiceFields, ServiceField } from '../utils/serviceFields';
import { ServiceInput } from '../validation/serviceAdmin.validation';
import { serviceMatchesSearch } from '../utils/service.utils';

/** A service as the API sends it: `fields` always filled (its own, or the category defaults). */
export type ApiService = Omit<Service, 'fields'> & { fields: ServiceField[]; hasCustomFields: boolean };

export function toApiService(service: Service): ApiService {
  return { ...service, fields: resolveServiceFields(service), hasCustomFields: Array.isArray(service.fields) };
}

const notFound = () => new NotFoundError('Service not found', 'SERVICE_NOT_FOUND');

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

  /**
   * Active services only, unless `includeInactive` (admin). `search` keeps those whose
   * name/description (Arabic or English) or type name contains it.
   */
  public async getServices({ includeInactive = false, search }: { includeInactive?: boolean; search?: string } = {}): Promise<ApiService[]> {
    const services: Service[] = await this.repository.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
    // A handful of services: filtering here also covers the type names, which aren't in the database.
    const matching = search?.trim() ? services.filter(service => serviceMatchesSearch(service, search)) : services;
    return matching.map(toApiService);
  }

  public async getServiceById(id: string): Promise<ApiService> {
    const service: Service | null = await this.repository.findUnique({ where: { id } });

    if (!service) {
      throw notFound();
    }

    return toApiService(service);
  }

  public async createService(input: ServiceInput): Promise<ApiService> {
    const service: Service = await this.repository.create({ data: toPrismaData(input) as Prisma.ServiceCreateInput });
    return toApiService(service);
  }

  public async updateService(id: string, input: Partial<ServiceInput>): Promise<ApiService> {
    await this.getServiceById(id);
    const service: Service = await this.repository.update({ where: { id }, data: toPrismaData(input) });
    return toApiService(service);
  }

  /** Services that already have requests can't be deleted (the admin deactivates them instead). */
  public async deleteService(id: string): Promise<void> {
    const service = (await this.repository.findUnique({ where: { id }, include: { _count: { select: { submissions: true } } } })) as
      | (Service & { _count: { submissions: number } })
      | null;

    if (!service) {
      throw notFound();
    }

    if (service._count.submissions > 0) {
      throw new ConflictError('Service has submissions', 'SERVICE_HAS_SUBMISSIONS');
    }

    await this.repository.delete({ where: { id } });
  }
}

// `fields: null` must be written as Prisma's DbNull (back to the category defaults).
function toPrismaData(input: Partial<ServiceInput>): Prisma.ServiceUpdateInput {
  const { fields, ...rest } = input;
  return {
    ...rest,
    ...(fields !== undefined && { fields: fields === null ? Prisma.DbNull : (fields as unknown as Prisma.InputJsonValue) }),
  };
}
