import { TFunction } from 'i18next';
import React from 'react';
import Image from 'next/image';
import { Council } from '@prisma/client';

type AboutUsConcilMembersSectionProps = {
  t: TFunction;
  councilMembers: Council[];
};

export default function AboutUsConcilMembersSection({ t, councilMembers }: AboutUsConcilMembersSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-800 md:text-4xl">{t('aboutUs.council.title')}</h2>
          <p className="mb-12 text-center text-lg text-gray-600">{t('aboutUs.council.subtitle')}</p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {councilMembers.map(member => (
              <div key={member.id} className="group rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-6 flex justify-center">
                  <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg">
                    {member.image ? (
                      <Image
                        src={`/assets/images/${member.image}`}
                        alt={member.name}
                        className="h-full w-full object-cover"
                        width={192}
                        height={192}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0"></div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="mb-3 text-xl font-bold text-gray-800">{member.name}</h3>
                  <p className="mb-4 text-lg font-semibold text-blue-600">{member.position}</p>

                  <div className="mb-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">رقم الهاتف:</span>{' '}
                      <span dir="ltr" className="inline-block">
                        {member.phone || 'غير متوفر'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
