import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { JobsRepository } from '../repository/jobs.repository';
import { Jobs } from '@prisma/client';

export class JobsService extends BasePrismaService<'jobs'> {
  private static singleton: JobsService;

  constructor(repository: JobsRepository = new JobsRepository()) {
    super(repository);
  }

  public static instance(): JobsService {
    if (!JobsService.singleton) {
      JobsService.singleton = new JobsService();
    }
    return JobsService.singleton;
  }

  public async getJobs(): Promise<Jobs[]> {
    return this.repository.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } });
  }
}
