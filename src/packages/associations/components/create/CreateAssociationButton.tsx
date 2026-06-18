import Button from '@/packages/common/components/Button';

type CreateAssociationButtonProps = {
  isSubmitting: boolean;
};

export default function CreateAssociationButton({ isSubmitting }: CreateAssociationButtonProps) {
  return (
    <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
      إنشاء المؤسسة
    </Button>
  );
}
