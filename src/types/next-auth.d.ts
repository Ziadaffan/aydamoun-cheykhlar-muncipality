import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      image?: string | null;
      role: string;
      createdAt: Date;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    image?: string | null;
    role: string;
    createdAt: Date;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    phone?: string | null;
    createdAt: Date;
  }
}
