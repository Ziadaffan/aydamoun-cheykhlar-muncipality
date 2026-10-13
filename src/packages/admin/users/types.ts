import { Role } from '@prisma/client';

export type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
  _count: { submissions: number };
};
