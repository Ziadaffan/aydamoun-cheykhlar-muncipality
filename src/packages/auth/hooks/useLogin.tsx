import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

export interface LoginData {
  identifier: string;
  password: string;
}

export default function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

const login = async (data: LoginData) => {
  try {
    const identifier = data.identifier.trim();
    const result = await signIn('credentials', {
      // Phones are sent as typed: the server normalizes them and still matches numbers stored before that.
      identifier: identifier.includes('@') ? identifier.toLowerCase() : identifier,
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
