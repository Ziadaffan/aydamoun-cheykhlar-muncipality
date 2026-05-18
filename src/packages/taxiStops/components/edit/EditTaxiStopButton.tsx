import Button from '@/packages/common/components/Button';

type EditTaxiStopButtonProps = {
  isSubmitting: boolean;
};

export default function EditTaxiStopButton({ isSubmitting }: EditTaxiStopButtonProps) {
  return (
    <Button type="submit" variant="warning" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
      حفظ التعديلات
    </Button>
  );
}
