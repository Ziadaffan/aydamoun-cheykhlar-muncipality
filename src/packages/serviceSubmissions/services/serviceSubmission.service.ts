import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { ServiceStatus, ServiceSubmission } from '@prisma/client';
import { ServiceSubmissionRepository } from '../repository/serviceSubmission.repository';
import { NotFoundError } from '@/packages/common/errors';

export class ServiceSubmissionService extends BasePrismaService<'serviceSubmission'> {
  private static singleton: ServiceSubmissionService;
  constructor(repository: ServiceSubmissionRepository = new ServiceSubmissionRepository()) {
    super(repository);
  }

  public static instance(): ServiceSubmissionService {
    if (!ServiceSubmissionService.singleton) {
      ServiceSubmissionService.singleton = new ServiceSubmissionService();
    }
    return ServiceSubmissionService.singleton;
  }

  public async getServiceSubmissions(): Promise<ServiceSubmission[]> {
    return this.repository.findMany();
  }

  public async getServiceSubmissionsByServiceId(id: string): Promise<ServiceSubmission[]> {
    return this.repository.findMany({ where: { serviceId: id } });
  }

  public async getServiceSubmissionById(id: string, serviceId: string): Promise<ServiceSubmission> {
    const serviceSubmission = await this.repository.findUnique({ where: { id, serviceId } });

    if (!serviceSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    return serviceSubmission;
  }

  public async createServiceSubmissions(id: string, data: any): Promise<ServiceSubmission> {
    return this.repository.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        description: data.description,
        additionalInfo: data.additionalInfo,
        status: ServiceStatus.PENDING,
        userId: data.userId,
        serviceId: id,
      },
    });
  }
}
