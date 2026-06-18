import { BasePrismaService } from '@/packages/common/services/prisma.service';
import { AboutUsRepository } from '../repository/about-us.repository';
import { Council } from '@prisma/client';

export class AboutUsService extends BasePrismaService<'council'> {
  private static singleton: AboutUsService;
  constructor(repository: AboutUsRepository = new AboutUsRepository()) {
    super(repository);
  }

  public static instance(): AboutUsService {
    if (!AboutUsService.singleton) {
      AboutUsService.singleton = new AboutUsService();
    }
    return AboutUsService.singleton;
  }

  public async getCouncilMembers(): Promise<Council[]> {
    return this.repository.findMany();
  }
}
