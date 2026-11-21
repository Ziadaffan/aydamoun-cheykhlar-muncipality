'use client';

import { TFunction } from 'i18next';
import { Council } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import { BriefcaseBusiness, GraduationCap, Mail, Phone, UserRound, type LucideIcon } from 'lucide-react';
import { useLocalized } from '@/lib/localized';
import Modal from '@/packages/common/components/Modal';

type CouncilMemberModalProps = {
  t: TFunction;
  member: Council;
  open: boolean;
  onClose: () => void;
};

function Fact({ icon: Icon, label, text }: { icon: LucideIcon; label: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{text}</p>
      </div>
    </div>
  );
}

/** A council member's details: large photo, name, position, role, major and the only place their phone/email appear. */
export default function CouncilMemberModal({ t, member, open, onClose }: CouncilMemberModalProps) {
  const loc = useLocalized();
  const name = loc(member.name, member.nameEn);
  const role = member.role?.trim() ? loc(member.role, member.roleEn) : '';
  const major = member.major?.trim() ? loc(member.major, member.majorEn) : '';
  const phone = member.phone?.trim();
  const email = member.email?.trim();

  return (
    <Modal open={open} onClose={onClose} title={t('aboutUs.member.sheetTitle')}>
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="relative mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-blue-100 bg-gray-100 shadow-lg">
          {member.image ? (
            <CldImage src={member.image} alt={name} fill sizes="160px" className="object-cover" />
          ) : (
            <UserRound className="h-16 w-16 text-gray-400" aria-hidden />
          )}
        </div>
        <h3 className="mb-2 text-2xl font-bold text-gray-800">{name}</h3>
        <span className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-sky-600 px-4 py-1 text-sm font-semibold text-white shadow">
          {t(`aboutUs.positions.${member.position}`)}
        </span>
      </div>

      <div className="space-y-3">
        {role && <Fact icon={BriefcaseBusiness} label={t('aboutUs.member.role')} text={role} />}
        {major && <Fact icon={GraduationCap} label={t('aboutUs.member.major')} text={major} />}

        {phone && (
          <a
            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
            aria-label={t('aboutUs.member.call', { name, phone })}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Phone className="h-5 w-5" aria-hidden />
            <span dir="ltr">{phone}</span>
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            aria-label={t('aboutUs.member.email', { name, email })}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-600 px-4 py-3 font-bold text-blue-700 transition hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Mail className="h-5 w-5" aria-hidden />
            <span dir="ltr" className="break-all">
              {email}
            </span>
          </a>
        )}
        {!phone && !email && <p className="text-center text-sm text-gray-500">{t('aboutUs.member.noContact')}</p>}
      </div>
    </Modal>
  );
}
