type TaxiStopsEmptyStateProps = {
  taxiStops: Array<unknown>;
};

export default function TaxiStopsEmptyState({ taxiStops }: TaxiStopsEmptyStateProps) {
  if (taxiStops.length > 0) {
    return null;
  }

  return (
    <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600">
      لا توجد مواقف تاكسي متاحة حاليا.
    </div>
  );
}
