export const mapServiceTypeToCategory = (serviceType: string): string => {
  switch (serviceType) {
    case 'LICENSEES_AND_CONSTRUCTION_SERVICES':
      return 'buildingLicenses';
    case 'ENVIRONMENTAL_SERVICES':
      return 'environmentalServices';
    case 'ADMINISTRATIVE_TRANSACTIONS':
      return 'administrativeTransactions';
    case 'COMPLAINTS_AND_SUGGESTIONS':
      return 'complaintsAndSuggestions';
    case 'ADDITIONAL_SERVICES':
      return 'additionalServices';
    default:
      return '';
  }
};
