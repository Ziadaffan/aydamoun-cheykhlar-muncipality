import Button from '@/packages/common/components/Button';
import { TFunction } from 'i18next';
import { useRouter } from 'next/navigation';

type CreateDocumentAdminButtonProps = {
  t: TFunction;
};

export default function CreateDocumentAdminButton({ t }: CreateDocumentAdminButtonProps) {
  const router = useRouter();
  return (
    <div className="mt-8">
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={() => {
          router.push('/documents/create');
        }}
      >
        {t('documents.createAdminDocument')}
      </Button>
    </div>
  );
}
