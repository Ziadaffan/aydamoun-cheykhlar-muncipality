import Button from '@/packages/common/components/Button';

type EditAssociationButtonProps = {
  isSubmitting: boolean;
};

export default function EditAssociationButton({ isSubmitting }: EditAssociationButtonProps) {
  return (
    <Button type="submit" variant="warning" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
      حفظ التعديلات
    </Button>
  );
}
