import { useRouter } from 'next/navigation';
import React from 'react';
import { TFunction } from 'i18next';

type Service = {
  id: string;
  name: string;
  description: string;
};

type ServiceCardProps = {
  num: number;
  service: Service;
  bgColor: string;
  t: TFunction<'translation', undefined>;
};

export default function ServiceCard({ service, bgColor, num, t }: ServiceCardProps) {
  const router = useRouter();
  return (
    <div className="relative h-70 w-100">
      <div className={`absolute -inset-4 rounded-2xl bg-gradient-to-r ${bgColor} opacity-10 blur-sm`}></div>
      <div className="relative flex h-full flex-col rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-600">#{num}</div>
          <div className="text-3xl">📋</div>
        </div>
        <h3 className="mb-3 text-xl font-bold text-gray-800">{service.name}</h3>
        <p className="flex-1 leading-relaxed text-gray-700">{service.description}</p>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push(`/services/forms/${service.id}`)}
            className={`w-full rounded-lg bg-gradient-to-r ${bgColor} cursor-pointer px-4 py-2 font-semibold text-white hover:opacity-80`}
          >
            {t('services.submitRequest.title')}
          </button>
        </div>
      </div>
    </div>
  );
}
