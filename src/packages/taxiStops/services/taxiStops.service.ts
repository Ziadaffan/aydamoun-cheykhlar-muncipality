import { TaxiStopsRepository } from '../repository/taxiStops.repository';
import { fieldReaders } from '@/packages/common/utils/request-body.utils';

type TaxiStopData = {
  name: string;
  fromLocation: string;
  toLocation: string;
  hour: string;
  phone: string;
  /** English versions: null clears, undefined leaves the stored value alone. */
  nameEn?: string | null;
  fromLocationEn?: string | null;
  toLocationEn?: string | null;
};

/**
 * The optional English fields of a taxi stop form: trimmed, '' → null (clears it),
 * absent → undefined (an update leaves the stored value alone). Same limits as the Arabic fields.
 */
export function readTaxiStopEnglish(formData: FormData) {
  const fields = fieldReaders(Object.fromEntries(formData), 'INVALID_TAXI_STOP');
  return {
    nameEn: fields.optionalText('nameEn', 150),
    fromLocationEn: fields.optionalText('fromLocationEn', 150),
    toLocationEn: fields.optionalText('toLocationEn', 150),
  };
}

export class TaxiStopsService {
  private static singleton: TaxiStopsService;
  private readonly repository: TaxiStopsRepository;

  constructor(repository: TaxiStopsRepository = new TaxiStopsRepository()) {
    this.repository = repository;
  }

  public static instance(): TaxiStopsService {
    if (!TaxiStopsService.singleton) {
      TaxiStopsService.singleton = new TaxiStopsService();
    }
    return TaxiStopsService.singleton;
  }

  public async getTaxiStops() {
    return this.repository.findMany();
  }

  public async getTaxiStopById(id: string) {
    return this.repository.findUnique(id);
  }

  public async create(taxiStopData: TaxiStopData) {
    return this.repository.create(taxiStopData);
  }

  public async updateTaxiStop(id: string, taxiStopData: TaxiStopData) {
    return this.repository.update(id, taxiStopData);
  }

  public async deleteTaxiStop(id: string): Promise<boolean> {
    try {
      await this.repository.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting taxi stop:', error);
      return false;
    }
  }
}
