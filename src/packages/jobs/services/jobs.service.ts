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

  public async getJobById(id: string): Promise<Jobs | null> {
    return this.repository.findUnique({ where: { id } });
  }

  public async create(jobData: Omit<Jobs, 'id' | 'createdAt' | 'updatedAt'>): Promise<Jobs> {
    try {
      const job = await this.repository.create({
        data: jobData,
      });
      return job;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  public async updateJob(id: string, jobData: Omit<Jobs, 'id' | 'createdAt' | 'updatedAt'>): Promise<Jobs> {
    try {
      const job = await this.repository.update({
        where: { id },
        data: jobData,
      });
      return job;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  public async deleteJob(id: string): Promise<boolean> {
    try {
      await this.repository.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      return false;
    }
  }
}
