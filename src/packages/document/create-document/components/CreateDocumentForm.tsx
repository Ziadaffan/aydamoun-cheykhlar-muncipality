import ControlledInputText from '@/packages/common/components/form/ControlledInputText';
import ControlledTextArea from '@/packages/common/components/form/ControlledTextArea';
import ControlledFileInput from '@/packages/common/components/form/ControlledFileInput';
import CreateDocumentButton from '@/packages/document/create-document/components/CreateDocumentButton';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { documentUploadSchema, DocumentUploadFormData } from '@/packages/document/validation/document.validation';
import FormMessage from '@/packages/common/components/form/InfoMessage';
import { useState } from 'react';
import { useCreateDocument } from '@/packages/document/create-document/hooks/useCreateDocument';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

export default function CreateDocumentForm() {
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentUploadFormData>({
    defaultValues: {
      title: '',
      description: '',
      file: undefined,
    },
    resolver: yupResolver(documentUploadSchema),
  });

  const { mutate: createDocument, error } = useCreateDocument();

  const onSubmit = (data: DocumentUploadFormData) => {
    setIsPending(true);
    setMessage(null);
    createDocument(data, {
      onSuccess: () => {
        setMessage({ type: 'success', text: t('documents.form.messages.uploadSuccess') });
        setTimeout(() => {
          router.push('/documents');
        }, 1000);
      },
      onError: () => {
        setMessage({ type: 'error', text: t('documents.form.messages.uploadError') });
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl">
      <FormMessage message={message} onClose={() => setMessage(null)} />

      <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">{t('documents.form.title')}</h3>
      </div>

      <div className="space-y-6">
        <ControlledInputText
          id="title"
          label={t('documents.form.title')}
          type="text"
          control={control}
          name="title"
          error={errors.title}
          placeholder={t('documents.form.titlePlaceholder')}
          required
        />

        <ControlledTextArea
          id="description"
          label={t('documents.form.description')}
          control={control}
          name="description"
          error={errors.description}
          placeholder={t('documents.form.descriptionPlaceholder')}
          rows={4}
          required
        />

        <ControlledFileInput
          id="file"
          label={t('documents.form.file')}
          control={control}
          name="file"
          error={errors.file}
          accept={t('documents.form.fileAccept')}
          required
        />
      </div>

      <div className="mt-8">
        <CreateDocumentButton isSubmitting={isPending} />
      </div>
    </form>
  );
}
