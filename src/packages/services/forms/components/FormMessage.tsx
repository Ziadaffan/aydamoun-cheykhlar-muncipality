'use client';

import Banner from '@/packages/common/components/Banner';

type FormMessageProps = {
  message: { type: 'success' | 'error'; text: string } | null;
  onClose: () => void;
};

export default function FormMessage({ message, onClose }: FormMessageProps) {
  if (!message) {
    return null;
  }

  return <Banner type={message.type} message={message.text} onClose={onClose} />;
}
