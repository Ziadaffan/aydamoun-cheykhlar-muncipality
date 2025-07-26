export const getAdditionalFields = (category: string) => {
  switch (category) {
    case 'buildingLicenses':
      return [
        { name: 'propertyAddress', label: 'عنوان العقار', type: 'text', required: true },
        { name: 'propertyType', label: 'نوع العقار', type: 'select', options: ['سكني', 'تجاري', 'صناعي'], required: true },
        { name: 'constructionArea', label: 'مساحة البناء (م²)', type: 'number', required: true },
        { name: 'existingBuilding', label: 'هل يوجد بناء قائم؟', type: 'radio', options: ['نعم', 'لا'], required: true },
      ];

    case 'environmentalServices':
      return [
        { name: 'location', label: 'موقع المشكلة', type: 'text', required: true },
        { name: 'problemType', label: 'نوع المشكلة', type: 'select', options: ['نفايات متراكمة', 'مخالفات بيئية', 'حاجة تنظيف'], required: true },
        { name: 'urgency', label: 'مستوى الأولوية', type: 'select', options: ['منخفض', 'متوسط', 'عالي'], required: true },
      ];

    case 'administrativeTransactions':
      return [
        { name: 'transactionType', label: 'نوع المعاملة', type: 'select', options: ['كشف ضرائب', 'تصريح مناسبة', 'معاملة أخرى'], required: true },
        { name: 'propertyNumber', label: 'رقم العقار (إن وجد)', type: 'text', required: false },
        { name: 'eventDate', label: 'تاريخ الفعالية (إن وجد)', type: 'date', required: false },
      ];

    case 'complaintsAndSuggestions':
      return [
        { name: 'type', label: 'النوع', type: 'select', options: ['شكوى', 'اقتراح', 'استفسار'], required: true },
        { name: 'department', label: 'القسم المعني', type: 'select', options: ['الخدمات العامة', 'البيئة', 'الإدارة', 'أخرى'], required: true },
        { name: 'priority', label: 'مستوى الأولوية', type: 'select', options: ['منخفض', 'متوسط', 'عالي'], required: true },
      ];

    case 'additionalServices':
      return [
        { name: 'serviceType', label: 'نوع الخدمة', type: 'select', options: ['حجز موعد', 'طلب مقابلة', 'خدمة أخرى'], required: true },
        { name: 'preferredDate', label: 'التاريخ المفضل', type: 'date', required: false },
        { name: 'preferredTime', label: 'الوقت المفضل', type: 'select', options: ['صباحاً', 'مساءً'], required: false },
      ];

    default:
      return [];
  }
};
