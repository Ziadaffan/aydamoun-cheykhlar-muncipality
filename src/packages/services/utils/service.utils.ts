import { ServiceType } from '@prisma/client';

export function getServiceCategoryMeta(type: ServiceType) {
  switch (type) {
    case 'LICENSEES_AND_CONSTRUCTION_SERVICES':
      return { icon: '🏗️', bgColor: 'from-blue-400 to-blue-600', categoryKey: 'buildingLicenses' };
    case 'ENVIRONMENTAL_SERVICES':
      return { icon: '🌱', bgColor: 'from-green-400 to-green-600', categoryKey: 'environmentalServices' };
    case 'ADMINISTRATIVE_SERVICES':
      return { icon: '📋', bgColor: 'from-purple-400 to-purple-600', categoryKey: 'administrativeTransactions' };
    case 'DOWNLOAD_OFFICIAL_FORMS_SERVICES':
      return { icon: '📄', bgColor: 'from-blue-400 to-blue-600', categoryKey: 'officialForms' };
    case 'COMPLAINTS_AND_SUGGESTIONS_SERVICES':
      return { icon: '📢', bgColor: 'from-orange-400 to-orange-600', categoryKey: 'complaintsAndSuggestions' };
    case 'OTHER':
      return { icon: '⭐', bgColor: 'from-indigo-400 to-indigo-600', categoryKey: 'additionalServices' };
    default:
      return { icon: '❓', bgColor: 'from-gray-400 to-gray-600', categoryKey: 'other' };
  }
}
