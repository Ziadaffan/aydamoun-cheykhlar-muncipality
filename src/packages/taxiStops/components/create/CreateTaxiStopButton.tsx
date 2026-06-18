import Button from '@/packages/common/components/Button';

type CreateTaxiStopButtonProps = {
  isSubmitting: boolean;
};

export default function CreateTaxiStopButton({ isSubmitting }: CreateTaxiStopButtonProps) {
  return (
    <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
      إنشاء موقف التاكسي
    </Button>
  );
}
