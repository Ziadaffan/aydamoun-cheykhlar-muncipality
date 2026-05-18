import { TaxiStopsRepository } from '../repository/taxiStops.repository';

type TaxiStopData = {
  name: string;
  fromLocation: string;
  toLocation: string;
  hour: string;
  phone: string;
};

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
