type AssociationsEmptyStateProps = {
  associations: Array<unknown>;
};

export default function AssociationsEmptyState({ associations }: AssociationsEmptyStateProps) {
  if (associations.length > 0) {
    return null;
  }

  return (
    <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
      لا توجد مؤسسات متاحة حاليا.
    </div>
  );
}
