import { useMutation } from '@tanstack/react-query';
import { isApiError, readApiError } from '@/packages/common/utils/api-error.utils';

export interface SignUpData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

// Server rejections the form explains with their own message; anything else is SIGNUP_FAILED.
const KNOWN_CODES = ['WEAK_PASSWORD', 'INVALID_PHONE', 'EMAIL_OR_PHONE_REQUIRED'];

export default function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}

const signUp = async (data: SignUpData) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const info = await readApiError(response);
    // 409 USER_EXISTS now; a 400 with this message before the error codes were added.
    if (info.status === 409 || isApiError(info, 'USER_EXISTS', 'User with this email or phone already exists')) {
      throw new Error('USER_EXISTS');
    }
    throw new Error(info.code && KNOWN_CODES.includes(info.code) ? info.code : 'SIGNUP_FAILED');
  }

  return response.json();
};
