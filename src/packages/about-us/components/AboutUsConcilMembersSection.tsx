import { TFunction } from 'i18next';
import React from 'react';
import Image from 'next/image';
import { Council } from '@prisma/client';
import { getPositionLabel } from '@/packages/common/utils/position.utils';

type AboutUsConcilMembersSectionProps = {
  t: TFunction;
  councilMembers: Council[];
};

export default function AboutUsConcilMembersSection({ t, councilMembers }: AboutUsConcilMembersSectionProps) {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="relative container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">{t('aboutUs.council.title')}</h2>
            <div className="mx-auto h-1.5 w-32 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {councilMembers.map(member => (
              <div key={member.id} className="relative mx-auto w-[300px]">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 opacity-10 blur-sm"></div>
                <div className="relative rounded-2xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
                  <div className="mb-6 flex justify-center">
                    <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-lg">
                      <Image
                        src={`${member.image}` || '/assets/images/user-default-avatar.jpg'}
                        alt={member.name}
                        className="h-full w-full object-cover"
                        width={192}
                        height={192}
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="mb-3 text-xl font-bold text-gray-800">{member.name}</h3>
                    <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-600 to-green-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                      {getPositionLabel(member.position)}
                    </div>

                    <div className="rounded-xl border border-white/20 bg-white/60 p-4 shadow-lg backdrop-blur-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">رقم الهاتف:</span>{' '}
                        <span dir="ltr" className="inline-block">
                          {member.phone || 'غير متوفر'}
                        </span>
                      </p>
                    </div>
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
