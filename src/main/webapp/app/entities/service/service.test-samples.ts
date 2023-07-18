import { IService, NewService } from './service.model';

export const sampleWithRequiredData: IService = {
  id: 27291,
  nomS: 'red East',
};

export const sampleWithPartialData: IService = {
  id: 17418,
  nomS: 'when',
  description: 'Beauty',
};

export const sampleWithFullData: IService = {
  id: 21714,
  nomS: 'macerate liberate Iowa',
  description: 'implementation',
};

export const sampleWithNewData: NewService = {
  nomS: 'District Ball before',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
