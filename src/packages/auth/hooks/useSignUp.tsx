import { useMutation } from '@tanstack/react-query';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}

const signUp = async (data: SignUpData) => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('المستخدم موجود بالفعل');
      }
      throw new Error('حدث خطأ أثناء إنشاء الحساب"');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};
