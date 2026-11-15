import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { Prisma, Service, ServiceStatus, ServiceSubmission } from '@prisma/client';
import { ServiceSubmissionRepository } from '../repository/serviceSubmission.repository';
import { ConflictError, NotFoundError } from '@/packages/common/errors';
import { assertAdditionalInfoMatchesFields, SubmissionInput } from '../validation/submission.validation';
import { resolveServiceFields } from '@/packages/services/utils/serviceFields';
import prisma from '@/packages/lib/db';

// Never send the password hash along with a submission's user.
const SAFE_USER_SELECT = { id: true, name: true, email: true, phone: true, role: true, createdAt: true } as const;

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

  public async getServiceSubmissionsByServiceIdForUser(serviceId: string, userId: string): Promise<ServiceSubmission[]> {
    return this.repository.findMany({ where: { serviceId, userId } });
  }

  public async getServiceSubmissionByUserId(userId: string, submissionId: string): Promise<ServiceSubmission> {
    const serviceSubmission = await this.repository.findUnique({ where: { id: submissionId, userId }, include: { service: true } });

    if (!serviceSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    return serviceSubmission;
  }

  /**
   * Non-admin callers only get their own submission; anything else is reported
   * as not found so we don't reveal whether the id exists.
   */
  public async getServiceSubmissionById(
    id: string,
    serviceId: string,
    requester: { userId: string; isAdmin: boolean }
  ): Promise<ServiceSubmission> {
    const serviceSubmission = await this.repository.findUnique({
      where: { id, serviceId, ...(requester.isAdmin ? {} : { userId: requester.userId }) },
    });

    if (!serviceSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    return serviceSubmission;
  }

  public async getServiceSubmissionsByUserId(userId: string): Promise<ServiceSubmission[]> {
    return this.repository.findMany({ where: { userId }, include: { service: true }, orderBy: { createdAt: 'desc' } });
  }

  public async getAllServiceSubmissionsWithDetails(): Promise<ServiceSubmission[]> {
    return this.repository.findMany({
      include: { service: true, user: { select: SAFE_USER_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** `data` comes from parseSubmissionInput (validated, phone normalized). */
  public async createServiceSubmissions(serviceId: string, userId: string, data: SubmissionInput): Promise<ServiceSubmission> {
    return this.repository.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        description: data.description,
        additionalInfo: data.additionalInfo,
        status: ServiceStatus.PENDING,
        userId,
        serviceId,
      },
    });
  }

  /** The owner's edit; `data` comes from parseSubmissionUpdate. */
  public async updateServiceSubmission(id: string, userId: string, data: Partial<SubmissionInput>): Promise<ServiceSubmission> {
    const submission = await this.findPendingOwnSubmission(id, userId);
    if (data.additionalInfo) {
      assertAdditionalInfoMatchesFields(data.additionalInfo, await this.fieldsOfService(submission.serviceId));
    }

    return this.repository.update({ where: { id }, data });
  }

  public async deleteServiceSubmission(id: string, userId: string): Promise<void> {
    await this.findPendingOwnSubmission(id, userId);

    await this.repository.delete({ where: { id } });
  }

  /**
   * Residents can change or withdraw a request only while it is pending (the app and
   * the website offer it only then): once staff have started on it, it is theirs.
   */
  private async findPendingOwnSubmission(id: string, userId: string): Promise<ServiceSubmission> {
    const serviceSubmission = await this.repository.findUnique({ where: { id, userId } });

    if (!serviceSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    if (serviceSubmission.status !== ServiceStatus.PENDING) {
      throw new ConflictError('Only pending submissions can be changed', 'SUBMISSION_LOCKED');
    }

    return serviceSubmission;
  }

  public async getServiceSubmissionByIdAdmin(id: string): Promise<ServiceSubmission> {
    const serviceSubmission = await this.repository.findUnique({ where: { id }, include: { service: true, user: { select: SAFE_USER_SELECT } } });

    if (!serviceSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    return serviceSubmission;
  }

  /**
   * `data` is the body's status plus fields from parseSubmissionUpdate. Returns the
   * updated request (with its service) and the status it had before, so the caller
   * can tell the resident when it changed.
   */
  public async updateServiceSubmissionAsAdmin(
    id: string,
    data: Partial<SubmissionInput> & { status?: unknown }
  ): Promise<{ submission: ServiceSubmission & { service: Service }; previousStatus: ServiceStatus }> {
    const existingSubmission = (await this.repository.findUnique({ where: { id }, include: { service: true } })) as
      | (ServiceSubmission & { service: Service })
      | null;

    if (!existingSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    const { status, ...fields } = data;
    const updateData: Prisma.ServiceSubmissionUpdateInput = { ...fields };

    if (fields.additionalInfo) {
      assertAdditionalInfoMatchesFields(fields.additionalInfo, resolveServiceFields(existingSubmission.service), { requireAll: false });
    }

    if (typeof status === 'string' && Object.values(ServiceStatus).includes(status as ServiceStatus)) {
      updateData.status = status as ServiceStatus;
    }

    const submission = (await this.repository.update({
      where: { id },
      data: updateData,
      include: { service: true },
    })) as ServiceSubmission & { service: Service };

    return { submission, previousStatus: existingSubmission.status };
  }

  private async fieldsOfService(serviceId: string) {
    return resolveServiceFields(await prisma.service.findUnique({ where: { id: serviceId } }));
  }

  public async deleteServiceSubmissionAsAdmin(id: string): Promise<void> {
    const serviceSubmission = await this.repository.findUnique({ where: { id } });

    if (!serviceSubmission) {
      throw new NotFoundError('Service Submission not found');
    }

    await this.repository.delete({ where: { id } });
  }
}
