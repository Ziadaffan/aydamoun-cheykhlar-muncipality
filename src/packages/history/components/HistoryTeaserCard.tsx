import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { VILLAGE_STORY_IMAGE } from '@/packages/home/slides';
import { ChevronLeft, Landmark } from 'lucide-react';

type HistoryTeaserCardProps = {
  title: string;
  body: string;
};

/** Photo card leading to /history (home page and about-us). */
export default function HistoryTeaserCard({ title, body }: HistoryTeaserCardProps) {
  return (
    <Link
      href="/history"
      className="group relative block h-56 overflow-hidden rounded-2xl shadow-xl focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:outline-none md:h-64"
    >
      <CldImage src={VILLAGE_STORY_IMAGE} alt="" fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent transition-colors group-hover:from-black/80" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-5 md:p-7">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/90 text-green-700" aria-hidden="true">
          <Landmark className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xl font-bold text-on-image md:text-2xl">{title}</span>
          <span className="mt-1 block text-sm text-on-image/90 md:text-base">{body}</span>
        </span>
        <ChevronLeft className="h-6 w-6 flex-shrink-0 text-on-image transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" aria-hidden />
      </div>
    </Link>
  );
}
