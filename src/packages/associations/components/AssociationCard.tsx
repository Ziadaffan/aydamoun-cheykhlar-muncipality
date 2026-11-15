'use client';

import { CldImage } from 'next-cloudinary';
import { useAuth } from '@/packages/common/hooks/useAuth';
import AssociationCardFooter from './AssociationCardFooter';
import Link from 'next/link';
import { useLocalized } from '@/lib/localized';

type AssociationCardProps = {
    association: {
        id: string;
        name: string;
        description: string;
        picaURL: string;
        nameEn?: string | null;
        descriptionEn?: string | null;
    };
};

export default function AssociationCard({ association }: AssociationCardProps) {
    const { role } = useAuth();
    const loc = useLocalized();
    const name = loc(association.name, association.nameEn);
    const isAdmin = role === 'ADMIN';

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <Link href={`/associations/${association.id}`} className="group block">
                <div className="relative h-44 w-full bg-gray-100 sm:h-52">
                    <CldImage src={association.picaURL} alt={name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>

                <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 line-clamp-2 text-xl font-bold break-words text-gray-900 [overflow-wrap:anywhere]">{name}</h3>
                    <p className="line-clamp-2 text-sm leading-7 break-words text-gray-600 [overflow-wrap:anywhere] md:text-base">{loc(association.description, association.descriptionEn)}</p>
                </div>
            </Link>

            {isAdmin && <AssociationCardFooter association={association} />}
        </article>
    );
}
