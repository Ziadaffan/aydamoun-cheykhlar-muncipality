import { TFunction } from 'i18next';
import React from 'react';
import { CouncilMember } from './AboutUsPage';
import Image from 'next/image';

const councilMembers: CouncilMember[] = [
  {
    id: 1,
    name: 'السيد حسن أحمد الحاج',
    position: 'نائب رئيس المجلس',
    image: '/assets/images/hasan-hajj-profile.jpg',
    phone: '03 123 456',
  },
  {
    id: 2,
    name: 'السيد سامو فيصل عباس',
    position: 'عضو المجلس',
    image: '/assets/images/samo-abbas-profile.jpg',
    phone: '03 234 567',
  },
  {
    id: 3,
    name: 'السيدة نبال محمود حامد',
    position: 'عضو المجلس',
    image: '/assets/images/nibal-hamed-profile.jpg',
    phone: '03 345 678',
  },
  {
    id: 4,
    name: 'السيد مروان مصطفى سعيد',
    position: 'عضو المجلس',
    image: '/assets/images/merwen-said-profile.jpg',
    phone: '03 345 678',
  },
  {
    id: 5,
    name: 'السيد ماريو حنا عبود',
    position: 'عضو المجلس',
    image: '/assets/images/mario-abdo-profile.jpg',
    phone: '03 15 13 08',
  },
  {
    id: 6,
    name: 'السيد خالد أحمد علي',
    position: 'عضو المجلس',
    image: '/assets/images/khaldoun-profile.jpg',
    phone: '03 15 13 08',
  },
  {
    id: 7,
    name: 'السيد محمد ياسر ضاهر',
    position: 'عضو المجلس',
    image: '/assets/images/mhammad-daher-profile.JPG',
    phone: '03 15 13 08',
  },
  {
    id: 8,
    name: 'السيد بلال حكمت الحاج',
    position: 'عضو المجلس',
    image: '/assets/images/bilal-hajj-profile.JPG',
    phone: '03 678 901',
  },
  {
    id: 9,
    name: 'السيد طلال محمد محمد عبدو',
    position: 'عضو المجلس',
    image: '/assets/images/talel-abdo-profile.jpg',
    phone: '03 789 012',
  },
  {
    id: 10,
    name: 'السيد غازي ديب الخوري',
    position: 'عضو المجلس',
    image: '/assets/images/ghazi-khouri-profile.jpg',
    phone: '03 789 012',
  },
  {
    id: 11,
    name: 'السيد شادي أحمد ضاهر',
    position: 'عضو المجلس',
    image: '/assets/images/chadi-daher-profile.jpg',
    phone: '03 890 123',
  },
  {
    id: 12,
    name: 'السيد ياسر علي المقصود',
    position: 'عضو المجلس',
    image: '/assets/images/yeser-mak-profile.jpg',
    phone: '03 901 234',
  },
  {
    id: 13,
    name: 'السيد عصام محمد الزرزوري',
    position: 'عضو المجلس',
    image: '/assets/images/issam-zar-profile.JPG',
    phone: '03 901 234',
  },
  {
    id: 14,
    name: 'السيدة يسرا أحمد الخضر الزرزوري',
    position: 'عضو المجلس',
    image: '/assets/images/yesra-zar-profile.JPG',
    phone: '03 012 345',
  },
];

type AboutUsConcilMembersSectionProps = {
  t: TFunction;
};

export default function AboutUsConcilMembersSection({ t }: AboutUsConcilMembersSectionProps) {
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
                    <Image src={member.image} alt={member.name} className="h-full w-full object-cover" width={192} height={192} />
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
