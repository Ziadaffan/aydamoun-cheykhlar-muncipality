import { Service, ServiceSubmission, User } from '@prisma/client';

export type AdminServiceSubmission = ServiceSubmission & {
  user?: User | null;
  service?: Service | null;
};
