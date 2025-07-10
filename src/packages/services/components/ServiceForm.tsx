'use client';

import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type ServiceFormProps = {
  category: string;
  serviceId?: number;
};

type FormData = {
  // Informations personnelles
  fullName: string;
  phone: string;
  email: string;
  address: string;

  // Informations du service
  serviceType: string;
  description: string;

  // Informations supplémentaires selon la catégorie
  additionalInfo: Record<string, any>;

  // Documents
  documents: File[];
};

export default function ServiceForm({ category, serviceId }: ServiceFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    serviceType: serviceId ? serviceId.toString() : '',
    description: '',
    additionalInfo: {},
    documents: [],
  });

  // Obtenir les services de la catégorie
  const services = t(`services.${category}.services`, { returnObjects: true }) as Array<{
    id: number;
    title: string;
    description: string;
  }>;

  // Champs supplémentaires selon la catégorie
  const getAdditionalFields = () => {
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdditionalInfoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [field]: value,
      },
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    console.log(formData);
  };

  const additionalFields = getAdditionalFields();

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-xl">
      {/* Informations personnelles */}
      <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">المعلومات الشخصية</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">الاسم الكامل *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={e => handleInputChange('fullName', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">رقم الهاتف *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">العنوان *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => handleInputChange('address', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Sélection du service */}
      {!serviceId && (
        <div className="mb-8">
          <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">نوع الخدمة</h3>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">اختر الخدمة المطلوبة *</label>
            <select
              required
              value={formData.serviceType}
              onChange={e => handleInputChange('serviceType', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر الخدمة</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Champs supplémentaires selon la catégorie */}
      {additionalFields.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">معلومات إضافية</h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {additionalFields.map(field => (
              <div key={field.name}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {field.label} {field.required && '*'}
                </label>

                {field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={formData.additionalInfo[field.name] || ''}
                    onChange={e => handleAdditionalInfoChange(field.name, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر</option>
                    {field.options?.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'radio' ? (
                  <div className="space-y-2">
                    {field.options?.map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name={field.name}
                          value={option}
                          required={field.required}
                          onChange={e => handleAdditionalInfoChange(field.name, e.target.value)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    value={formData.additionalInfo[field.name] || ''}
                    onChange={e => handleAdditionalInfoChange(field.name, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">تفاصيل الطلب</h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">وصف مفصل للطلب *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            placeholder="يرجى تقديم وصف مفصل لطلبك..."
          />
        </div>
      </div>

      {/* Documents */}
      {/* <div className="mb-8">
        <h3 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">المرفقات (اختياري)</h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">إرفاق مستندات</label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-2 text-sm text-gray-500">يمكنك إرفاق ملفات PDF، Word، أو صور (الحد الأقصى: 5 ملفات)</p>
        </div>
      </div> */}

      {/* Bouton de soumission */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
        </button>
      </div>
    </form>
  );
}
