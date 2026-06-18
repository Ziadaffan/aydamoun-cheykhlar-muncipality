'use client';

import Banner from '@/packages/common/components/Banner';

type InfoMessageProps = {
  message: { type: 'success' | 'error'; text: string } | null;
  onClose: () => void;
};

export default function InfoMessage({ message, onClose }: InfoMessageProps) {
  if (!message) {
    return null;
  }

  return <Banner type={message.type} message={message.text} onClose={onClose} />;
}
