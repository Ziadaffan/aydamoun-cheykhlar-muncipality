'use client';

import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import ControlledSelect from '@/packages/common/components/form/ControlledSelect';
import ControlledCheckbox from '@/packages/common/components/form/ControlledCheckbox';
import ControlledMultiFileInput from '@/packages/common/components/form/ControlledMultiFileInput';
import ControlledTagsInput from '@/packages/common/components/form/ControlledTagsInput';
import EditNewsButton from '../edit/EditNewsButton';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { updateNewsSchema, UpdateNewsFormData } from '@/packages/news/validation/news.validation';
import FormMessage from '@/packages/common/components/form/InfoMessage';
import { useState, useEffect } from 'react';
import { useUpdateNews } from '@/packages/news/hooks/useUpdateNews';
import { useGetNewsById } from '@/packages/news/hooks/useGetNewsById';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useParams } from 'next/navigation';
import { NewsCategory } from '@/packages/news/types/news.types';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';

export default function EditNewsForm() {
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const newsId = params?.id as string;

  const { data: newsData, isLoading, error } = useGetNewsById(newsId);
  const { mutate: updateNews } = useUpdateNews();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateNewsFormData>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category: 'MUNICIPAL_NEWS' as NewsCategory,
      author: '',
      tags: [],
      featured: false,
      images: [],
    },
    resolver: yupResolver(updateNewsSchema),
  });

  useEffect(() => {
    if (newsData) {
      reset({
        title: newsData.title || '',
        content: newsData.content || '',
        excerpt: newsData.excerpt || '',
        category: newsData.category || 'MUNICIPAL_NEWS',
        author: newsData.author || '',
        tags: newsData.tags || [],
        featured: newsData.featured || false,
        images: [],
      });
    }
  }, [newsData, reset]);

  const onSubmit = (data: UpdateNewsFormData) => {
    setIsPending(true);
    setMessage(null);

    const newsToUpdate = {
      id: newsId,
      ...data,
    };

    updateNews(newsToUpdate, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('news.form.messages.updateSuccess') });
        setTimeout(() => {
          router.push('/news');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: t('news.form.messages.updateError') });
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };

  const categoryOptions = [
    { value: 'MUNICIPAL_NEWS', label: t('news.categories.municipalNews') },
    { value: 'DEVELOPMENT_PROJECTS', label: t('news.categories.developmentProjects') },
    { value: 'ANNOUNCEMENTS', label: t('news.categories.announcements') },
    { value: 'COMMUNITY_EVENTS', label: t('news.categories.communityEvents') },
    { value: 'INFRASTRUCTURE', label: t('news.categories.infrastructure') },
    { value: 'ENVIRONMENTAL', label: t('news.categories.environmental') },
    { value: 'SOCIAL_SERVICES', label: t('news.categories.socialServices') },
    { value: 'HEALTH_AND_SOCIAL_SERVICES', label: t('news.categories.healthAndSocialServices') },
    { value: 'OTHER', label: t('news.categories.other') },
  ];

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl">
      <FormMessage message={message} onClose={() => setMessage(null)} />

      <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('news.form.editTitle')}</h3>
      </div>

      <div className="space-y-6">
        <ControlledInputText
          id="title"
          label={t('news.form.newsTitle')}
          type="text"
          control={control}
          name="title"
          error={errors.title}
          placeholder={t('news.form.titlePlaceholder')}
          required
        />

        <ControlledTextArea
          id="excerpt"
          label={t('news.form.excerpt')}
          control={control}
          name="excerpt"
          error={errors.excerpt}
          placeholder={t('news.form.excerptPlaceholder')}
          rows={3}
          required
        />

        <ControlledTextArea
          id="content"
          label={t('news.form.content')}
          control={control}
          name="content"
          error={errors.content}
          placeholder={t('news.form.contentPlaceholder')}
          rows={8}
          required
        />

        <ControlledSelect
          id="category"
          label={t('news.form.category')}
          control={control}
          name="category"
          error={errors.category}
          options={categoryOptions}
          placeholder={t('news.form.categoryPlaceholder')}
          required
        />

        <ControlledInputText
          id="author"
          label={t('news.form.author')}
          type="text"
          control={control}
          name="author"
          error={errors.author}
          placeholder={t('news.form.authorPlaceholder')}
          required
        />

        <ControlledTagsInput
          id="tags"
          label={t('news.form.tags')}
          control={control}
          name="tags"
          error={errors.tags as any}
          placeholder={t('news.form.tagsPlaceholder')}
          required
        />

        <ControlledMultiFileInput
          id="images"
          label={t('news.form.images')}
          control={control}
          name="images"
          error={errors.images as any}
          accept="image/jpeg,image/png,image/gif,image/webp"
          required
        />

        <ControlledCheckbox id="featured" label={t('news.form.featured')} control={control} name="featured" error={errors.featured} />
      </div>

      <div className="mt-8">
        <EditNewsButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
