import Image from 'next/image';
import { categoryColors, useNewsCategoryLabel, useRelativeDate } from '@/packages/news/utils/news.utils';
import { useLocalized } from '@/lib/localized';
import { newsImageLoader, newsImageSrc } from '@/packages/news/utils/newsImage.utils';
import { News } from '@/packages/news/types/news.types';
import Button from '@/packages/common/components/Button';
import { TFunction } from 'i18next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NewsFleshesImage } from '@/packages/common/components/NewsFleshImage';
import { ImageIndicators } from '@/packages/common/components/ImageIndicators';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { useDeleteNews } from '@/packages/news/hooks/useDeteleNews';
import { textPreview } from '@/packages/common/utils/text.utils';

type FeaturedCardProps = {
  news: News;
  t: TFunction;
};

export const FeaturedCard = ({ news, t }: FeaturedCardProps) => {
  const loc = useLocalized();
  const categoryLabel = useNewsCategoryLabel();
  const relativeDate = useRelativeDate();
  const title = loc(news.title, news.titleEn);
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { role } = useAuth();
  const { mutate: deleteNews, isPending } = useDeleteNews();

  const hasMultipleImages = news.imageUrl && news.imageUrl.length > 1;
  const currentImage = newsImageSrc(news.imageUrl?.[currentImageIndex]);

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex(prev => (prev + 1) % news.imageUrl!.length);
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex(prev => (prev - 1 + news.imageUrl!.length) % news.imageUrl!.length);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden bg-gray-100 sm:h-80 lg:h-auto lg:min-h-[26rem]">
          <Image src={currentImage} loader={newsImageLoader(currentImage)} alt={title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {hasMultipleImages && <NewsFleshesImage nextImage={nextImage} prevImage={prevImage} />}

          {hasMultipleImages && <ImageIndicators currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} news={news} />}

          {/* Category Badge */}
          <div className="absolute top-6 start-6">
            <span className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium ${categoryColors[news.category]}`}>
              {categoryLabel(news.category)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center p-8">
          <div className="mb-4 flex items-center text-sm text-gray-500">
            <svg className="me-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {news.author}
            <span className="mx-2">•</span>
            {relativeDate(news.createdAt)}
          </div>

          <h3 className="mb-4 line-clamp-3 text-2xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600">
            {title}
          </h3>

          <p className="mb-6 line-clamp-4 text-lg leading-relaxed text-gray-600">{textPreview(loc(news.content, news.contentEn))}</p>

          {/* Tags */}
          {news.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {news.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <div>
              <Button variant="primary" size="lg" onClick={() => router.push(`/news/${news.id}`)}>
                {t('news.page.readMore')}
              </Button>
            </div>
            {role == 'ADMIN' && (
              <>
                <div>
                  <Button variant="warning" size="lg" onClick={() => router.push(`/news/${news.id}/edit`)}>
                    {t('news.page.updateNews')}
                  </Button>
                </div>
                <div>
                  <Button variant="danger" size="lg" onClick={() => deleteNews(news.id)} loading={isPending}>
                    {t('news.page.deleteNews')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
