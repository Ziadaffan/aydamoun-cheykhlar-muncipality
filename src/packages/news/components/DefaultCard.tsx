import { CldImage } from 'next-cloudinary';
import { categoryColors, categoryLabels, formatDate } from '.';
import { News } from '../types/news.types';
import Button from '@/packages/common/components/Button';
import { TFunction } from 'i18next';
import { useRouter } from 'next/navigation';

type DefaultCardProps = {
  news: News;
  t: TFunction;
};

export const DefaultCard = ({ news, t }: DefaultCardProps) => {
  const router = useRouter();
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <CldImage
          src={news.imageUrl?.[0] || 'elementor-placeholder-image-3610342416_bys2q8'}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${categoryColors[news.category]}`}>
            {categoryLabels[news.category]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3 flex items-center text-sm text-gray-500">
          <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {news.author}
          <span className="mx-2">•</span>
          {formatDate(news.createdAt)}
        </div>

        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">{news.title}</h3>

        <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">{news.content}</p>

        {/* Tags */}
        {news.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {news.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More Button */}
        <Button variant="primary" size="lg" className="w-full" onClick={() => router.push(`/news/${news.id}`)}>
          {t('news.page.readMore')}
        </Button>
      </div>
    </div>
  );
};
