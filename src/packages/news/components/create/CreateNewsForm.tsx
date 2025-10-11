'use client';

import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import ControlledSelect from '@/packages/common/components/form/ControlledSelect';
import ControlledCheckbox from '@/packages/common/components/form/ControlledCheckbox';
import ControlledMultiFileInput from '@/packages/common/components/form/ControlledMultiFileInput';
import ControlledTagsInput from '@/packages/common/components/form/ControlledTagsInput';
import CreateNewsButton from './CreateNewsButton';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { createNewsSchema, CreateNewsFormData } from '@/packages/news/validation/news.validation';
import FormMessage from '@/packages/common/components/form/InfoMessage';
import { useState } from 'react';
import { useCreateNews } from '@/packages/news/hooks/useCreateNews';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { NewsCategory } from '@/packages/news/types/news.types';

export default function CreateNewsForm() {
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNewsFormData>({
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
    resolver: yupResolver(createNewsSchema),
  });

  const { mutate: createNews, error } = useCreateNews();

  const onSubmit = (data: CreateNewsFormData) => {
    setIsPending(true);
    setMessage(null);
    createNews(data, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('news.form.messages.createSuccess') });
        setTimeout(() => {
          router.push('/news');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: t('news.form.messages.createError') });
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl">
      <FormMessage message={message} onClose={() => setMessage(null)} />

      <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('news.form.title')}</h3>
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
        <CreateNewsButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
