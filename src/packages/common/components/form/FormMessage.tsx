import React from 'react';
import { X } from 'lucide-react';

interface FormMessageProps {
  message: { type: 'success' | 'error'; text: string } | null;
  onClose: () => void;
}

export default function FormMessage({ message, onClose }: FormMessageProps) {
  if (!message) return null;

  const isSuccess = message.type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconColor = isSuccess ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`mb-6 rounded-lg border p-4 ${bgColor} ${borderColor}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message.text}</p>
        </div>
        <button
          onClick={onClose}
          className={`ml-3 inline-flex h-5 w-5 items-center justify-center rounded-md ${iconColor} hover:bg-opacity-20 hover:bg-current`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
