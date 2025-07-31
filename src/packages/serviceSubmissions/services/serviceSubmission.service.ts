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

  public async getServiceSubmissionByUserId(userId: string, submissionId: string): Promise<ServiceSubmission> {
    const serviceSubmission = await this.repository.findUnique({ where: { id: submissionId, userId }, include: { service: true } });

    if (!serviceSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    return serviceSubmission;
  }

  public async getServiceSubmissionById(id: string, serviceId: string): Promise<ServiceSubmission> {
    const serviceSubmission = await this.repository.findUnique({ where: { id, serviceId } });

    if (!serviceSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    return serviceSubmission;
  }

  public async getServiceSubmissionsByUserId(userId: string): Promise<ServiceSubmission[]> {
    return this.repository.findMany({ where: { userId }, include: { service: true } });
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

  public async updateServiceSubmission(id: string, userId: string, data: any): Promise<ServiceSubmission> {
    const serviceSubmission = await this.repository.findUnique({ where: { id, userId: userId } });

    if (!serviceSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    return this.repository.update({
      where: { id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        description: data.description,
        additionalInfo: data.additionalInfo,
      },
    });
  }

  public async deleteServiceSubmission(id: string, userId: string): Promise<void> {
    const serviceSubmission = await this.repository.findUnique({ where: { id, userId: userId } });

    if (!serviceSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    await this.repository.delete({ where: { id } });
  }
}
