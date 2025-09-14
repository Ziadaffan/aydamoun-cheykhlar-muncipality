import { CldImage } from 'next-cloudinary';
import { categoryColors, categoryLabels, formatDate } from '@/packages/news/utils/news.utils';
import { News } from '@/packages/news/types/news.types';
import Link from 'next/link';

type CompactCardProps = {
  news: News;
};

export const CompactCard = ({ news }: CompactCardProps) => (
  <Link
    href={`/news/${news.id}`}
    className="group flex cursor-pointer items-center space-x-4 rounded-lg bg-white p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
  >
    {/* Image */}
    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
      <CldImage src={news.imageUrl?.[0] || 'elementor-placeholder-image-3610342416_bys2q8'} alt={news.title} fill className="object-cover" />
    </div>

    {/* Content */}
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex items-center text-xs text-gray-500">
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${categoryColors[news.category]}`}>
          {categoryLabels[news.category]}
        </span>
        <span className="mx-2">•</span>
        {formatDate(news.createdAt)}
      </div>

      <h3 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">{news.title}</h3>

      <p className="mt-1 line-clamp-1 text-sm text-gray-600">{news.content}</p>
    </div>
  </Link>
);
