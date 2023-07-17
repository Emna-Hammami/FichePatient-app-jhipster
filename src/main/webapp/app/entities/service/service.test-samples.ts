import { IService, NewService } from './service.model';

export const sampleWithRequiredData: IService = {
  id: 8053,
  nomS: 'Southeast Factors inasmuch',
};

export const sampleWithPartialData: IService = {
  id: 7942,
  nomS: 'transmitter Southwest',
  description: 'Rap',
};

export const sampleWithFullData: IService = {
  id: 31419,
  nomS: 'drive female bellows',
  description: 'bravely',
};

export const sampleWithNewData: NewService = {
  nomS: 'Coupe whenever deposit',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
