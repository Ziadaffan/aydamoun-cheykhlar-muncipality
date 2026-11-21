'use client';

import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { Council } from '@prisma/client';
import { useLocalized } from '@/lib/localized';
import { CldImage } from 'next-cloudinary';
import { UserRound } from 'lucide-react';
import CouncilMemberModal from './CouncilMemberModal';

type AboutUsConcilMembersSectionProps = {
  t: TFunction;
  councilMembers: Council[];
};

function CouncilMemberCard({ t, member }: { t: TFunction; member: Council }) {
  const loc = useLocalized();
  const [open, setOpen] = useState(false);
  const name = loc(member.name, member.nameEn);
  const position = t(`aboutUs.positions.${member.position}`);

  return (
    <div className="relative mx-auto h-full w-full max-w-[300px]">
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-400 to-sky-400 opacity-10 blur-sm"></div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={t('aboutUs.member.openLabel', { name, position })}
        className="group relative flex h-full w-full cursor-pointer flex-col items-center rounded-2xl border border-white/20 bg-white/80 p-6 text-center shadow-xl backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      >
        <div className="mb-6 flex justify-center">
          <div className="relative flex h-48 w-48 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
            {member.image ? (
              <CldImage src={member.image} alt="" fill sizes="192px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <UserRound className="h-16 w-16 text-gray-400" aria-hidden />
            )}
          </div>
        </div>

        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-800">{name}</h3>
        <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-600 to-sky-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
          {position}
        </div>

        {(member.role || member.major) && (
          <div className="mb-4 space-y-1">
            {member.role && <p className="line-clamp-2 font-semibold text-gray-800">{loc(member.role, member.roleEn)}</p>}
            {member.major && <p className="line-clamp-2 text-sm text-gray-600">{loc(member.major, member.majorEn)}</p>}
          </div>
        )}

        <span className="mt-auto pt-2 text-sm font-bold text-blue-600 group-hover:text-blue-800" aria-hidden="true">
          {t('aboutUs.member.viewDetails')}
        </span>
      </button>

      <CouncilMemberModal t={t} member={member} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default function AboutUsConcilMembersSection({ t, councilMembers }: AboutUsConcilMembersSectionProps) {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="relative container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">{t('aboutUs.council.title')}</h2>
            <div className="mx-auto h-1.5 w-32 rounded-full bg-gradient-to-r from-blue-500 to-sky-500"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {councilMembers.map(member => (
              <CouncilMemberCard key={member.id} t={t} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
