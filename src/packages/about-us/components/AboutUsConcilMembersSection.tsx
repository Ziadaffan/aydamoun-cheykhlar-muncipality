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
  },
  {
    id: 2,
    name: 'السيد سامو فيصل عباس',
    position: 'عضو المجلس',
    image: '/assets/images/samo-abbas-profile.jpg',
  },
  {
    id: 3,
    name: 'السيدة نبال محمود حامد',
    position: 'عضو المجلس',
    image: '/assets/images/nibal-hamed-profile.jpg',
  },
  {
    id: 4,
    name: 'السيد مروان مصطفى سعيد',
    position: 'عضو المجلس',
    image: '/assets/images/merwen-said-profile.jpg',
  },
  {
    id: 5,
    name: 'السيد ماريو حنا عبود',
    position: 'عضو المجلس',
    image: '/assets/images/mario-abdo-profile.jpg',
  },
  {
    id: 6,
    name: 'السيد خالد أحمد علي',
    position: 'عضو المجلس',
    image: '/assets/images/khaldoun-profile.jpg',
  },
  {
    id: 7,
    name: 'السيد محمد ياسر ضاهر',
    position: 'عضو المجلس',
    image: '/assets/images/mhammad-daher-profile.JPG',
  },
  {
    id: 8,
    name: 'السيد بلال حكمت الحاج',
    position: 'عضو المجلس',
    image: '/assets/images/bilal-hajj-profile.JPG',
  },
  {
    id: 9,
    name: 'السيد طلال محمد محمد عبدو',
    position: 'عضو المجلس',
    image: '/assets/images/talel-abdo-profile.jpg',
  },
  {
    id: 10,
    name: 'السيد غازي ديب الخوري',
    position: 'عضو المجلس',
    image: '/assets/images/ghazi-khouri-profile.jpg',
  },
  {
    id: 11,
    name: 'السيد شادي أحمد ضاهر',
    position: 'عضو المجلس',
    image: '/assets/images/chadi-daher-profile.jpg',
  },
  {
    id: 12,
    name: 'السيد ياسر علي المقصود',
    position: 'عضو المجلس',
    image: '/assets/images/yeser-mak-profile.jpg',
  },
  {
    id: 13,
    name: 'السيد عصام محمد الزرزوري',
    position: 'عضو المجلس',
    image: '/assets/images/issam-zar-profile.JPG',
  },
  {
    id: 14,
    name: 'السيدة يسرا أحمد الخضر الزرزوري',
    position: 'عضو المجلس',
    image: '/assets/images/yesra-zar-profile.JPG',
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
              <div
                key={member.id}
                className="group rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-6 flex justify-center">
                  <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500">
                    <Image src={member.image} alt={member.name} className="h-full w-full object-cover" width={192} height={192} />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="mb-3 text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">{member.name}</h3>
                  <p className="text-lg font-semibold text-blue-600">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
