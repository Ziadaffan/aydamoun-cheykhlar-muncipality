import Image from 'next/image';
import { categoryColors, useNewsCategoryLabel, useRelativeDate } from '@/packages/news/utils/news.utils';
import { useLocalized } from '@/lib/localized';
import { newsImageLoader, newsImageSrc } from '@/packages/news/utils/newsImage.utils';
import { News } from '@/packages/news/types/news.types';
import { textPreview } from '@/packages/common/utils/text.utils';
import Link from 'next/link';

type CompactCardProps = {
  news: News;
  /**
   * 'vertical': image on top (the home page's three-column row).
   * 'horizontal': thumbnail beside the text (the news page's list view).
   */
  orientation?: 'vertical' | 'horizontal';
};

export const CompactCard = ({ news, orientation = 'horizontal' }: CompactCardProps) => {
  const loc = useLocalized();
  const categoryLabel = useNewsCategoryLabel();
  const relativeDate = useRelativeDate();
  const title = loc(news.title, news.titleEn);
  const preview = textPreview(loc(news.content, news.contentEn), 200);
  const image = newsImageSrc(news.imageUrl?.[0]);
  const vertical = orientation === 'vertical';

  return (
    <Link
      href={`/news/${news.id}`}
      className={`group flex h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        vertical ? 'flex-col' : 'items-stretch gap-4 p-3 sm:p-4'
      }`}
    >
      {/* Image: a fixed box, requested at the size it is drawn (next/image adds the 2x/3x candidates). */}
      <div
        className={`relative flex-shrink-0 overflow-hidden bg-gray-100 ${vertical ? 'aspect-[16/10] w-full' : 'aspect-[4/3] w-28 self-center rounded-lg sm:w-44'}`}
      >
        <Image
          src={image}
          loader={newsImageLoader(image)}
          alt={title}
          fill
          sizes={vertical ? '(max-width: 1024px) 100vw, 400px' : '(max-width: 640px) 112px, 176px'}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className={`flex min-w-0 flex-1 flex-col ${vertical ? 'p-5' : 'justify-center'}`}>
        <div className="mb-2 flex items-center text-xs text-gray-500">
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${categoryColors[news.category]}`}>
            {categoryLabel(news.category)}
          </span>
          <span className="mx-2">•</span>
          {relativeDate(news.createdAt)}
        </div>

        <h3 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600">{title}</h3>

        {preview && <p className={`mt-1 text-sm text-gray-600 ${vertical ? 'line-clamp-3' : 'line-clamp-2'}`}>{preview}</p>}
      </div>
    </Link>
  );
};
