import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

export interface LoginData {
  email: string;
  password: string;
}

export default function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

const login = async (data: LoginData) => {
  try {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error('INVALID_CREDENTIALS');
    }

    return result;
  } catch (error) {
    throw error;
  }
};
