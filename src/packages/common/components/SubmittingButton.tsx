type SubmittingButtonProps = {
  isSubmitting: boolean;
  text: string;
};

export default function SubmittingButton({ isSubmitting, text }: SubmittingButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSubmitting ? 'جاري الإرسال...' : text}
    </button>
  );
}
