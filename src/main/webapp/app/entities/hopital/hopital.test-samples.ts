import { IHopital, NewHopital } from './hopital.model';

export const sampleWithRequiredData: IHopital = {
  id: 24208,
  nomHop: 'Bronze Card',
};

export const sampleWithPartialData: IHopital = {
  id: 21935,
  nomHop: 'excluding',
};

export const sampleWithFullData: IHopital = {
  id: 29050,
  nomHop: 'Sleek',
};

export const sampleWithNewData: NewHopital = {
  nomHop: 'deliver azure',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
